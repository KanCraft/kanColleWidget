import { useState } from "react";
import type { Model } from "jstorm/chrome/local";

/**
 * 設定モデルの1フィールドをローカル state と chrome.storage の両方へ反映するフック。
 * save(next) は normalize → config.update → setState の順で実行する。
 */
export function useConfigField<C extends Model, K extends keyof C & string, T extends C[K]>(
  config: C,
  key: K,
  initialValue: T,
  options?: {
    /** 保存前の正規化（NaNガード・整数化等）。返り値が保存・表示される */
    normalize?: (value: T) => T;
  },
): [T, (next: T) => Promise<void>] {
  const [value, setValue] = useState<T>(initialValue);
  const save = async (next: T) => {
    const normalized = options?.normalize ? options.normalize(next) : next;
    await config.update({ [key]: normalized });
    setValue(normalized);
  };
  return [value, save];
}
