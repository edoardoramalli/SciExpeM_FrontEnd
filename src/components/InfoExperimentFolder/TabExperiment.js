// React import
import React, {lazy} from "react";

// Third partis import
import {Tabs} from 'antd';
const { TabPane } = Tabs;

// Local import
const InfoExperiment = lazy(() => import('./InfoExperiment'));
const ExperimentFile = lazy(() => import('./ExperimentFile'));
const ExperimentDraw = lazy(() => import('../ExperimentDraw'));
const ManagementExperiment = lazy(() => import('./ManagementExperiment'));
const RawData = lazy(() => import('./RawData'))



class TabExperiment extends React.Component{

    render() {
        return(
            <Tabs defaultActiveKey="1" onChange={this.callback}>
                <TabPane tab="Info" key="1">
                    <InfoExperiment props={this.props.experiment}/>
                </TabPane>
                <TabPane tab="Common Property" key="2">
                    <ManagementExperiment props={this.props.experiment}/>
                </TabPane>
                <TabPane tab="Initial Specie" key="3">
                    <ManagementExperiment props={this.props.experiment}/>
                </TabPane>
                <TabPane tab="Bibliography" key="4">
                    <ManagementExperiment props={this.props.experiment}/>
                </TabPane>
                <TabPane tab="Plot Data" key="5">
                    <ExperimentDraw exp_id={this.props.experiment.id}/>
                </TabPane>
                <TabPane tab="Raw Data" key="6">
                    <RawData exp_id={this.props.experiment.id} type={"dg1"}/>
                </TabPane>
                <TabPane tab="V-t profile" key="7">
                    <RawData exp_id={this.props.experiment.id} type={"dg2"}/>
                </TabPane>
                <TabPane tab="OS Input File" key="8">
                    <ExperimentFile exp_id={this.props.experiment.id} type={"OS"}/>
                </TabPane>
                <TabPane tab="ReSpecTh File" key="9">
                    <ExperimentFile exp_id={this.props.experiment.id} type={"ReSpecTh"}/>
                </TabPane>
                <TabPane tab="Management" key="10">
                    <ManagementExperiment props={this.props.experiment}/>
                </TabPane>
            </Tabs>
        )
    }
}

export default TabExperiment;