export type Material = "PLA" | "PETG" | "TPU";

export interface Part {
  id: string;
  name: string;
  quantity: number;
  material: Material;
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

export interface RobotDetailPageProps {
  params: Promise<{ id: string }>;
}

export interface PartsPageProps {
  params: Promise<{ id: string }>;
}

export interface RobotsPageProps {
  searchParams: Promise<{ q?: string }>;
}

export interface SearchBarProps {
  defaultValue?: string;
}
