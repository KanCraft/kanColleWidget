
const KanColleURL = "http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/";

const GameWrapper = "div#area-game";
const GameIFrame = "iframe#game_frame";
const GameWidth = 1200;
const GameHeight = 720;
const GameAspectRatio: number = GameHeight / GameWidth;
const HiddenElements: string[] = [
  "div.dmm-ntgnavi", // うえのナビゲーション
  "div.twitter>iframe", // 「ツイートする」ボタン
  "div.area-naviapp.mg-t20", // お問い合わせへのリンクなど
  "div#foot", // 利用規約とか
  "div#ntg-recommend", // 右側の「おすすめゲーム」とかいうの
];

// なんかiframeのなかに
// <div id="spacing_top" style="height:16px;"></div>
// とかいうのがあるんだけど、いまどきこんなんやる？？？
const TopSpacing = 16;

/* tslint:disable object-literal-sort-keys */
export default {
  KanColleURL,

  GameWrapper,
  GameIFrame,
  GameWidth,
  GameHeight,
  GameAspectRatio,
  HiddenElements,

  TopSpacing
};
