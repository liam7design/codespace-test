import React from "react";
import { NotesProvider } from "./contexts/NotesContext";
import Home from "./pages/Home";

export default function App() {
  return (
    <NotesProvider>
      <Home />
    </NotesProvider>
  );
}