/*
 * Integration tests for the reserve_seats() Postgres function.
 */

import { describe, test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const skip = !URL || !ANON_KEY || !SERVICE_KEY
  ? "set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY in .env.local"
  : false;

// anon = what the browser uses. admin = setup/teardown only, bypasses RLS.
const anon = skip ? null : createClient(URL, ANON_KEY);
const admin = skip ? null : createClient(URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

const uuid = () => crypto.randomUUID();

describe("reserve_seats", { skip }, () => {
  const SEATS = 6;
  let showId;

  beforeEach(async () => {
    const { data, error } = await admin
      .from("shows")
      .insert({
        title: "TEST — automated",
        date: "2099-01-01",
        time: "7:00 PM",
        venue: "Test Venue",
        total_seats: SEATS,
        tickets_sold: 0,
        tickets_open: true,
      })
      .select()
      .single();
    assert.equal(error, null, "failed to create test show");
    showId = data.id;
  });

  afterEach(async () => {
    // reservations cascade on show delete
    if (showId) await admin.from("shows").delete().eq("id", showId);
    showId = null;
  });

  // ── helpers ────────────────────────────────────────────────────────────

  const reserve = ({ qty = 1, email = "test@example.com", key = uuid(), id = showId } = {}) =>
    anon.rpc("reserve_seats", {
      p_show_id: id,
      p_name: "Test Person",
      p_email: email,
      p_qty: qty,
      p_notes: null,
      p_idempotency_key: key,
    });

  async function soldCount() {
    const { data } = await admin
      .from("shows")
      .select("tickets_sold")
      .eq("id", showId)
      .single();
    return data.tickets_sold;
  }

  async function reservationCount() {
    const { count } = await admin
      .from("reservations")
      .select("*", { count: "exact", head: true })
      .eq("show_id", showId);
    return count;
  }

  // ── happy path ─────────────────────────────────────────────────────────

  test("creates a reservation and increments tickets_sold", async () => {
    const { error } = await reserve({ qty: 2 });

    assert.equal(error, null);
    assert.equal(await soldCount(), 2);
    assert.equal(await reservationCount(), 1);
  });

  // ── idempotency ────────────────────────────────────────────────────────

  test("replaying the same idempotency key does not double-book", async () => {
    const key = uuid();

    const first = await reserve({ qty: 2, key });
    const second = await reserve({ qty: 2, key });

    assert.equal(first.error, null);
    assert.equal(second.error, null, "a replay should succeed, not error");
    assert.equal(await soldCount(), 2, "seats must not be counted twice");
    assert.equal(await reservationCount(), 1, "must not create a second row");
  });

  test("a replay returns the original reservation", async () => {
    const key = uuid();

    const first = await reserve({ qty: 1, key });
    const second = await reserve({ qty: 1, key });

    assert.equal(second.data.id, first.data.id);
  });

  test("same person can place multiple distinct orders", async () => {
    const email = "repeat@example.com";

    const a = await reserve({ qty: 1, email, key: uuid() });
    const b = await reserve({ qty: 3, email, key: uuid() });

    assert.equal(a.error, null);
    assert.equal(b.error, null);
    assert.notEqual(a.data.id, b.data.id, "distinct keys must create distinct rows");
    assert.equal(await soldCount(), 4);
    assert.equal(await reservationCount(), 2);
  });

  // ── capacity ───────────────────────────────────────────────────────────

  test("rejects an order larger than remaining capacity", async () => {
    const { error } = await reserve({ qty: SEATS + 2 });

    assert.ok(error, "should have been rejected");
    assert.match(error.message, /seats remaining/);
    assert.equal(await soldCount(), 0, "a rejected order must not change the count");
    assert.equal(await reservationCount(), 0, "a rejected order must not insert");
  });

  test("rejects an order that would exceed capacity after earlier sales", async () => {
    await reserve({ qty: 4 });
    const { error } = await reserve({ qty: 4 }); // 4 + 4 > 6

    assert.ok(error);
    assert.equal(await soldCount(), 4, "the first order stands, the second is refused");
  });

  test("allows an order that exactly fills the show", async () => {
    const { error } = await reserve({ qty: SEATS });

    assert.equal(error, null);
    assert.equal(await soldCount(), SEATS);
  });

  // ── concurrency: the reason for `for update` ───────────────────────────

  test("concurrent orders do not lose updates", async () => {
    const [a, b] = await Promise.all([
      reserve({ qty: 2, key: uuid() }),
      reserve({ qty: 3, key: uuid() }),
    ]);

    assert.equal(a.error, null);
    assert.equal(b.error, null);
    // Without the row lock this reads 2 or 3 instead of 5.
    assert.equal(await soldCount(), 5);
    assert.equal(await reservationCount(), 2);
  });

  test("concurrent orders cannot oversell", async () => {
    const results = await Promise.all([
      reserve({ qty: 4, key: uuid() }),
      reserve({ qty: 4, key: uuid() }), // together 8 > 6
    ]);

    const ok = results.filter((r) => !r.error);
    assert.equal(ok.length, 1, "exactly one of the two should succeed");
    assert.equal(await soldCount(), 4);
  });

  // ── guards ─────────────────────────────────────────────────────────────

  test("rejects a show that is not open for tickets", async () => {
    await admin.from("shows").update({ tickets_open: false }).eq("id", showId);

    const { error } = await reserve({ qty: 1 });

    assert.ok(error);
    assert.match(error.message, /not open/);
  });

  test("rejects an unknown show", async () => {
    const { error } = await reserve({ id: "00000000-0000-0000-0000-000000000000" });

    assert.ok(error);
    assert.match(error.message, /show not found/);
  });

  // ── RLS: the function must be the only way in ──────────────────────────

  test("anon cannot insert into reservations directly", async () => {
    const { error } = await anon.from("reservations").insert({
      show_id: showId,
      name: "Bypass",
      email: "bypass@example.com",
      qty: 1,
      status: "pending",
    });

    assert.ok(error, "direct insert must be blocked");
    assert.equal(error.code, "42501", "expected row-level security violation");
    assert.equal(await reservationCount(), 0);
  });

  test("anon cannot update tickets_sold directly", async () => {
    await anon.from("shows").update({ tickets_sold: 999 }).eq("id", showId);

    // RLS filters the update to zero rows rather than erroring.
    assert.equal(await soldCount(), 0, "anon must not be able to move the count");
  });
});
