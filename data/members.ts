export type Member = {
  name: string;
  part: string; // e.g. "Soprano", "Alto", "Tenor", "Bass", "Beatboxer"
  year: string; // e.g. "2026"
  major: string;
  bio: string;
  photo: string | null; // e.g. "/photos/jane-smith.jpg" — drop image in public/photos/
};

export const members: Member[] = [
  {
    name: "Name Here",
    part: "Soprano",
    year: "2026",
    major: "Your Major",
    bio: "Hometown, fun fact, favorite song you've performed — keep it short and you.",
    photo: null,
  },
  {
    name: "Name Here",
    part: "Alto",
    year: "2027",
    major: "Your Major",
    bio: "Hometown, fun fact, favorite song you've performed.",
    photo: null,
  },
  {
    name: "Name Here",
    part: "Tenor",
    year: "2025",
    major: "Your Major",
    bio: "Hometown, fun fact, favorite song you've performed.",
    photo: null,
  },
  {
    name: "Name Here",
    part: "Bass",
    year: "2026",
    major: "Your Major",
    bio: "Hometown, fun fact, favorite song you've performed.",
    photo: null,
  },
];
