"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Member } from "@/lib/types";

type MemberInput = {
  name: string;
  part: string;
  year: string;
  major: string;
  bio: string;
};

const EMPTY: MemberInput = { name: "", part: "Soprano", year: "", major: "", bio: "" };
const PARTS = ["Soprano", "Alto", "Tenor", "Bass", "Beatboxer"];
const INPUT = "rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition w-full";

export default function MembersManager({ initialMembers }: { initialMembers: Member[] }) {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [editing, setEditing] = useState<Member | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<MemberInput>(EMPTY);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  function openCreate() {
    setForm(EMPTY);
    setPhotoFile(null);
    setEditing(null);
    setCreating(true);
  }

  function openEdit(member: Member) {
    setForm({
      name: member.name,
      part: member.part,
      year: member.year ?? "",
      major: member.major ?? "",
      bio: member.bio ?? "",
    });
    setPhotoFile(null);
    setEditing(member);
    setCreating(false);
  }

  async function uploadPhoto(file: File): Promise<string | null> {
    const ext = file.name.split(".").pop();
    const path = `members/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("photos").upload(path, file);
    if (error) return null;
    const { data } = supabase.storage.from("photos").getPublicUrl(path);
    return data.publicUrl;
  }

  async function saveMember() {
    setSaving(true);
    let photoUrl = editing?.photo_url ?? null;

    if (photoFile) {
      const url = await uploadPhoto(photoFile);
      if (url) photoUrl = url;
    }

    const payload = {
      name: form.name,
      part: form.part,
      year: form.year || null,
      major: form.major || null,
      bio: form.bio || null,
      photo_url: photoUrl,
      display_order: editing?.display_order ?? members.length,
    };

    if (editing) {
      const { data } = await supabase
        .from("members")
        .update(payload)
        .eq("id", editing.id)
        .select()
        .single();
      if (data) setMembers((prev) => prev.map((m) => (m.id === data.id ? data : m)));
    } else {
      const { data } = await supabase.from("members").insert(payload).select().single();
      if (data) setMembers((prev) => [...prev, data]);
    }

    setSaving(false);
    setEditing(null);
    setCreating(false);
    router.refresh();
  }

  async function deleteMember(id: string) {
    if (!confirm("Remove this member?")) return;
    await supabase.from("members").delete().eq("id", id);
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  const isOpen = creating || editing !== null;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted">{members.length} member{members.length !== 1 ? "s" : ""}</p>
        <button
          onClick={openCreate}
          className="px-5 py-2 rounded-full bg-navy text-white text-sm font-semibold hover:bg-navy-light transition-colors"
        >
          + Add Member
        </button>
      </div>

      {/* Form */}
      {isOpen && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-navy mb-5">{editing ? "Edit Member" : "New Member"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-navy uppercase tracking-widest">Name</span>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={INPUT} />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-navy uppercase tracking-widest">Voice Part</span>
              <select value={form.part} onChange={(e) => setForm({ ...form, part: e.target.value })} className={INPUT}>
                {PARTS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-navy uppercase tracking-widest">Class Year</span>
              <input value={form.year} placeholder="2026" onChange={(e) => setForm({ ...form, year: e.target.value })} className={INPUT} />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-navy uppercase tracking-widest">Major</span>
              <input value={form.major} onChange={(e) => setForm({ ...form, major: e.target.value })} className={INPUT} />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <span className="text-xs font-medium text-navy uppercase tracking-widest">Bio</span>
              <textarea value={form.bio} rows={3} onChange={(e) => setForm({ ...form, bio: e.target.value })} className={INPUT + " resize-none"} />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-navy uppercase tracking-widest">Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
                className="text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-navy file:text-white file:px-4 file:py-1.5 file:text-xs file:font-semibold"
              />
              {editing?.photo_url && !photoFile && (
                <p className="text-xs text-muted">Current photo on file</p>
              )}
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={saveMember} disabled={saving || !form.name} className="px-6 py-2 rounded-full bg-navy text-white text-sm font-semibold hover:bg-navy-light transition-colors disabled:opacity-50">
              {saving ? "Saving…" : "Save"}
            </button>
            <button onClick={() => { setEditing(null); setCreating(false); }} className="px-6 py-2 rounded-full border border-gray-200 text-sm text-muted hover:text-navy transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Members grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <div key={member.id} className="bg-white rounded-2xl border border-gray-200 p-4 flex gap-4 items-start">
            <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center shrink-0 overflow-hidden">
              {member.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl">🎵</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-navy text-sm truncate">{member.name}</p>
              <p className="text-xs text-muted">{member.part} · {member.year ?? "?"}</p>
              <p className="text-xs text-muted truncate">{member.major ?? ""}</p>
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              <button onClick={() => openEdit(member)} className="text-xs text-navy/60 hover:text-navy">Edit</button>
              <button onClick={() => deleteMember(member.id)} className="text-xs text-red-400 hover:text-red-600">Remove</button>
            </div>
          </div>
        ))}
        {members.length === 0 && (
          <p className="text-muted text-sm py-8 sm:col-span-2 lg:col-span-3">No members yet.</p>
        )}
      </div>
    </div>
  );
}
