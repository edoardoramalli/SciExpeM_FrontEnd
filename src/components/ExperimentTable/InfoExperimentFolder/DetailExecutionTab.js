import React, {lazy} from "react";
import {Tabs} from "antd";

const ExecutionPlot = lazy(() => import('./ExecutionPlot'))

class DetailExecutionTab extends React.Component {
    render() {
        return(
            <Tabs tabPosition={'top'}>
                <Tabs.TabPane tab="Raw Data" key="1">
                    Work in progress...
                </Tabs.TabPane>
                <Tabs.TabPane tab="Plot" key="2">
                    <ExecutionPlot id={this.props.exec_id} api={'frontend/API/getPlotExecution'}/>
                </Tabs.TabPane>
            </Tabs>
        )
    }
}

export default DetailExecutionTab;