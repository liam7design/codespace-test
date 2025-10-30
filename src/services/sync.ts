import { Note } from "../types";
import * as db from "./localDB";

const REMOTE_URL = (import.meta.env.VITE_REMOTE_SYNC_URL as string) || "";
let pending = false;
let listeners: ((notes: Note[])=>void)[] = [];

export function enqueueSync(){
  if (pending) return;
  pending = true;
  setTimeout(()=>{ pending=false; syncNow().catch(()=>{}); }, 1000);
}

export async function syncNow(){
  try{
    const local = await db.getAllNotes();
    if (!REMOTE_URL) return;
    await fetch(REMOTE_URL + "/push", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ notes: local })
    });
    const res = await fetch(REMOTE_URL + "/pull");
    if (res.ok){
      const payload = await res.json();
      const merged = await db.mergeRemote(payload.notes as Note[]);
      listeners.forEach(cb=>cb(merged));
    }
  }catch(e){
    // 오프라인/네트워크 실패 무시
  }
}

export function startBackgroundSync(onRemoteMerge: (notes: Note[])=>void){
  listeners.push(onRemoteMerge);
  setInterval(async ()=> {
    if (REMOTE_URL) {
      try{
        const res = await fetch(REMOTE_URL + "/pull");
        if (res.ok){
          const payload = await res.json();
          const merged = await db.mergeRemote(payload.notes as Note[]);
          listeners.forEach(cb=>cb(merged));
        }
      }catch{}
    }
  }, 30000);
}