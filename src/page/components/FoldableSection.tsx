import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export function FoldableSection({ title, children, id }: { title: string, children: React.ReactNode, id?: string }) {
  const [search, setSearch] = useSearchParams();
  const [open, setOpen] = useState(id && search.get("open")?.split(",").includes(id));
  return (
    <div className="mb-4">
      <div className="mb-2 transition hover:text-teal-600" onClick={() => {
        const next = !open;
        setOpen(next);
        const opens = (search.get("open")?.split(",") || []).filter(Boolean);
        if (!next && opens.includes(id!)) search.set("open", opens.filter(v => v !== id).join(","));
        if (next && !opens.includes(id!)) search.set("open", opens.concat(id || "").join(","));
        if (search.get("open") === "") search.delete("open");
        setSearch(search);
      }}>
        <h1 id={id} className={"text-2xl font-bold cursor-pointer fold " + (open ? "open" : "close")}>{title}</h1>
      </div>
      {open && <div>{children}</div>}
    </div>
  );
}