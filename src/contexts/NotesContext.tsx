import React, { createContext, useContext, useEffect, useState } from "react";
import { Note } from "../types";
import * as db from "../services/localDB";
import * as sync from "../services/sync";
import { nanoid } from "nanoid";

type Ctx = {
  notes: Note[];
  createQuick: (text: string) => Promise<Note>;
  createNote: () => Promise<Note>;
  update: (n: Note) => Promise<void>;
  remove: (id: string) => Promise<void>;
  syncNow: () => Promise<void>;
  searching: string;
  setSearching: (s: string) => void;
  loading: boolean;
};

const NotesContext = createContext<Ctx | null>(null);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searching, setSearching] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const all = await db.getAllNotes();
      setNotes(all.sort((a,b)=>b.updatedAt-a.updatedAt));
      setLoading(false);
      sync.startBackgroundSync(async (remoteNotes) => {
        const merged = await db.mergeRemote(remoteNotes);
        setNotes(merged.sort((a,b)=>b.updatedAt-a.updatedAt));
      });
    })();
  }, []);

  const createQuick = async (text: string) => {
    const n: Note = { id: nanoid(), title: text.slice(0,60), body: text, updatedAt: Date.now() };
    await db.saveNote(n);
    setNotes(s=>[n,...s]);
    sync.enqueueSync();
    return n;
  };

  const createNote = async () => {
    const n: Note = { id: nanoid(), title: "새 메모", body: "", checklist: [], updatedAt: Date.now() };
    await db.saveNote(n);
    setNotes(s=>[n,...s]);
    sync.enqueueSync();
    return n;
  };

  const update = async (n: Note) => {
    n.updatedAt = Date.now();
    await db.saveNote(n);
    setNotes(s => [n, ...s.filter(x=>x.id!==n.id)].sort((a,b)=>b.updatedAt-a.updatedAt));
    sync.enqueueSync();
  };

  const remove = async (id:string) => {
    await db.deleteNote(id);
    setNotes(s=>s.filter(x=>x.id!==id));
    sync.enqueueSync();
  };

  const syncNow = async () => {
    setLoading(true);
    await sync.syncNow();
    const all = await db.getAllNotes();
    setNotes(all.sort((a,b)=>b.updatedAt-a.updatedAt));
    setLoading(false);
  };

  return (
    <NotesContext.Provider value={{ notes, createQuick, createNote, update, remove, syncNow, searching, setSearching, loading }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const c = useContext(NotesContext);
  if (!c) throw new Error("useNotes must be used inside provider");
  return c;
};