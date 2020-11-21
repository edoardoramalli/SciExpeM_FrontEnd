import React, {lazy} from "react";
import {Tabs} from 'antd';
import RawData from "./RawData";

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
                <TabPane tab="Raw Data" key="3">
                    <RawData exp_id={this.props.experiment.id} type={"dg1"}/>
                </TabPane>
                <TabPane tab="V-t profile" key="4">
                    <RawData exp_id={this.props.experiment.id} type={"dg2"}/>
                </TabPane>
                <TabPane tab="OS Input File" key="5">
                    <ExperimentFile exp_id={this.props.experiment.id} type={"OS"}/>
                </TabPane>
                <TabPane tab="ReSpecTh File" key="6" disabled>
                    <ExperimentFile exp_id={this.props.experiment.id} type={"ReSpecTh"}/>
                </TabPane>
            </Tabs>
        )
    }
}

export default TabExperiment;