import React, { Component } from "react";
import {Client} from "chomex";

import cn from "classnames";

export default class SimulatorView extends Component<{}, {
  active: {
    tab:        string;
    controller: {
      name: string;
    };
  },
  controllers: {
    message: any[];
    request: any[];
  },
  body:      any;
  response?: any;
  error?:    any;
}> {
  constructor(props) {
    super(props);
    this.state = {
      active: {
        tab: "message",
        controller: {name: "hello"},
      },
      controllers: {
        message: [],
        request: [],
      },
      body: {__this: {sender: {}}},
      response: null,
      error:    null,
    };
  }
  async componentDidMount() {
    const client = new Client(chrome.runtime, false);
    const res = await client.message("/debug/availables");
    this.setState({controllers: res.data.controllers});
  }
  render() {
    const {active, controllers, body} = this.state;
    return (
      <section>
        <h2>Controller Simulator</h2>
  
        <div className="columns">
          <div className="column col-12">
            <ul className="tab">
              <li className="tab-item">
                <a
                  className={active.tab == "message" ? "active" : null}
                  onClick={() => this.onTab("message")}
                >Message Controllers</a>
              </li>
              <li className="tab-item">
                <a
                  className={active.tab == "request" ? "active" : null}
                  onClick={() => this.onTab("request")}
                >Request Controllers</a>
              </li>
            </ul>
          </div>
        </div>
  
        <div className="columns">
          <div className="column col-12">
            <div className="form-group">
              <select className="form-select" onChange={ev => this.onController(ev.target.value)}>
                {controllers[active.tab].map(c => {
                  return <option selected={c.name == active.controller.name}>{ name }</option>;
                })}
              </select>
            </div>
          </div>
        </div>
        <div className="columns">
          <div className="column col-6 col-sm-12">
            <h3>{active.tab} body</h3>
            <pre className="code" data-lang="JSON"><code contentEditable={true} onInput={ev => this.onBodyChange(ev)}>{JSON.stringify(body, null, 2)}</code></pre>
          </div>
          <div className="column col-6 col-sm-12">
            <h3>response</h3>
            <pre className="code" data-lang="JSON"><code>{this.state.response}</code></pre>
          </div>
        </div>
        <div className="columns">
          <div className="column col-12">
            <button
              className={cn("btn", "btn-primary", "btn-block", { "disabled": !!this.state.error })}
              onClick={() => this.execute()}
            >Execute</button>
            <span className="error">{this.state.error}</span>
          </div>
        </div>
      </section>
    );
  }

  // Tabが変わるとき
  onTab(tabname: string) {
    this.setState({
      active: {
        tab: tabname,
        controller: this.state.controllers[tabname][0],
      },
    });
  }

  // Controllerが変わるとき
  onController(name: string) {
    this.setState({
      active: {
        tab: this.state.active.tab,
        controller: this.state.controllers[this.state.active.tab].filter(c => c.name == name)[0],
      },
    });
  }

  // パラメータボディが変わるとき
  onBodyChange(ev) {
    console.log(ev);
  }

  // 選択されているControllerを実行する
  execute() {

  }
}


{/* <script lang="ts">
import {Vue, Component} from "vue-property-decorator";
import {Client} from "chomex";

// JSのサイズ大きくなるしやめよか
// import * as WindowController from "../../../Background/Controllers/Window";

@Component
export default class Simulator extends Vue {

  private client: any;
  private controllers = {message: [], request: []};
  private activeTab: string = "message";
  private activeController: string = this.controllers[this.activeTab][0];

  private body: any = {__this: {sender: {}}};
  private error?: string = null;
  private response: string;

  constructor() {
    super();
    this.client = new Client(chrome.runtime, false);
    this.client.message("/debug/availables", (res) => {
      this.controllers.message = res.data.controllers.message;
      this.controllers.request = res.data.controllers.request;
      this.$forceUpdate(); // FIXME:
    });
  }

  private clickTab(tab: string) {
    this.activeTab = tab;
    this.activeController = this.controllers[this.activeTab][0];
  }
  private changeController(ev: {target: HTMLSelectElement}) {
    this.activeController = ev.target.value;
  }

  private onBodyChange(ev: {target: HTMLElement}) {
    try {
      this.body = JSON.parse(ev.target.innerText);
      this.error = null;
    } catch (err) {
      this.error = err.message;
    }
  }

  private async execute() {
    const client = new Client(chrome.runtime, false);
    const res = await client.message("/debug/controller", {
      __controller: this.activeController,
      ...this.body,
    });
    this.response = JSON.stringify(res, null, 2);
    this.$forceUpdate(); // FIXME:
  }
}
</script> */}
