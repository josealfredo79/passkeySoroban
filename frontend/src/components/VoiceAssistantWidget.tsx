"use client";
import VoiceAssistant from "./VoiceAssistant";

import { useState } from "react";

export default function VoiceAssistantWidget() {
  const [visible, setVisible] = useState(true);

  return (
    <>
      {visible ? (
        <div style={{position: "fixed", bottom: 24, right: 24, zIndex: 1000, maxWidth: 400}}>
          <div style={{position: "absolute", top: 8, right: 8, zIndex: 1100}}>
            <button
              onClick={() => setVisible(false)}
              style={{background: "#eee", borderRadius: "50%", border: "none", width: 32, height: 32, boxShadow: "0 1px 4px #0002", cursor: "pointer"}}
              title="Cerrar asistente"
            >✖️</button>
          </div>
          <VoiceAssistant />
        </div>
      ) : (
        <button
          onClick={() => setVisible(true)}
          style={{position: "fixed", bottom: 24, right: 24, zIndex: 1000, background: "#a855f7", color: "#fff", borderRadius: "50%", border: "none", width: 48, height: 48, fontSize: 24, boxShadow: "0 1px 8px #0003", cursor: "pointer"}}
          title="Abrir asistente de voz"
        >🎤</button>
      )}
    </>
  );
}
