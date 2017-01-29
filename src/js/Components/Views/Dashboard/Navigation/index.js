import React, {Component, PropTypes} from "react";

import Schedule         from "material-ui/svg-icons/action/schedule";
import PlaylistAddCheck from "material-ui/svg-icons/av/playlist-add-check";
import Timeline         from "material-ui/svg-icons/action/timeline";
import Assignment       from "material-ui/svg-icons/action/assignment";

// import Menu     from "material-ui/Menu";
// import MenuItem from "material-ui/MenuItem";

import {VTabs, VTabItem} from "./VerticalTabs";

export class MenuNavigation extends Component {
    render() {
        return (
          <VTabs selectedIndex={this.props.index} onItemSelected={this.props.select}>
            <VTabItem icon={<Schedule         />} />
            <VTabItem icon={<PlaylistAddCheck />} />
            <VTabItem icon={<Timeline         />} />
            <VTabItem icon={<Assignment       />} />
          </VTabs>
       );
    }
    static propTypes = {
        index:  PropTypes.number.isRequired,
        select: PropTypes.func.isRequired,
    }
}

// export class TabNavigation extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             index: 0
//         };
//     }
//     select(index) {
//         this.props.select(index);
//     }
//     render() {
//         return (
//             <BottomNavigation style={{position:"fixed", bottom:"0"}} selectedIndex={this.props.index}>
//               <BottomNavigationItem
//                 icon={<Schedule />}
//                 onTouchTap={() => this.select(0)}
//               />
//               <BottomNavigationItem
//                 icon={<PlaylistAddCheck />}
//                 onTouchTap={() => this.select(1)}
//               />
//               <BottomNavigationItem
//                 icon={<Timeline />}
//                 onTouchTap={() => this.select(2)}
//               />
//               <BottomNavigationItem
//                 icon={<Assignment />}
//                 onTouchTap={() => this.select(3)}
//               />
//             </BottomNavigation>
//         );
//     }
//     static propTypes = {
//         index:  PropTypes.number.isRequired,
//         select: PropTypes.func.isRequired,
//     }
// }
