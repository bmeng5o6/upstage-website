import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MemberCard from "@/components/MemberCard";
import { members } from "@/data/members";

export const metadata = {
  title: "Members — Upstage A Cappella",
};

export default function MembersPage() {
  return (
    <>
      <Navbar />

      <main className="flex-1 pt-24">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">
            The Group
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-navy leading-tight mb-3">
            Meet the members.
          </h1>
          <p className="text-gray-500 mb-12 max-w-xl">
            We&apos;re a co-ed group of singers from all walks of campus life.
            Click to learn more about each of us.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {members.map((member) => (
              <MemberCard key={member.name} member={member} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
