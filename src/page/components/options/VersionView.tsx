
export function VersionView({
  manifest,
}: {
  manifest: chrome.runtime.Manifest;
}) {
  const id = chrome.runtime.id;
  return (
    <div className="mt-4 text-sm text-slate-500 flex space-x-2 cursor-pointer">
      <a href="https://x.com/KanColleWidget" target="_blank" className="hover:text-sky-500 transition-all">
        <div>v{manifest.version} - {manifest.name} - {id}</div>
      </a>
    </div>
  );
}