import React from "react";

import {Tabs} from "antd";

import WorldDiff from "./WorldDiff";


class TabWorldDiff extends React.Component {

    render() {

        const common_props = {
            settings: this.props.settings,
            modelA: this.props.modelA,
            modelB: this.props.modelB,
            query: this.props.query
        }

        return (
            <Tabs tabPosition={'top'} centered >
                <Tabs.TabPane tab="Score" key="score">
                    <WorldDiff
                        subject={'score'}
                        {...common_props}
                    />
                </Tabs.TabPane>
                <Tabs.TabPane tab="d0L2" key="d0L2">
                    <WorldDiff
                        subject={'d0L2'}
                        {...common_props}
                    />
                </Tabs.TabPane>
                <Tabs.TabPane tab="d1L2" key="d1L2">
                    <WorldDiff
                        subject={'d1L2'}
                        {...common_props}
                    />
                </Tabs.TabPane>
                <Tabs.TabPane tab="d0Pe" key="d0Pe">
                    <WorldDiff
                        subject={'d0Pe'}
                        {...common_props}
                    />
                </Tabs.TabPane>
                <Tabs.TabPane tab="d1Pe" key="d1Pe">
                    <WorldDiff
                        subject={'d1Pe'}
                        {...common_props}
                    />
                </Tabs.TabPane>
                <Tabs.TabPane tab="shift" key="shift">
                    <WorldDiff
                        subject={'shift'}
                        {...common_props}
                    />
                </Tabs.TabPane>
            </Tabs>
        )
    }

}

export default TabWorldDiff;