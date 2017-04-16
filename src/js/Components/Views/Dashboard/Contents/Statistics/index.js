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

import OpenInNew  from "material-ui/svg-icons/action/open-in-new";
import {green500} from "material-ui/styles/colors";

import colors from "../../../../../Constants/colors";

export default class DashboardStatistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: Resource.list(),
    };
  }
  render() {
    const [w, h] = [window.innerWidth, window.innerHeight];
    return (
      <div style={{...this.props.style}}>
        <div style={{
          position: "absolute",
          right: "58px", bottom: "14px",
        }}><OpenInNew color="#bdbdbd" style={{cursor:"pointer"}} onClick={() => window.open("/dest/html/statistics.html")}/></div>
        <LineChart width={w * 0.8} height={h * 0.9} data={this.state.list}>
          <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>

          <XAxis dataKey={r => (new Date(r.created)).format("MM/dd HH:mm")} />

          <Tooltip />
          <Legend />

          <YAxis yAxisId="資源" orientation="left" stroke="#000" />
          <Line type="natural" yAxisId="資源" stroke={colors.fuel}    dataKey="fuel" name="燃料" />
          <Line type="natural" yAxisId="資源" stroke={colors.ammo}    dataKey="ammo" name="弾薬" />
          <Line type="natural" yAxisId="資源" stroke={colors.steel}   dataKey="steel" name="鋼材"/>
          <Line type="natural" yAxisId="資源" stroke={colors.bauxite} dataKey="bauxite" name="ボーキサイト" />

          <YAxis yAxisId="資材" orientation="right" stroke="#000" />
          <Line type="natural" yAxisId="資材" stroke={green500} dataKey="buckets" name="修復材" />
        </LineChart>
      </div>
    );
  }
  static propTypes = {
    style: PropTypes.object.isRequired,
  }
}
