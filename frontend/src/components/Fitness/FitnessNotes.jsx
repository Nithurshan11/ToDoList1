import React, { useEffect, useRef, useState } from "react";

export const FitnessNotes = ({ initialText, onChange }) => {
  const [text, setText] = useState(initialText || "");
  const [bg, setBg] = useState("#0f172a0d");
  const [color, setColor] = useState("inherit");
  const ref = useRef(null);

  useEffect(() => {
    setText(initialText || "");
  }, [initialText]);

  const applyFormat = (wrapper) => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    if (!ref.current || !ref.current.contains(range.commonAncestorContainer)) return;
    const selectedText = range.toString();
    if (!selectedText) return;
    const span = document.createElement("span");
    span.textContent = selectedText;
    if (wrapper === "b") span.style.fontWeight = "600";
    if (wrapper === "i") span.style.fontStyle = "italic";
    if (wrapper === "u") span.style.textDecoration = "underline";
    range.deleteContents();
    range.insertNode(span);
    setText(ref.current.innerHTML);
    onChange?.(ref.current.innerHTML);
  };

  const handleInput = () => {
    const value = ref.current?.innerHTML || "";
    setText(value);
    onChange?.(value);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: "0.3rem", marginBottom: "0.4rem", fontSize: 12 }}>
        <span style={{ color: "var(--muted)" }}>Fitness journal</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          <button type="button" onClick={() => applyFormat("b")}>
            B
          </button>
          <button type="button" onClick={() => applyFormat("i")}>
            I
          </button>
          <button type="button" onClick={() => applyFormat("u")}>
            U
          </button>
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{ fontSize: 11 }}
          >
            <option value="inherit">Text</option>
            <option value="#f97316">Orange</option>
            <option value="#22c55e">Green</option>
            <option value="#38bdf8">Blue</option>
          </select>
          <select
            value={bg}
            onChange={(e) => setBg(e.target.value)}
            style={{ fontSize: 11 }}
          >
            <option value="#0f172a0d">Soft</option>
            <option value="#fef3c7">Warm</option>
            <option value="#e0f2fe">Cool</option>
          </select>
        </div>
      </div>
      <div
        ref={ref}
        contentEditable
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: text }}
        style={{
          minHeight: 120,
          padding: "0.6rem 0.8rem",
          borderRadius: 14,
          border: "1px solid var(--border-subtle)",
          background: bg,
          color,
          resize: "vertical",
          overflow: "auto"
        }}
      />
    </div>
  );
};

