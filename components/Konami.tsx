"use client";
import { useEffect, useState } from "react";

const CODE = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];

export default function Konami() {
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    let i = 0;
    const k = (e: KeyboardEvent) => {
      i = e.key.toLowerCase() === CODE[i].toLowerCase() ? i + 1 : (e.key === CODE[0] ? 1 : 0);
      if (i === CODE.length) {
        i = 0;
        const on = document.body.classList.toggle("god-mode");
        setMsg(on ? "★ ACHIEVEMENT UNLOCKED: GOD MODE" : "GOD MODE OFF");
        setTimeout(() => setMsg(null), 2600);
      }
    };
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, []);
  return msg ? <div className="toast" role="status">{msg}</div> : null;
}
