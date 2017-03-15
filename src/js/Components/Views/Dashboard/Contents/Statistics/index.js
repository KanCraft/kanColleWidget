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
          <YAxis/>
          <XAxis dataKey={r => (new Date(r.created)).toDateString()} />
          <Tooltip />
          <Legend />
          <Line type="natural" stroke={colors.fuel}    dataKey="fuel" name="燃料" />
          <Line type="natural" stroke={colors.ammo}    dataKey="ammo" name="弾薬" />
          <Line type="natural" stroke={colors.steel}   dataKey="steel" name="鋼材"/>
          <Line type="natural" stroke={colors.bauxite} dataKey="bauxite" name="ボーキサイト" />
        </LineChart>
      </div>
    );
  }
  static propTypes = {
    style: PropTypes.object.isRequired,
  }
}
