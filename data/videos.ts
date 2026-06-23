export type Video = {
  youtubeId: string; // the part after "?v=" in the YouTube URL
  title: string;
  show: string;
  year: number;
};

// To get a YouTube ID: https://youtube.com/watch?v=XXXXXXXXXXX → "XXXXXXXXXXX"
export const videos: Video[] = [
  {
    youtubeId: "dQw4w9WgXcQ", // replace with real ID
    title: "Song Title",
    show: "Fall Showcase",
    year: 2024,
  },
  {
    youtubeId: "dQw4w9WgXcQ", // replace with real ID
    title: "Song Title",
    show: "Spring Concert",
    year: 2024,
  },
  {
    youtubeId: "dQw4w9WgXcQ", // replace with real ID
    title: "Song Title",
    show: "Fall Showcase",
    year: 2023,
  },
];
