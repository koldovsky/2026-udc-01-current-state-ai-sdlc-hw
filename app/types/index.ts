export interface Part {
  id: string;
  name: string;
  quantity: number;
  material: string;
  printTime: string;
}

export interface Robot {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  difficulty: "easy" | "medium" | "hard";
  buildTime: string;
  instructions: string[];
  parts: Part[];
}
