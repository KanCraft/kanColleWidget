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

import {green500} from "material-ui/styles/colors";

export default class DashboardStatistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: Resource.list(),
    };
  }
  render() {
    const [w, h] = [window.innerWidth, window.innerHeight];
    // TODO: これどっかに1元定義したい
    const colors = {
      fuel:    "#00BFA5",
      ammo:    "#8884d8",
      steel:   "#757575",
      bauxite: "#FF5722",
    };
    return (
      <div style={{...this.props.style}}>
        <LineChart width={w * 0.8} height={h * 0.9} data={this.state.list}>
          <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>

          <XAxis dataKey={r => (new Date(r.created)).toDateString()} />
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
