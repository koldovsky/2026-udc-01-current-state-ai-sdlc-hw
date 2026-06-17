export interface Contact {
  name: string;
  role: string;
  email: string;
  makerworld: string | null;
  note: string;
}

export const contacts: Contact[] = [
  {
    name: "Spike_Doc",
    role: "Creator & Designer",
    email: "spike.doc@makerworld.com",
    makerworld: "https://makerworld.com/en/@Spike_Doc",
    note: "Original robot designs and assembly instructions.",
  },
  {
    name: "Workshop Team",
    role: "3D Printing Support",
    email: "workshop@makerworld.com",
    makerworld: null,
    note: "Questions about print settings, materials, and hardware.",
  },
];
