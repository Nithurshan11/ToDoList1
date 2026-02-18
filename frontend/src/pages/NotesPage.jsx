import React from "react";
import { NotesBoard } from "../components/Notes/NotesBoard.jsx";

export const NotesPage = () => {
  return (
    <div className="page-pad">
      <h2 style={{ marginTop: 0, marginBottom: "0.5rem", fontSize: "clamp(20px, 4vw, 24px)" }}>Sticky notes</h2>
      <NotesBoard />
    </div>
  );
};

