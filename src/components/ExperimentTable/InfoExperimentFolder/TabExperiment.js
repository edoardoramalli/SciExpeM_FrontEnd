// React import
import React, {lazy} from "react";

// Third partis import
import {Tabs} from 'antd';
const { TabPane } = Tabs;

// Local import
const InfoExperiment = lazy(() => import('./InfoExperiment'));
const CommonPropertyTab = lazy(() => import('./CommonPropertyTab'))
const BibliographyTab = lazy(()=> import('./BibliographyTab'))
const ExperimentFile = lazy(() => import('./ExperimentFile'));
const ManagementExperiment = lazy(() => import('./ManagementExperiment'));
const RawData = lazy(() => import('./RawData'))
const PlotExperiment = lazy(() => import('./PlotExperiment'))
const ExecutionTab = lazy(() => import('./ExecutionTab'))
const CurveMatchingResult = lazy(() => import('./CurveMatchingResult'))



class TabExperiment extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            exp_id: this.props['exp_id']
        }
    }

    render() {
        return(
            <Tabs defaultActiveKey="1" onChange={this.callback}>
                <TabPane tab="Info" key="1">
                    <InfoExperiment props={this.props.experiment}/>
                </TabPane>
                <TabPane tab="Common Property" key="2">
                    <CommonPropertyTab
                        exp_id={this.props.exp_id}
                        name={'CommonProperty'}
                    />
                </TabPane>
                <TabPane tab="Initial Specie" key="3">
                    <CommonPropertyTab
                        exp_id={this.props.exp_id}
                        name={'InitialSpecie'}
                    />
                </TabPane>
                <TabPane tab="Bibliography" key="4">
                    <BibliographyTab
                        exp_id={this.props.exp_id}
                    />
                </TabPane>
                <TabPane tab="Plot Data" key="5">
                    <PlotExperiment exp_id={this.props.experiment.id}/>
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
                <TabPane tab="Characteristics" key="10">
                    <ManagementExperiment
                        exp_id={this.props.exp_id}
                        props={this.props.experiment}
                    />
                </TabPane>
                <TabPane tab="Execution" key="11">
                    <ExecutionTab
                        experiment={this.props.experiment}
                    />
                </TabPane>
                <TabPane tab="Curve Matching Result" key="21">
                    <CurveMatchingResult
                        exp_id={this.props.exp_id}
                    />
                </TabPane>
            </Tabs>
        )
    }
}

export default TabExperiment;