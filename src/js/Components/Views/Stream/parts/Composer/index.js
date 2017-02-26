import React, {Component, PropTypes} from "react";

export default class VideoComposer extends Component {
    render() {
        const styles = {
            container: {
                padding: "24px",
            }
        };
        return (
          <div style={styles.container}>
            <div>
              <video
                src={this.props.src}
                autoPlay={true}
                controls={true}
                loop={true}
              />
            </div>
            <div>
              <h1>TODO: ここで編集とかGIF変換とかできるようにする</h1>
            </div>
          </div>
        );
    }
    static propTypes = {
        src: PropTypes.string.isRequired,
    }
}
