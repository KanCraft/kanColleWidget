import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export function FoldableSection({ title, children, id }: { title: string, children: React.ReactNode, id?: string }) {
  const [search] = useSearchParams();
  const [open, setOpen] = useState(id && search.get("open")?.split(",").includes(id));
  return (
    <div className="mb-4">
      <div className="mb-2 transition hover:text-teal-600" onClick={() => setOpen(!open)}>
        <h1 id={id} className={"text-2xl font-bold cursor-pointer fold " + (open ? "open" : "close")}>{title}</h1>
      </div>
      {open && <div>{children}</div>}
    </div>
  );
}