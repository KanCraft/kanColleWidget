import type { Usecase } from "./types";

export const usecases: Usecase[] = [
  {
    id: "normal-fleet-capture",
    title: "通常艦隊の編成キャプチャ",
    description: "通常の最大6隻編成の艦隊に対応したキャプチャです",
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
