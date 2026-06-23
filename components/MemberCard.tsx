import Image from "next/image";
import type { Member } from "@/lib/types";

const PART_COLORS: Record<string, string> = {
  Soprano: "bg-pink-50 text-pink-700",
  Alto: "bg-purple-50 text-purple-700",
  Tenor: "bg-blue-50 text-blue-700",
  Bass: "bg-indigo-50 text-indigo-700",
  Beatboxer: "bg-green-50 text-green-700",
};

export default function MemberCard({ member }: { member: Member }) {
  const partColor =
    PART_COLORS[member.part] ?? "bg-gray-100 text-gray-600";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Photo */}
      <div className="aspect-[4/5] bg-surface relative overflow-hidden">
        {member.photo_url ? (
          <Image
            src={member.photo_url}
            alt={member.name}
            fill
            className="object-cover object-top"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-4xl text-gray-300">
            🎵
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-navy text-base">{member.name}</h3>
          <span
            className={`text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap ${partColor}`}
          >
            {member.part}
          </span>
        </div>
        <p className="text-xs text-muted mb-3">
          Class of {member.year} · {member.major}
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">{member.bio}</p>
      </div>
    </div>
  );
}
