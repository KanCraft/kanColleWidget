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
import FlatButton from "material-ui/FlatButton";
import ResourceRow from "./ResourceRow";
import InsertDriveFile from "material-ui/svg-icons/editor/insert-drive-file";
import ControlRow  from "./ControlRow";

import c from "../../../Constants/colors";

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
  exportAsCSV() {
    // TODO: これをサービスにしてテスタブルにするのたのしいはずだから誰かやって
    const rows = [["日付","燃料","弾薬","鋼材","ボーキサイト","修復材","開発材"]].concat(Resource.list().map(r => {
      return [(new Date(r.created).toISOString()), r.fuel, r.ammo, r.steel, r.bauxite, r.buckets, r.material || 0];
    }));
    const str = rows.map(row => row.map(col => col || 0).join(",")).join("\n");
    const blob = new Blob([str], {encoding:"UTF-8",type:"text/comma-separated-values"});
    const url = window.URL.createObjectURL(blob);
    let anchor = document.createElement("a");
    anchor.download = "資源推移.csv";
    anchor.href = url;
    anchor.click();
    window.URL.revokeObjectURL(url);
  }
  render() {
    const [w, h] = [window.innerWidth, window.innerHeight];
    const rows = [].concat(this.state.resources).reverse();
    return (
      <div>
        <FlatButton
          onClick={this.exportAsCSV.bind(this)}
          label="CSV EXPORT" labelPosition="before" style={{float:"right", color:"#9E9E9E"}} icon={<InsertDriveFile />}
        />
        <h1>
          資源推移記録
        </h1>
        <div>
          {/* TODO: DRY */}
          <LineChart width={w*0.9} height={h*0.4} data={this.state.resources}>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>

            <XAxis dataKey={r => (new Date(r.created)).format("MM/dd HH:mm")} />

            <Tooltip />
            <Legend />

            <YAxis yAxisId="資源" orientation="left" stroke="#000" />
            <Line type="natural" yAxisId="資源" stroke={c.fuel}    dataKey="fuel" name="燃料" />
            <Line type="natural" yAxisId="資源" stroke={c.ammo}    dataKey="ammo" name="弾薬" />
            <Line type="natural" yAxisId="資源" stroke={c.steel}   dataKey="steel" name="鋼材"/>
            <Line type="natural" yAxisId="資源" stroke={c.bauxite} dataKey="bauxite" name="ボーキサイト" />

            <YAxis yAxisId="資材" orientation="right" stroke="#000" />
            <Line type="natural" yAxisId="資材" stroke={c.buckets} dataKey="buckets" name="修復材" />
            <Line type="natural" yAxisId="資材" stroke={c.material} dataKey="material" name="開発材" />
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
        <div>
          <p style={{textAlign:"center", padding:"48px", color:"#bdbdbd"}}>
            資源推移表は、以下の条件で右上の資源の表示を画像解析で取得します。
            (1) 編成画面への遷移時で、(2) 画面が中型（通常プレー画面）以上の大きさを持っており、(3) 縦横比が800x480ぴったり、
            (4) なお取得成功した場合も同日中のレコードは上書きして1つのレコードとして保存されます。
          </p>
        </div>
      </div>
    );
  }
}
