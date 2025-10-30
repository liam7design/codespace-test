import React, { useMemo, useState } from "react";
import { useNotes } from "../contexts/NotesContext";
import NoteList from "../components/NoteList";
import Editor from "../components/Editor";

export default function Home(){
  const ctx = useNotes();
  const [activeId, setActiveId] = useState<string | null>(null);

  const filtered = useMemo(()=> {
    const q = ctx.searching.trim().toLowerCase();
    if (!q) return ctx.notes;
    return ctx.notes.filter(n => (n.title + "\n" + n.body).toLowerCase().includes(q));
  }, [ctx.notes, ctx.searching]);

  const active = ctx.notes.find(n=>n.id===activeId) ?? filtered[0] ?? null;

  return (
    <div className="app">
      <div className="content">
        <div className="header">
          <div className="brand">
            <div className="logo">N</div>
            <div>
              <div style={{fontWeight:700}}>Pantone 2026 Notes</div>
              <div style={{color:"var(--muted)",fontSize:12}}>간결 · 빠름 · 오프라인 우선 · 안정적 동기화</div>
            </div>
          </div>
          <div>
            <button className="small" onClick={()=>ctx.createNote()}>새 메모</button>
            <button className="btn" style={{marginLeft:8}} onClick={()=>ctx.syncNow()}>Sync</button>
          </div>
        </div>

        <Editor note={active} onSave={ctx.update} onDelete={ctx.remove} />
      </div>

      <div className="sidebar">
        <div style={{marginBottom:8}}>
          <input className="search" placeholder="검색 또는 즉시 입력" value={ctx.searching} onChange={e=>ctx.setSearching(e.target.value)} style={{width:"100%",padding:10,borderRadius:10,background:"transparent",border:"1px solid rgba(255,255,255,0.03)",color:"var(--accent-text"}} />
        </div>
        <NoteList notes={filtered} activeId={active?.id ?? null} onSelect={setActiveId} onQuick={ctx.createQuick} />
      </div>
    </div>
  );
}