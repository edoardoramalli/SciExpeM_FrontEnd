import React, {lazy} from "react";
import {Tabs} from 'antd';

const { TabPane } = Tabs;
const InfoExperiment = lazy(() => import('./InfoExperiment'));
const ExperimentFile = lazy(() => import('./ExperimentFile'));
const ExperimentDraw = lazy(() => import('../ExperimentDraw'));



class TabExperiment extends React.Component{

    callback(key) {
    }

    componentDidMount() {

    }

    render() {
        return(
            <Tabs defaultActiveKey="1" onChange={this.callback}>
                <TabPane tab="Info" key="1">
                    <InfoExperiment props={this.props.experiment}/>
                </TabPane>
                <TabPane tab="Plot Data" key="2">
                    <ExperimentDraw exp_id={this.props.experiment.id}/>
                </TabPane>
                <TabPane tab="Row Data" key="3">
                    Content of Tab Pane 3
                </TabPane>
                <TabPane tab="OS Input File" key="4" disabled>
                    <ExperimentFile exp_id={this.props.experiment.id} type={"OS"}/>
                </TabPane>
                <TabPane tab="ReSpecTh File" key="5" disabled>
                    <ExperimentFile exp_id={this.props.experiment.id} type={"ReSpecTh"}/>
                </TabPane>
            </Tabs>
        )
    }
}

export default TabExperiment;