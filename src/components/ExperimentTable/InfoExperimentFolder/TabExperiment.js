// React import
import React, {lazy} from "react";

// Third partis import
import {Tabs} from 'antd';
import InitialSpecies from "../../ExperimentForm/InitialSpecies";
const { TabPane } = Tabs;

// Local import
// const InfoExperiment = lazy(() => import('./InfoExperiment'));
// const CommonPropertyTab = lazy(() => import('./CommonPropertyTab'))
// const InitialSpecieTab = lazy(() => import('./InitialSpecieTab'))
// const BibliographyTab = lazy(()=> import('./BibliographyTab'))
// const ExperimentFile = lazy(() => import('./ExperimentFile'));
// const ManagementExperiment = lazy(() => import('./ManagementExperiment'));
// const RawData = lazy(() => import('./RawData'))
// const PlotExperiment = lazy(() => import('./PlotExperiment'))
// const ExecutionTab = lazy(() => import('./ExecutionTab'))
// const CurveMatchingResult = lazy(() => import('./CurveMatchingResult'))
// const OSFile = lazy(() => import('./OSFile'));

import InfoExperiment from "./InfoExperiment";
import CommonPropertyTab from "./CommonPropertyTab";
import InitialSpecieTab from "./InitialSpecieTab";
import BibliographyTab from "./BibliographyTab";
import ExperimentFile from "./ExperimentFile";
import ManagementExperiment from "./ManagementExperiment";
import RawData from "./RawData";
import PlotExperiment from "./PlotExperiment";
import ExecutionTab from "./ExecutionTab";
import CurveMatchingResult from "./CurveMatchingResult";
import OSFile from "./OSFile";
import BackupTab from "./BackupTab";



class TabExperiment extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            exp_id: this.props['exp_id']
        }
    }

    // getSnapshotBeforeUpdate(prevProps, prevState) {
    //     //
    //     // const list = this.listRef.current;
    //     // return list.scrollHeight - list.scrollTop;
    //     console.log('prima', window.pageYOffset)
    //     return null
    // }
    //
    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     console.log('dopo', window.pageYOffset)
    // }

    render() {
        return(
            <Tabs defaultActiveKey="ExpTab1" >
                <TabPane tab="Info" key="ExpTab1">
                    <InfoExperiment props={this.props.experiment}/>
                </TabPane>
                <TabPane tab="Common Properties" key="ExpTab2">
                    <CommonPropertyTab
                        exp_id={this.props.exp_id}
                        name={'CommonProperty'}
                    />
                </TabPane>
                <TabPane tab="Initial Species" key="ExpTab3">
                    <InitialSpecieTab exp_id={this.props.exp_id} />
                </TabPane>
                <TabPane tab="Bibliography" key="ExpTab4">
                    <BibliographyTab
                        exp_id={this.props.exp_id}
                    />
                </TabPane>
                <TabPane tab="Plot Data" key="ExpTab5">
                    <PlotExperiment exp_id={this.props.experiment.id}/>
                </TabPane>
                <TabPane tab="Raw Data" key="ExpTab6">
                    <RawData exp_id={this.props.experiment.id} type={"data"}/>
                </TabPane>
                <TabPane tab="Profiles" key="ExpTab7">
                    <RawData exp_id={this.props.experiment.id} type={"profile"}/>
                </TabPane>
                <TabPane tab="OS Input File" key="ExpTab8">
                    <OSFile exp_id={this.props.experiment.id} />
                </TabPane>
                <TabPane tab="ReSpecTh File" key="ExpTab9">
                    <ExperimentFile exp_id={this.props.experiment.id} type={"ReSpecTh"}/>
                </TabPane>
                <TabPane tab="Characteristics" key="ExpTab10">
                    <ManagementExperiment
                        exp_id={this.props.exp_id}
                        props={this.props.experiment}
                    />
                </TabPane>
                <TabPane tab="Executions" key="ExpTab11">
                    <ExecutionTab
                        experiment={this.props.experiment}
                    />
                </TabPane>
                <TabPane tab="Curve Matching Results" key="ExpTab12">
                    <CurveMatchingResult
                        exp_id={this.props.exp_id}
                    />
                </TabPane>
                <TabPane tab="Backups" key="ExpTab13">
                    <BackupTab
                        experiment={this.props.experiment}
                    />
                </TabPane>
            </Tabs>
        )
    }
}

export default TabExperiment;