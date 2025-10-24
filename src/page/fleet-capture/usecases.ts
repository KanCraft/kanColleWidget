import type { Usecase } from "./types";

export const usecases: Usecase[] = [
  {
    id: "normal-fleet-capture",
    title: "通常艦隊の編成キャプチャ",
    description:
      "艦隊編成画面のスクリーンショットを手動で取得し、統合し、一枚の画像として保存する機能です。",
    crop: "fleet",
    page: 1,
    count: 6,
    composition: [
      ["旗艦", "第二艦"],
      ["第三艦", "第四艦"],
      ["第五艦", "第六艦"],
    ],
  },
];
