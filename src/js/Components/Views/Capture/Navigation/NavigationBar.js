import React, {Component, PropTypes} from "react";

// Components
import Menu        from "material-ui/Menu";
import MenuItem    from "material-ui/MenuItem";
import IconButton  from "material-ui/IconButton";
import Paper       from "material-ui/Paper";
import Avatar      from "material-ui/Avatar";
import Icon        from "../../FontAwesome";

// Icons
import PictureInPictureAlt from "material-ui/svg-icons/action/picture-in-picture-alt";
import Gesture             from "material-ui/svg-icons/content/gesture";
import Crop                from "material-ui/svg-icons/image/crop";
import TextFields          from "material-ui/svg-icons/editor/text-fields";
import Divider             from "material-ui/Divider";
import Download            from "material-ui/svg-icons/file/file-download";
import Refresh             from "material-ui/svg-icons/navigation/refresh";
import Undo                from "material-ui/svg-icons/content/undo";

// Colors
import {red500, grey200} from "material-ui/styles/colors";

// Class
import {Pencil, Text} from "../Tools";

const styles = {
    paper: {
        display: "inline-block",
        float: "left",
        margin: "0 32px 16px 0",
    },
    selected: {
        backgroundColor: grey200,
        zIndex: "-1",
    }
};

export default class NavigationBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            twitterProfile: null
        };
    }
    render() {
        return (
          <div style={{flex: "initial", width: "100px"}}>
            <Paper style={styles.paper}>
              <Menu value={this.props.selectedTool} selectedMenuItemStyle={styles.selected}>
                {this.renderRectAngleMenuItem()}
                {this.renderPencilMenuItem()}
                {this.renderCropItem()}
                {this.renderTextMenueItem()}
                <Divider />
                {this.renderDownloadItem()}
                {this.renderTweetItem()}
                <Divider />
                {this.renderCompressItem()}
                {this.renderRefreshItem()}
                {this.renderUndoMenuItem()}
              </Menu>
            </Paper>
          </div>
        );
    }
    renderRectAngleMenuItem() {
        return  (
          <MenuItem disabled={true} primaryText={
            <IconButton tooltip="未実装">
            <PictureInPictureAlt />
            </IconButton>
          }/>
        );
    }
    renderPencilMenuItem() {
        return (
          <MenuItem value="Pencil" primaryText={
              <IconButton tooltip="ペン">
                <Gesture />
              </IconButton>
          } onTouchTap={() => this.props.setTool(Pencil)}/>
        );
    }
    renderCropItem() {
        return (
          <MenuItem disabled={true} primaryText={
              <IconButton tooltip="未実装">
                <Crop />
              </IconButton>
          }/>
        );
    }
    renderTextMenueItem() {
        return (
          <MenuItem value="Text" primaryText={
              <IconButton tooltip="テキスト">
                <TextFields />
              </IconButton>
          } onTouchTap={() => this.props.setTool(Text)}/>
        );
    }
    renderDownloadItem() {
        return (
          <MenuItem onTouchTap={this.props.onDownloadClicked} primaryText={
              <IconButton tooltip="保存">
                <Download />
              </IconButton>
          }/>
        );
    }
    renderTweetItem() {
        return (
          <MenuItem onTouchTap={this.props.onTweetClicked} primaryText={
              <IconButton tooltip="ツイート">
                {this.getTwitterIcon()}
              </IconButton>
          }/>
        );
    }
    getTwitterIcon() {
        if (!this.props.twitterProfile) return <Icon name="twitter" size={20}/>;
        return <Avatar src={this.props.twitterProfile.profile_image_url} size={20} />;
    }
    renderCompressItem() {
        return (
          <MenuItem
            onTouchTap={this.props.compressImageSize}
            title={"画像ファイル容量を削減します"}
            primaryText={this.props.getFileSizeText()}
            style={(this.props.getFileSize() > 3*1000*1000) ? {color:red500} : null}
          />
        );
    }
    renderRefreshItem() {
        return (
          <MenuItem onTouchTap={() => { location.reload(); }}  primaryText={
              <IconButton tooltip="リセット">
                <Refresh />
              </IconButton>
          }/>
        );
    }
    renderUndoMenuItem() {
        return (
          <MenuItem onTouchTap={this.props.onClickUndo}  primaryText={
              <IconButton tooltip="ひとつもどる">
                <Undo />
              </IconButton>
          }/>
        );
    }
    static propTypes = {
        twitterProfile:    PropTypes.any,
        getFileSize:       PropTypes.any,
        getFileSizeText:   PropTypes.any,
        compressImageSize: PropTypes.any,
        onTweetClicked:    PropTypes.any,
        onDownloadClicked: PropTypes.any,
        onColorChanged:    PropTypes.any,
        onClickUndo:       PropTypes.func.isRequired,
        selectedTool:      PropTypes.any,
        setTool:           PropTypes.any, // TODO: ぜんぶanyじゃあかんやろ
    }
}
