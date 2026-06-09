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
      display: "flex",
      flexDirection: "column",
      height: "100vh",
    }}>
      {label && (
        <div style={{
          background: "rgba(0,0,0,0.8)",
          color: "#fff",
          fontSize: 12,
          lineHeight: 1.4,
          padding: "2px 6px",
          whiteSpace: "nowrap",
          flex: "none",
        }}>{label}</div>
      )}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "row-reverse",
        minHeight: 0,
      }}>
        {uris.map((uri, i) => (
          <div key={i} className="snapshot-item" style={{
            flex: 1,
            backgroundImage: `url(${uri})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "top center",
          }} />
        ))}
      </div>
    </div>
  )
}