import React from "react";

import TextField from "material-ui/TextField";
import FeedbackContents from "./Contents";

export default class RequestView extends FeedbackContents {
    getSpecificForms() {
        let errors = this.validate();
        return [
            <div style={this.styles.row} key={0}>
              <TextField name="body" fullWidth={true}
                multiLine={true}
                value={this.state.body}
                onChange={this.onTextFieldChange}
                errorText={(errors["body"]) ? errors["body"] : null}
                hintText="Markdown形式も可"
                rows={2}
                floatingLabelText="詳細" />
            </div>,
            <div style={this.styles.row} key={1}>
              <TextField name="issue" fullWidth={true}
                multiLine={true}
                value={this.state.issue}
                onChange={this.onTextFieldChange}
                errorText={errors["issue"] ? errors["issue"] : null}
                hintText="この機能を実装した場合に解決される問題はなんですか？ 必ず「〜という問題」という形式で書いてください"
                rows={2}
                floatingLabelText="解決される問題" />
            </div>
        ];
    }
    validate() {
        let errors = this._validate();
        if (this.state.issue.length == 0) {
            const description = "「解決される問題」が入力されていません。";
            errors.push({key: "issue", description});
        } else if (/問題$/.test(this.state.issue) == false) {
            const description = "「解決される問題」は必ず「〜という問題」という形式で書いてください。";
            errors.push({key: "issue", description});
        }
        if (this.state.body.length == 0) {
            const description = "「詳細」が入力されていません。";
            errors.push({key: "body", description});
        }
        return errors.reduce((self,err) => Object.assign(self, {[err.key]:err.description}),{});
    }
    getSearchParams() {
        let params = new URLSearchParams();
        params.set("title", this.state.title);
        let body = [
            this.state.body,
            "# 解決される問題", this.state.issue,
            "-------",
            "環境", `> ${this.state.env}`,
            "バージョン", `> ${this.state.version}`
        ].join("\n\n");
        params.set("body", body);
        return params;
    }
}
