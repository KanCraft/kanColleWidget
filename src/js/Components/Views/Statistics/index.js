import React, {Component} from "react";
import Resource from "../../Models/Resource";
import {
  LineChart,
  Line,
  YAxis, XAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import {Table,TableHeader,TableBody} from "material-ui/Table";
import ResourceRow from "./ResourceRow";
import ControlRow  from "./ControlRow";

import {green500} from "material-ui/styles/colors";

export default class StatisticsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resources: Resource.list(),
      ts:        Date.now(),
    };
  }
  refresh() {
    this.setState({
      resources: Resource.list(),
      ts:        Date.now(),
    });
  }
  render() {
    const [w, h] = [window.innerWidth, window.innerHeight];
    const colors = {
      fuel:    "#00BFA5",
      ammo:    "#8884d8",
      steel:   "#757575",
      bauxite: "#FF5722",
    };
    const rows = [].concat(this.state.resources).reverse();
    return (
      <div>
        <h1>資源推移記録</h1>
        <div>
          {/* TODO: DRY */}
          <LineChart width={w*0.9} height={h*0.4} data={this.state.resources}>
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
        <div>
          <Table>
            <TableHeader>
              <ControlRow refresh={this.refresh.bind(this)} />
            </TableHeader>
            <TableBody>
              {rows.map(r => <ResourceRow resource={r} key={r._id} refresh={this.refresh.bind(this)}/>)}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
}
