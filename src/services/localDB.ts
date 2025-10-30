import localforage from "localforage";
import { Note } from "../types";

const store = localforage.createInstance({ name: "notes-db" });

export async function saveNote(note: Note) {
  await store.setItem(note.id, note);
}

export async function getAllNotes(): Promise<Note[]> {
  const notes: Note[] = [];
  await store.iterate<Note, void>((v) => { if (v) notes.push(v); });
  return notes;
}

export async function getNote(id: string): Promise<Note | null> {
  return (await store.getItem<Note>(id)) ?? null;
}

export async function deleteNote(id: string) {
  await store.removeItem(id);
}

export async function mergeRemote(remoteNotes: Note[]): Promise<Note[]> {
  const local = await getAllNotes();
  const map = new Map<string, Note>();
  local.forEach(n=>map.set(n.id, n));
  remoteNotes.forEach(r=>{
    const l = map.get(r.id);
    if (!l || r.updatedAt > l.updatedAt) map.set(r.id, r);
  });
  for (const n of map.values()) {
    await saveNote(n);
  }
  return Array.from(map.values());
}