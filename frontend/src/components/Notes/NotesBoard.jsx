import React, { useEffect, useState } from "react";
import { createNotesService } from "../../services/notesService.js";
import { useAuth } from "../../context/AuthContext.jsx";

const palette = ["#FDE68A", "#A5B4FC", "#BFDBFE", "#F9A8D4", "#BBF7D0"];

const NoteCard = ({ note, onChange, onDelete }) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      style={{
        width: "clamp(160px, 25vw, 200px)",
        minHeight: "clamp(120px, 20vw, 140px)",
        padding: "clamp(0.6rem, 2vw, 0.8rem)",
        borderRadius: 8,
        background: note.color,
        boxShadow: hover
          ? "0 18px 30px rgba(15,23,42,0.25)"
          : "0 10px 18px rgba(15,23,42,0.18)",
        transform: "rotate(-1.5deg)",
        position: "relative",
        cursor: "pointer",
        transition: "transform 120ms ease, box-shadow 120ms ease",
        whiteSpace: "pre-wrap",
        fontFamily: '"Kalam", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onDoubleClick={() => {
        const next = window.prompt("Edit note", note.content);
        if (next !== null) onChange({ ...note, content: next });
      }}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(note._id);
        }}
        style={{
          position: "absolute",
          top: 6,
          right: 6,
          border: "none",
          borderRadius: 999,
          width: "clamp(24px, 4vw, 28px)",
          height: "clamp(24px, 4vw, 28px)",
          fontSize: "clamp(12px, 2vw, 14px)",
          cursor: "pointer",
          background: "rgba(15,23,42,0.6)",
          color: "white",
          minWidth: 44,
          minHeight: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        ×
      </button>
      <div style={{ fontSize: "clamp(12px, 2vw, 13px)" }}>{note.content}</div>
    </div>
  );
};

export const NotesBoard = () => {
  const { token } = useAuth();
  const notesService = createNotesService(() => token);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [color, setColor] = useState(palette[0]);

  useEffect(() => {
    const load = async () => {
      const all = await notesService.list();
      setNotes(all);
    };
    load();
  }, []);

  const addNote = async () => {
    if (!newNote.trim()) return;
    const created = await notesService.create({ content: newNote, color });
    setNotes((n) => [created, ...n]);
    setNewNote("");
  };

  const updateNote = async (updated) => {
    const saved = await notesService.update(updated._id, {
      content: updated.content,
      color: updated.color,
      position: updated.position
    });
    setNotes((current) => current.map((n) => (n._id === saved._id ? saved : n)));
  };

  const deleteNote = async (id) => {
    await notesService.remove(id);
    setNotes((n) => n.filter((x) => x._id !== id));
  };

  return (
    <div>
      <div
        className="notes-board-input-row"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          marginBottom: "1rem"
        }}
      >
        <input
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Write a sticky note..."
          style={{
            flex: 1,
            padding: "clamp(0.5rem, 1.5vw, 0.55rem) clamp(0.7rem, 2vw, 0.8rem)",
            borderRadius: 999,
            border: "1px solid var(--border-subtle)",
            fontSize: "clamp(13px, 1.5vw, 14px)",
            minHeight: 44
          }}
        />
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          {palette.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              style={{
                width: "clamp(28px, 4vw, 32px)",
                height: "clamp(28px, 4vw, 32px)",
                borderRadius: 999,
                border: color === c ? "2px solid #0f172a" : "1px solid rgba(15,23,42,0.2)",
                background: c,
                cursor: "pointer",
                minWidth: 44,
                minHeight: 44
              }}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={addNote}
          style={{
            borderRadius: 999,
            border: "none",
            padding: "clamp(0.45rem, 1.5vw, 0.5rem) clamp(0.7rem, 2vw, 0.9rem)",
            background: "linear-gradient(135deg, var(--primary), var(--primary-soft))",
            color: "white",
            cursor: "pointer",
            fontSize: "clamp(12px, 1.5vw, 13px)",
            minHeight: 44,
            whiteSpace: "nowrap"
          }}
        >
          Add note
        </button>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "clamp(0.6rem, 2vw, 0.9rem)"
        }}
      >
        {notes.map((note) => (
          <NoteCard key={note._id} note={note} onChange={updateNote} onDelete={deleteNote} />
        ))}
      </div>
    </div>
  );
};

