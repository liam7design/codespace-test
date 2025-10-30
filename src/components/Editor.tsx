import React, { useEffect, useState } from "react";
import { Note } from "../types";

export default function Editor({ note, onSave, onDelete }: { note: Note | null; onSave: (n:Note)=>Promise<void>; onDelete:(id:string)=>Promise<void> }){
  const [local, setLocal] = useState<Note | null>(note ?? null);

  useEffect(()=> setLocal(note ?? null), [note]);

  if (!local) return <div style={{padding:20,color:"var(--muted)"}}>왼쪽에서 메모를 선택하거나 새 메모를 만드세요.</div>;

  return (
    <div className="editor">
      <textarea className="title" value={local.title} onChange={e=>setLocal({...local, title:e.target.value})} />
      <textarea className="body" value={local.body} onChange={e=>setLocal({...local, body:e.target.value})} />
      <div className="checklist">
        {(local.checklist ?? []).map(item => (
          <label key={item.id} style={{display:"flex",gap:8,alignItems:"center"}}>
            <input type="checkbox" checked={item.done} onChange={e=>{ const cl = (local.checklist ?? []).map(c=> c.id===item.id ? {...c,done:e.target.checked} : c); setLocal({...local, checklist:cl}); }} />
            <input style={{flex:1,background:"transparent",border:"none",color:"var(--muted)"}} value={item.text} onChange={e=>{ const cl = (local.checklist ?? []).map(c=> c.id===item.id ? {...c,text:e.target.value} : c); setLocal({...local, checklist:cl}); }} />
          </label>
        ))}
        <button className="small" onClick={()=>{ const id = crypto.randomUUID(); const cl = [...(local.checklist ?? []), {id,text:"",done:false}]; setLocal({...local, checklist:cl}); }}>항목 추가</button>
      </div>

      <div className="footer">
        <div style={{color:"var(--muted)",fontSize:13}}>{new Date(local.updatedAt).toLocaleString()}</div>
        <div>
          <button className="small" onClick={()=>{ if(local) onDelete(local.id); }}>삭제</button>
          <button className="btn" style={{marginLeft:8}} onClick={()=>{ if(local) onSave(local); }}>저장</button>
        </div>
      </div>
    </div>
  );
}