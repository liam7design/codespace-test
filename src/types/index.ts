export type ChecklistItem = { id: string; text: string; done: boolean };
export type Note = {
  id: string;
  title: string;
  body: string;
  checklist?: ChecklistItem[];
  updatedAt: number;
};