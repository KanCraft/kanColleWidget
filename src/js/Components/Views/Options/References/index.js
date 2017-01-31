import React, {Component, PropTypes} from "react";

import InfoOutline from "material-ui/svg-icons/action/info-outline";
import Description from "../Settings/Description";

export default class ReferencesView extends Component {
    render() {
        const styles = {
            h2: {marginBottom:"0"}
        };
        return (
          <div>
            <h1 style={this.props.styles.title}><InfoOutline /> このChrome拡張について</h1>
            <Description>
              『艦これウィジェット』は、開発者が艦これを程よく気軽に楽しむために開発され、ついでに公開されたものです。
              決して、高機能なものにするつもりはありませんので、高機能なツールをお求めの方は、他のツールをお使いください。
              また、『艦これウィジェット』は非公式ツールであり、公式からの要請があればただちに開発・公開を停止しますので、ご了承ください。
              非公式ツールの使用は推奨されません。『艦これウィジェット』は、公式のUIが改善され『艦これウィジェット』なんて要らなくなることを望んでいます。
              提督各位の健康的な提督ライフと、『艦これ』自体のサービスが長くつづいてほしいと、ユーザとして切実に思います。
              otiai10
            </Description>
            <div>
              <h2 style={styles.h2}>開発者</h2>
              <ul>
                <li>
                  <a href="https://github.com/otiai10/kanColleWidget/graphs/contributors">https://github.com/otiai10/kanColleWidget/graphs/contributors</a>
                </li>
              </ul>
              <h2 style={styles.h2}>イラスト</h2>
              <ul>
                <li>
                  <a href="http://roonyan.com/">http://roonyan.com/</a>
                </li>
              </ul>
              <h2 style={styles.h2}>ソフトウェアライセンス</h2>
              <ul>
                <li>
                  <a href="https://github.com/otiai10/kanColleWidget/blob/v2/master/LICENSE">https://github.com/otiai10/kanColleWidget/blob/v2/master/LICENSE</a>
                </li>
              </ul>
              <h2 style={styles.h2}>リンク</h2>
              <ul>
                <li>実装などについての説明
                  <ul>
                    <li><a href="http://www.slideshare.net/otiai10/4-30874816">加賀さんと僕4 〜艦これウィジェットの後悔と教訓〜</a></li>
                    <li><a href="http://www.slideshare.net/otiai10/ss-29156715">加賀さんと僕 〜艦これウィジェットの新機能とか〜</a></li>
                    <li><a href="http://www.slideshare.net/otiai10/ss-26908975">加賀さんと僕（実装編）〜艦これウィジェットの課題と実装〜</a></li>
                    <li><a href="http://www.slideshare.net/otiai10/ss-26631311">加賀さんと僕 ~艦これウィジェットの紹介と説明~</a></li>
                  </ul>
                </li>
                <li>バレンタイン近いのでほしいものリスト貼ります！
                  <ul>
                    <li><a href="https://www.amazon.co.jp/registry/wishlist/1K4E93FSE3UQ4/?tag=otiai10-22">ほしいものリスト</a></li>
                  </ul>
                </li>
              </ul>
            </div>
            <p style={{textAlign:"right"}}>
              <a style={{color:"#e0e0e0"}} href="https://twitter.com/otiai10">Copyright otiai10 All Right Reserved.</a>
            </p>
          </div>
        );
    }
    static propTypes = {
        styles: PropTypes.object.isRequired
    }
}
