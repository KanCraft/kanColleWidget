import React from "react";
import TextField from "material-ui/TextField";
import FeedbackContents from "./Contents";

export default class BugReportView extends FeedbackContents {
    getSpecificForms() {
        let errors = this.validate();
        return [
            <div style={this.styles.row} key={0}>
              <TextField name="view" fullWidth={true}
                value={this.state.view}
                onChange={this.onTextFieldChange}
                errorText={errors["view"]}
                hintText="バグが発生している画面はどこですか？"
                floatingLabelText="問題のある画面"/>
            </div>,
            <div style={this.styles.row} key={1}>
              <TextField name="asIs" fullWidth={true}
                value={this.state.asIs}
                multiLine={true}
                onChange={this.onTextFieldChange}
                errorText={errors["asIs"]}
                hintText="現状どのような挙動になっていますか？"
                floatingLabelText="観測される問題"/>
            </div>,
            <div style={this.styles.row} key={2}>
              <TextField name="toBe" fullWidth={true}
                value={this.state.toBe}
                multiLine={true}
                onChange={this.onTextFieldChange}
                errorText={errors["toBe"]}
                hintText="本来どのような挙動が期待されますか？"
                floatingLabelText="期待される挙動"/>
            </div>,
            <div style={this.styles.row} key={3}>
              <TextField name="body" fullWidth={true}
                multiLine={true}
                value={this.state.body}
                onChange={this.onTextFieldChange}
                hintText="なるべく詳細が欲しいです。再現条件とか。"
                rows={2}
                floatingLabelText="再現方法" />
            </div>
        ];
    }
    validate() {
        let errors = [];
        if (this.state.view.length == 0) {
            const description = "「問題のある画面」が入力されていません。";
            errors.push({key: "view", description});
        }
        if (this.state.asIs.length == 0) {
            const description = "「観測される問題」が入力されていません。";
            errors.push({key: "asIs", description});
        }
        if (this.state.toBe.length == 0) {
            const description = "「期待される挙動」が入力されていません。";
            errors.push({key: "toBe", description});
        }
        return errors.reduce((self,err) => Object.assign(self, {[err.key]:err.description}),{});
    }
    getSearchParams() {
        let params = new URLSearchParams();
        params.set("title", this.state.title);
        let body = [
            "# 画面", this.state.view,
            "# 観測される問題", this.state.asIs,
            "# 期待される挙動", this.state.toBe,
            "# 再現方法", this.state.body,
            "-------",
            "環境", `> ${this.state.env}`,
            "バージョン", `> ${this.state.version}`
        ].join("\n\n");
        params.set("body", body);
        return params;
    }
}
