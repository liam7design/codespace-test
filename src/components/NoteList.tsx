import React, { useState } from "react";
import { Note } from "../types";

export default function NoteList({ notes, activeId, onSelect, onQuick }: { notes: Note[]; activeId: string | null; onSelect: (id:string)=>void; onQuick:(text:string)=>Promise<void> }){
  const [quick, setQuick] = useState("");
  return (
    <div>
      <div style={{display:"flex",gap:8,marginBottom:8}}>
        <input value={quick} onChange={e=>setQuick(e.target.value)} placeholder="즉시 입력..." style={{flex:1,padding:8,borderRadius:8,background:"transparent",border:"1px solid rgba(255,255,255,0.03)",color:"var(--accent-text)"}} />
        <button className="btn" onClick={async ()=>{ if(quick.trim()){ await onQuick(quick.trim()); setQuick(""); }}}>Add</button>
      </div>
      <div className="note-list">
        {notes.map(n=>(
          <div key={n.id} className={"note-item "+(n.id===activeId ? "active": "")} onClick={()=>onSelect(n.id)}>
            <div style={{fontWeight:700}}>{n.title || "무제"}</div>
            <div style={{fontSize:12,color:"var(--muted)"}}>{new Date(n.updatedAt).toLocaleString()}</div>
          </div>
        ))}
        {notes.length===0 && <div style={{color:"var(--muted)",padding:10}}>메모 없음 — 즉시 입력으로 빠르게 추가하세요.</div>}
      </div>
    </div>
  );
}