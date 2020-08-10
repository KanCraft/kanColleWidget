import React from "react";

export default class AnnounceView extends React.Component<{}, {
  commits: { hash: string, url: string; title: string; }[],
}> {
  private manifest: chrome.runtime.Manifest;
  private releaseURL: string;
  constructor(props) {
    super(props);
    this.manifest = chrome.runtime.getManifest();
    this.releaseURL = `https://github.com/KanCraft/kanColleWidget/releases/tag/${this.manifest.version_name}`;
    this.state = { commits: [] };
  }
  async componentDidMount() {
    const res = await fetch(this.releaseURL);
    if (res.status != 200) return;
    const text = await res.text();
    const doc = new DOMParser().parseFromString(text, "text/html");
    const commits = doc.querySelector("div.commit-desc>pre").innerHTML.split("\n").map(line => {
      const [hash, title] = line.split(/\s\([^)]+\)\s/);
      return { hash, url: this.commitURL(hash), title };
    });
    this.setState({ commits });
  }
  render() {
    const { commits } = this.state;
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
                    {commits.map(c => <li key={c.hash}><a href={c.url}>{c.hash}</a> {c.title}</li>)}
                    <li>Thank you!</li>
                  </ul>
                </div> : null}
                <div>機能要望、不具合報告は<a href="https://github.com/KanCraft/kanColleWidget/issues?q=is%3Aissue">こちら</a>！</div>
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
}