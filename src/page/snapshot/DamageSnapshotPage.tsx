import { useEffect, useState } from "react"

export function DamageSnapshotPage() {
  const [uris, setURIs] = useState<string[]>([]);
  const [label, setLabel] = useState<string | null>(null);
  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.__action__ === "/dsnapshot/separate:push") {
        setURIs((prev) => [...prev, msg.uri as string]);
        if (msg.label) setLabel(msg.label as string);
      }
    });
    document.title = "艦隊状況";
    // TODO: このウィンドウのサイズ・位置を保存して次回起動時に復元する
  }, []);
  // 海域 (連戦数) ラベルをタイトルにも反映する（#1764）
  useEffect(() => {
    document.title = label ? `艦隊状況 ${label}` : "艦隊状況";
  }, [label]);
  return (
    <div id="damage-snapshot-page-root" style={{
      position: "relative",
      display: "flex",
      flexDirection: "row-reverse",
      width: "max-content",
      height: "100vh",
    }}>
      {label && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          background: "rgba(0,0,0,0.6)",
          color: "#fff",
          fontSize: 12,
          lineHeight: 1.4,
          padding: "2px 6px",
          zIndex: 1,
          whiteSpace: "nowrap",
        }}>{label}</div>
      )}
      {uris.map((uri, i) => (
        <div key={i} className="snapshot-item">
          <img src={uri} alt={`Damage Snapshot ${i + 1}`} style={{
            height: "100%",
          }} />
        </div>
      ))}
    </div>
  )
}