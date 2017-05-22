/* global sleep:true */
import React, {Component} from "react";
import {Client} from "chomex";
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
import FilterControl from "./FilterControl";
import ResourceEditDialog from "../Common/ResourceEditDialog";

import c from "../../../Constants/colors";

export default class StatisticsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resources: Resource.list(),
      ts:        Date.now(),
      filter: {
        term: {
          from: new Date((Resource.first() || {}).created || 0),
          to:   new Date(),
        }
      },
      openEditDialog: false,
      editTarget:     null,
      editPrev:       null,
      editNext:       null,
    };
  }
  filterer(f) {
    return (r) => {
      if (r.created < f.term.from.getTime()) return false;
      if (r.created > f.term.to.getTime()) return false;
      return true;
    };
  }
  refresh() {
    this.setState({
      resources: Resource.filter(this.filterer(this.state.filter)),
      ts:        Date.now(),
    });
  }
  onTermChanged(key, date) {
    const term = {...this.state.filter.term, [key]:date};
    const filter = {...this.state.filter, term};
    this.setState({
      filter,
      resources: Resource.filter(this.filterer(filter)),
    });
  }
  // {{{ Edit
  openEditDialog(target, prev, next) {
    this.setState({openEditDialog:true,editTarget:target,editPrev:prev,editNext:next});
  }
  closeEditDialog() {
    this.setState({openEditDialog:false,editTarget:null,editPrev:null,editNext:null});
  }
  onEditCommit(target) {
    target.save();
    this.setState({openEditDialog:false,editTarget:null,editPrev:null,editNext:null}, () => sleep(1).then(() => this.refresh()));
  }
  // }}}
  exportAsCSV() {
    // TODO: これをサービスにしてテスタブルにするのたのしいはずだから誰かやって
    const rows = [["日付","燃料","弾薬","鋼材","ボーキサイト","修復材","開発材"]].concat(this.state.resources.map(r => {
      return [(new Date(r.created).toISOString()), r.fuel, r.ammo, r.steel, r.bauxite, r.buckets, r.material || 0];
    }));
    const str = rows.map(row => row.map(col => col || 0).join(",")).join("\n");
    const blob = new Blob([str], {encoding:"UTF-8",type:"text/comma-separated-values"});
    const url = window.URL.createObjectURL(blob);
    let anchor = document.createElement("a");
    anchor.download = `資源推移_${(new Date()).format("yyyyMMdd")}.csv`;
    anchor.href = url;
    anchor.click();
    window.URL.revokeObjectURL(url);
  }
  exportToTweet() {
    const client = new Client(chrome.runtime);
    const r = window.devicePixelRatio || 1;
    const {left,top,width,height} = document.querySelector("div.recharts-wrapper").getBoundingClientRect();
    client.message("/window/capture", {
      me:true,
      trim:{left:left*r,top:top*r,width:width*r,height:height*r},
    }).then(res => {
      let p = new URLSearchParams();
      p.set("img", res.data);
      p.set("text", Resource.last().toText());
      window.open(`/dest/html/capture.html?${p.toString()}`);
    });
  }
  render() {
    const [w, h] = [window.innerWidth, window.innerHeight];
    const rows = [].concat(this.state.resources).reverse();
    const data = this.state.resources;
    return (
      <div>
        <FlatButton
          onClick={this.exportToTweet.bind(this)}
          label="IMAGE EXPORT" labelPosition="before" style={{float:"right", color:"#9E9E9E"}} icon={<InsertDriveFile />}
        />
        <FlatButton
          onClick={this.exportAsCSV.bind(this)}
          label="CSV EXPORT" labelPosition="before" style={{float:"right", color:"#9E9E9E"}} icon={<InsertDriveFile />}
        />
        <div style={{display:"flex"}}>
          <div><h1>資源推移記録</h1></div>
          <FilterControl onTermChanged={this.onTermChanged.bind(this)}/>
        </div>
        <div>
          {/* TODO: DRY */}
          <LineChart width={w*0.9} height={h*0.7} data={data}>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>

            <XAxis
              type={"number"}
              domain={["dataMin", "dataMax"]}
              dataKey={"created"}
              ticks={(() => {
                return data.reduce((self, r, i) => {
                  const prev = self[i - 1];
                  if (prev && r.created - prev.created > 24*60*60*1000) {
                    self.push(Math.floor((r.created + prev.created)/2));
                  }
                  self.push(r.created);
                  return self;
                }, []);
              })()}
              tickFormatter={created => (new Date(created)).format("MM/dd HH:mm")}
            />

            <Tooltip labelFormatter={created => (new Date(created)).format("MM/dd HH:mm")}/>
            <Legend />

            <YAxis yAxisId="資源" orientation="left" stroke="#000" />
            <Line type="monotone" dot={false} yAxisId="資源" stroke={c.fuel}    dataKey="fuel" name="燃料" />
            <Line type="monotone" dot={false} yAxisId="資源" stroke={c.ammo}    dataKey="ammo" name="弾薬" />
            <Line type="monotone" dot={false} yAxisId="資源" stroke={c.steel}   dataKey="steel" name="鋼材"/>
            <Line type="monotone" dot={false} yAxisId="資源" stroke={c.bauxite} dataKey="bauxite" name="ボーキサイト" />

            <YAxis yAxisId="資材" orientation="right" stroke="#000" />
            <Line type="monotone" dot={false} yAxisId="資材" stroke={c.buckets} dataKey="buckets" name="修復材" />
            <Line type="monotone" dot={false} yAxisId="資材" stroke={c.material} dataKey="material" name="開発材" />
          </LineChart>
        </div>
        <div>
          <Table fixedHeader={true} height={"600px"}>
            <TableHeader>
              <ControlRow refresh={this.refresh.bind(this)} />
            </TableHeader>
            <TableBody>
              {rows.map((r, i) => <ResourceRow
                resource={r} key={r._id} refresh={this.refresh.bind(this)}
                edit={() => this.openEditDialog(r, rows[i-1], rows[i+1])}
              />)}
            </TableBody>
          </Table>
        </div>
        <ResourceEditDialog
          open={this.state.openEditDialog}
          close={this.closeEditDialog.bind(this)}
          onEditCommit={this.onEditCommit.bind(this)}
          target={this.state.editTarget}
          prev={this.state.editPrev}
          next={this.state.editNext}
        />
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
