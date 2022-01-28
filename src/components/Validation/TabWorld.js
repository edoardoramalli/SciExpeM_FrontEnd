import React from "react";

import {Tabs} from "antd";


import VisualizeTwoWorlds from "./VisualizeTwoWorlds";
import VisualizeTwoTable from "./VisualizeTwoTable";


class TabWorld extends React.Component {

    render() {

        // this.props.query ? this.sendUpdate(this.state.subject) : null

        const common_props = {
            settings: this.props.settings,
            modelA: this.props.modelA,
            modelB: this.props.modelB,
            query: this.props.query
        }


        return (
            <Tabs tabPosition={'top'} centered >
                <Tabs.TabPane tab="Score" key="score">
                    <VisualizeTwoWorlds
                        subject={'score'}
                        {...common_props}
                    />
                </Tabs.TabPane>
                <Tabs.TabPane tab="d0L2" key="d0L2">
                    <VisualizeTwoWorlds
                        subject={'d0L2'}
                        {...common_props}
                    />
                </Tabs.TabPane>
                <Tabs.TabPane tab="d1L2" key="d1L2">
                    <VisualizeTwoWorlds
                        subject={'d1L2'}
                        {...common_props}
                    />
                </Tabs.TabPane>
                <Tabs.TabPane tab="d0Pe" key="d0Pe">
                    <VisualizeTwoWorlds
                        subject={'d0Pe'}
                        {...common_props}
                    />
                </Tabs.TabPane>
                <Tabs.TabPane tab="d1Pe" key="d1Pe">
                    <VisualizeTwoWorlds
                        subject={'d1Pe'}
                        {...common_props}
                    />
                </Tabs.TabPane>
                <Tabs.TabPane tab="shift" key="shift">
                    <VisualizeTwoWorlds
                        subject={'shift'}
                        {...common_props}
                    />
                </Tabs.TabPane>
            </Tabs>
        )
    }

}

export default TabWorld;