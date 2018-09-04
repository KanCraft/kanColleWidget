
const KanColleURL: string = "http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/";

const GameIFrame: string = "iframe#game_frame";
const GameWidth: number = 1200;
const GameHeight: number = 720;

// なんかiframeのなかに
// <div id="spacing_top" style="height:16px;"></div>
// とかいうのがあるんだけど、いまどきこんなんやる？？？
const TopSpacing: number = 16;

/* tslint:disable object-literal-sort-keys */
export default {
  KanColleURL,

  GameIFrame,
  GameWidth,
  GameHeight,

  TopSpacing,
};
