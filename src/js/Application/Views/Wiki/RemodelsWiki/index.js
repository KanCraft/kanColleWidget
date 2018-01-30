import React, {Component} from "react";
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableFooter,
  TableRow,
  TableRowColumn,
} from "material-ui/Table";
import Checkbox from "material-ui/Checkbox";
import TextField from "material-ui/TextField";
import {cyanA700, grey400} from "material-ui/styles/colors";

import Remodel from "../../../Models/Remodel";

const widths = {
  cat: "70px",
  equip: "172px",
  days: "160px",
  ship: "92px",
};

export default class RemodelsWikiView extends Component {
  constructor(props) {
    super(props);
    const now = new Date();
    this.state = {
      days: {
        0: now.getDay() == 0,
        1: now.getDay() == 1,
        2: now.getDay() == 2,
        3: now.getDay() == 3,
        4: now.getDay() == 4,
        5: now.getDay() == 5,
        6: now.getDay() == 6,
      },
      categories: Remodel.categories(),
      text: "",
    };
  }

  /**
   * state見てフィルタして返す
   */
  getRecords() {

    // 分類フィルタの定義
    const filterCategory = (r) => {
      const categories = Object.keys(this.state.categories).filter(c => this.state.categories[c]);
      return categories.some(category => r.category == category);
    };

    // 曜日フィルタの定義
    const filterDays = (r) => {
      const days = Object.keys(this.state.days).filter(day => this.state.days[day]);
      return days.some(day => day && r.available[day]);
    };

    const regex = this.state.text == "" ? null : new RegExp(`^${this.state.text.replace("　", " ").split(/[ ]/).map(w => `(?=.*${w})`).join("")}`);
    const filterText = (r) => {
      if (!regex) return true;
      return regex.test(r.comment) || regex.test(r.equipment);
    };

    // 各フィルタの実行
    return Remodel.filter(r => {
      return filterText(r) && filterCategory(r) && filterDays(r);
    });

  }
  renderTableRow(record, i) {
    return (
      <TableRow key={i}>
        <TableRowColumn style={{width:widths.cat}}>{record.category}</TableRowColumn>
        <TableRowColumn style={{width:widths.equip}}>{record.equipment}</TableRowColumn>
        <TableRowColumn style={{width:widths.days}}>{this.renderAvailabilities(record.available)}</TableRowColumn>
        <TableRowColumn style={{width:widths.ship}}>{record.ship}</TableRowColumn>
        <TableRowColumn><small>{record.comment}</small></TableRowColumn>
      </TableRow>
    );
  }
  renderAvailabilities(available) {
    return (
      <div style={{display:"flex",height:"100%"}}>
        {available.map((a, i) => {
          const style = this.state.days[i] ? {
            fontWeight: "bold",
            backgroundColor: cyanA700,
          } : {};
          return (
            <div key={i} style={{
              flex:1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              ...style,
            }}
            >{a ? "◯" : "✕"}</div>
          );
        })}
      </div>
    );
  }
  _getTextOfDay(day) {
    switch(day) {
    case 0: return "日";
    case 1: return "月";
    case 2: return "火";
    case 3: return "水";
    case 4: return "木";
    case 5: return "金";
    case 6: default: return "土"; // デフォルトで土曜日だったらいいなあ...
    }
  }
  renderDays() {
    const styles = {
      col: {
        flex:1,
        display:"flex",
        justifyContent:"center",
      },
    };
    return (
      <div style={{display:"flex"}}>
        {[0,1,2,3,4,5,6].map(day => <div key={day} style={{
          ...styles.col,
          fontWeight: this.state.days[day] ? "bold" : "normal",
          color:      this.state.days[day] ? cyanA700 : "inherit",
        }}>{this._getTextOfDay(day)}</div>)}
      </div>
    );
  }
  renderTable() {
    return (
      <Table fixedHeader={true} height={(window.innerHeight * 0.8) + "px"}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn style={{width:widths.cat}}>分類</TableHeaderColumn>
            <TableHeaderColumn style={{width:widths.equip}}>装備</TableHeaderColumn>
            <TableHeaderColumn style={{width:widths.days}}>{this.renderDays()}</TableHeaderColumn>
            <TableHeaderColumn style={{width:widths.ship}}>第二番艦</TableHeaderColumn>
            <TableHeaderColumn>備考</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {this.getRecords().map((record, i) => this.renderTableRow(record, i))}
        </TableBody>
        <TableFooter adjustForCheckbox={false}>
          <TableRow>
            <TableRowColumn style={{width:widths.cat}}>分類</TableRowColumn>
            <TableRowColumn style={{width:widths.equip}}>装備</TableRowColumn>
            <TableRowColumn style={{width:widths.days}}>{this.renderDays()}</TableRowColumn>
            <TableRowColumn style={{width:widths.ship}}>第二番艦</TableRowColumn>
            <TableRowColumn>備考</TableRowColumn>
          </TableRow>
        </TableFooter>
      </Table>
    );
  }
  renderToggleCategoryAll() {
    if (Object.keys(this.state.categories).some(c => this.state.categories[c])) {
      return <span style={{cursor:"pointer", color:grey400}} onClick={() => this.setState({categories: Object.keys(this.state.categories).reduce((self, c) => {self[c] = false; return self; }, {})})}>[すべて解除]</span>;
    } else {
      return <span style={{cursor:"pointer", color:grey400}} onClick={() => this.setState({categories: Object.keys(this.state.categories).reduce((self, c) => {self[c] = true; return self; }, {})})}>[すべて選択]</span>;
    }
  }
  renderToggleDaysAll() {
    if (Object.keys(this.state.days).some(d => this.state.days[d])) {
      return <span style={{cursor:"pointer", color:grey400}} onClick={() => this.setState({days: Object.keys(this.state.days).reduce((self, d) => {self[d] = false; return self; }, {})})}>[すべて解除]</span>;
    } else {
      return <span style={{cursor:"pointer", color:grey400}} onClick={() => this.setState({days: Object.keys(this.state.days).reduce((self, d) => {self[d] = true; return self; }, {})})}>[すべて選択]</span>;
    }
  }
  renderFilterControl() {
    return (
      <div style={{margin:"24px 0"}}>
        <div style={{display:"flex", marginBottom:"12px"}}>
          <div style={{flex:1, display:"flex",flexDirection:"column"}}>
            <div>曜日 {this.renderToggleDaysAll()}</div>
            <div style={{display:"flex", flexWrap:"wrap"}}>
              {[0,1,2,3,4,5,6].map(day => (
                <div key={day}>
                  <Checkbox
                    label={this._getTextOfDay(day)} labelStyle={{whiteSpace: "nowrap"}}
                    iconStyle={{marginRight:"2px"}} style={{paddingRight:"8px"}}
                    checked={this.state.days[day]}
                    onCheck={(ev, checked) => this.setState({days: {...this.state.days, [day]:checked}})}
                  />
                </div>
              ))}
            </div>
          </div>
          <div style={{flex:1, display:"flex",flexDirection:"column"}}>
            <div>フリーテキスト検索</div>
            <div>
              <TextField
                fullWidth={true}
                placeholder={"例) 消費 偵察機"}
                name={"text"}
                value={this.state.text}
                onChange={(ev, text) => this.setState({text})}
              />
            </div>
          </div>
        </div>
        <div style={{display:"flex"}}>
          <div style={{flex:2, display:"flex",flexDirection:"column"}}>
            <div>分類 {this.renderToggleCategoryAll()}</div>
            <div style={{display:"flex", flexWrap:"wrap"}}>
              {Remodel.categories(true).map(category => (
                <div key={category}>
                  <Checkbox
                    label={category} labelStyle={{whiteSpace: "nowrap"}}
                    iconStyle={{marginRight:"2px"}} style={{paddingRight:"8px"}}
                    checked={this.state.categories[category]}
                    onCheck={(ev, checked) => this.setState({categories: {...this.state.categories, [category]:checked}})}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  render() {
    let url = "http://wikiwiki.jp/kancolle/?改修工廠#s_kaisyu";
    return (
      <div>
        <div>
          <span>出典: <a href="http://wikiwiki.jp/kancolle/?%B2%FE%BD%A4%B9%A9%BE%B3#s_kaisyu">{url}</a></span>
          {this.renderFilterControl()}
          {this.renderTable()}
        </div>
      </div>
    );
  }
}
