export interface Track {
  id: string;
  name: string;
  description: string;
  color: string;
  accentColor: string;
  chords: string[][]; // Musical notes for synth playback (e.g. ["C4","E4","G4","B4"])
}

export type RoomView = "left" | "center" | "right";

export interface PosterState {
  id: string;
  title: string;
  svgString: string;
  isGenerating: boolean;
}

export interface StickyNote {
  id: string;
  text: string;
  color: string;
  rotation: number; // degrees for natural, messy post-it look
  createdAt: number;
}
