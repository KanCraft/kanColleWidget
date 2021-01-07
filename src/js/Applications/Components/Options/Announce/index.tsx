import React from "react";

export default class AnnounceView extends React.Component<{}, {
  commits: { hash: string, url: string; title: string; }[],
  help: { type: string; q: string; }
}> {
  private manifest: chrome.runtime.Manifest;
  private releaseURL: string;
  constructor(props) {
    super(props);
    this.manifest = chrome.runtime.getManifest();
    this.releaseURL = `https://github.com/KanCraft/kanColleWidget/releases/tag/${this.manifest.version_name}`;
    this.state = { commits: [], help: { type: "Issues", q: "" } };
  }
  async componentDidMount() {
    const res = await fetch(this.releaseURL);
    if (res.status != 200) return;
    const text = await res.text();
    const doc = new DOMParser().parseFromString(text, "text/html");
    const commits = Array.from(doc.querySelectorAll("div.markdown-body>ul>li")).map(this.extractCommitFromLiNode);
    this.setState({ commits });
  }
  private extractCommitFromLiNode(li: HTMLLIElement): { hash: string, url: string, title: string } {
    const url = li.querySelector("a").href;
    return { url, hash: url.match(/[a-z0-9]+$/)[0], title: li.textContent };
  }
  render() {
    const { commits, help } = this.state;
    const widgetChang = chrome.extension.getURL("dest/img/widget-chang.png");
    return (
      <section className="category announce">
        <div className="container">
          <div className="columns">
            <div className="column col-auto">
              <a href="https://twitter.com/KanColleWidget"><img src={widgetChang} className="widget-chang c-hand" /></a>
            </div>
            <div className="column col-auto">
              <div className="balloon">
                <div>艦これウィジェット <a href={this.releaseURL}>ver {this.manifest.version_name}</a></div>
                {commits.length ? <div className="commit-list">
                  <ul>
                    {commits.map(c => <li key={c.hash}><a href={c.url} target="_blank" rel="noreferrer">{c.title}</a></li>)}
                    <li>Thank you!</li>
                  </ul>
                </div> : null}
                {/* <div>機能要望、不具合報告は<a href="https://github.com/KanCraft/kanColleWidget/issues?q=is%3Aissue">こちら</a>！</div> */}
                <div className="input-group help">
                  <input
                    defaultValue={help.q}
                    onChange={ev => this.setState({ help: { ...help, q: ev.target.value } })}
                    type="text" className="form-input input-sm" placeholder="検索キーワード" />
                  <select
                    defaultValue={help.type}
                    onChange={ev => this.setState({ help: { ...help, type: ev.target.value } })}
                    className="form-select select-sm">
                    <option value="Wikis">Wiki</option>
                    <option value="Issues">機能要望・不具合報告</option>
                    <option value="Commits">ソースコード</option>
                  </select>
                  <button
                    onClick={() => this.onClickHelp()}
                    className="btn btn-primary input-group-btn btn-sm">検索</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  commitURL(hash: string): string {
    return `https://github.com/KanCraft/kanColleWidget/commit/${hash}`;
  }
  /**
   * Repoの中の検索URLを使いたかったが、GlobalなSearchのほうがいろいろ融通が利くっぽい。
   * @see https://docs.github.com/ja/github/searching-for-information-on-github/understanding-the-search-syntax
   */
  onClickHelp() {
    const { q, type } = this.state.help;
    if (q.trim() == "お前を消す方法") {
      return window.open("https://twitter.com/KanColleWidget/status/1302503345546956800");
    }
    const url = new URL("https://github.com/search");
    const repo = "KanCraft/kanColleWidget";
    const sort = "created";
    const order = "desc";
    url.searchParams.set("q", `${q} repo:${repo}`);
    url.searchParams.set("type", type);
    url.searchParams.set("s", sort);
    url.searchParams.set("o", order);
    return window.open(url.toString());
  }
}