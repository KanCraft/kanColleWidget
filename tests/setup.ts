import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// jstorm (chrome/local) は import 時に chrome.storage.local を参照するため、jsdom 環境では
// chrome が未定義だと Model を import しただけで ReferenceError になる。Model 層をテスト可能に
// するための最小限の in-memory モックをグローバルに用意する（実 chrome は無いので副作用なし）。
if (typeof (globalThis as { chrome?: unknown }).chrome === "undefined") {
  const store: Record<string, unknown> = {};
  const local = {
    get: (keys?: string | string[] | null) => {
      if (keys == null) return Promise.resolve({ ...store });
      const list = Array.isArray(keys) ? keys : [keys];
      const out: Record<string, unknown> = {};
      for (const k of list) if (k in store) out[k] = store[k];
      return Promise.resolve(out);
    },
    set: (items: Record<string, unknown>) => {
      Object.assign(store, items);
      return Promise.resolve();
    },
    remove: (keys: string | string[]) => {
      for (const k of (Array.isArray(keys) ? keys : [keys])) delete store[k];
      return Promise.resolve();
    },
    clear: () => {
      for (const k of Object.keys(store)) delete store[k];
      return Promise.resolve();
    },
  };
  (globalThis as { chrome?: unknown }).chrome = { storage: { local } };
}

afterEach(() => {
  cleanup()
})
