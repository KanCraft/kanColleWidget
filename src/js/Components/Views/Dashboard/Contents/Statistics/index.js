import React, {Component,PropTypes} from "react";
import Resource from "../../../../Models/Resource";
import {
  LineChart,
  Line,
  YAxis, XAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

import {Client} from "chomex";

import FlatButton from "material-ui/FlatButton";

import colors from "../../../../../Constants/colors";

export default class DashboardStatistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: Resource.list(),
    };
    this.client = new Client(chrome.runtime);
  }
  render() {
    const [w, h] = [window.innerWidth, window.innerHeight];
    return (
      <div style={{...this.props.style}}>
        <LineChart width={w * 0.8} height={h * 0.8} data={this.state.list}>
          <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>

          <XAxis dataKey={r => (new Date(r.created)).format("MM/dd HH:mm")} />

          <Tooltip />
          <Legend />

          <YAxis yAxisId="資源" orientation="left" stroke="#000" />
          <Line type="natural" dot={false} yAxisId="資源" stroke={colors.fuel}    dataKey="fuel" name="燃料" />
          <Line type="natural" dot={false} yAxisId="資源" stroke={colors.ammo}    dataKey="ammo" name="弾薬" />
          <Line type="natural" dot={false} yAxisId="資源" stroke={colors.steel}   dataKey="steel" name="鋼材"/>
          <Line type="natural" dot={false} yAxisId="資源" stroke={colors.bauxite} dataKey="bauxite" name="ボーキサイト" />

          <YAxis yAxisId="資材" orientation="right" stroke="#000" />
          <Line type="natural" dot={false} yAxisId="資材" stroke={colors.buckets} dataKey="buckets"  name="修復材" />
          <Line type="natural" dot={false} yAxisId="資材" stroke={colors.material} dataKey="material" name="開発材" />
        </LineChart>
        <div>
          <FlatButton label="取得" style={{width:"45%"}} onClick={() => this.client.message("/resources/capture").then(() => this.setState({list:Resource.list()}))}/>
          <FlatButton label="詳細" style={{width:"45%"}} onClick={() => window.open("/dest/html/statistics.html")}/>
        </div>
      </div>
    );
  }
  static propTypes = {
    style: PropTypes.object.isRequired,
  }
}
