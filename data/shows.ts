export type Show = {
  id: string;
  title: string;
  date: string; // ISO: "YYYY-MM-DD"
  time: string;
  venue: string;
  description: string;
  price: number | null; // null = TBD
  ticketsOpen: boolean;
};

export const shows: Show[] = [
  {
    id: "fall-showcase-2025-7pm",
    title: "Fall Showcase 2025",
    date: "2025-09-27",
    time: "7:00 PM",
    venue: "Bailey Hall, Cornell University",
    description:
      "Our flagship fall concert. Brand new arrangements, surprise guests, and good vibes.",
    price: 8,
    ticketsOpen: true,
  },
  {
    id: "fall-showcase-2025-930pm",
    title: "Fall Showcase 2025",
    date: "2025-09-27",
    time: "9:30 PM",
    venue: "Bailey Hall, Cornell University",
    description:
      "Our flagship fall concert. Brand new arrangements, surprise guests, and good vibes.",
    price: 8,
    ticketsOpen: true,
  },
  {
    id: "winter-concert-2025",
    title: "Winter Concert 2025",
    date: "2025-12-06",
    time: "8:00 PM",
    venue: "TBD",
    description:
      "End the semester with us. Holiday vibes, new songs, and a great crowd.",
    price: null,
    ticketsOpen: false,
  },
];
