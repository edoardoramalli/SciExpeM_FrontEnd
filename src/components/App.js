// import React, { lazy, Suspense } from 'react';
import React from 'react';


// Import CSS
import './App.css';

// Import Libraries
import {BackTop, Layout, message, Select, Spin} from "antd";
import NavBar from "./NavBar";


// import {SearchAndExecute} from "./Search";


// const ExperimentTable = lazy(() => import('./ExperimentTable/ExperimentTable'));
// const InsertCheModelFile = lazy(() => import('./ChemModelForm/InsertCheModelFile'));
// const InsertExperimentForm = lazy(() => import('./ExperimentForm/ExperimentForm'));
// const ModelTable = lazy(()=> import('./ModelTable/ModelTable'))
// const InsertExperimentFile = lazy(() => import('./ExperimentFile/InsertExperimentFile'));
// const ExperimentFilterTable = lazy(() => import('./Analysis/ExperimentFilterTable'));
// const SpeciesTable = lazy(() => import('./SpeciesTable/SpeciesTable'));
// const CrowdSourcing = lazy(() => import('./CrowdSourcing/CrowdSourcing'));

import ExperimentTable from "./ExperimentTable/ExperimentTable";
import InsertCheModelFile from "./ChemModelForm/InsertCheModelFile";
import InsertExperimentForm from './ExperimentForm/ExperimentForm';
import ModelTable from "./ModelTable/ModelTable";
import InsertExperimentFile from "./ExperimentFile/InsertExperimentFile";
import ExperimentFilterTable from "./Analysis/ExperimentFilterTable";
import SpeciesTable from "./SpeciesTable/SpeciesTable";
import CrowdSourcing from "./CrowdSourcing/CrowdSourcing";
import Validation from "./Validation/Validation";
import DashBoard from  "./DashBoard/DashBoard";


const {Header, Content, Footer} = Layout;



class App extends React.Component {

    constructor(props) {
        super(props);
        this.updateStateApp = this.updateStateApp.bind(this)
        this.state = {
            current: 'experiments',
            fuels: [],
            species: [],
        }
    }

    updateStateApp(e) {
        this.setState({
            current: e.key
        })
    }


    render() {

        const current = this.state.current;
        const currentMapping = {
            "experiments": <ExperimentTable/>,
            "experimentInputFile": <InsertExperimentFile/>,
            "experimentInputForm": <InsertExperimentForm/>,
            "models": <ModelTable/>,
            "species": <SpeciesTable/>,
            "chemModelInputForm": <InsertCheModelFile />,
            "analysis": <ExperimentFilterTable />,
            "crowdSourcing": <CrowdSourcing />,
            "validation": <Validation/>,
            "dashboard": <DashBoard />
        }

        return (
            <Layout className="layout">
                <Header>
                    <NavBar current={current} updateStateApp = {this.updateStateApp}/>
                </Header>
                <Content style={{padding: '25px 25px', height: "100%"}}>
                    <div style={{background: '#fff', padding: 0}}>
                        {/*<Suspense fallback={<div><Spin tip="Loading..." size="large" /></div>}>*/}
                            {currentMapping[current]}
                        {/*</Suspense>*/}
                    </div>
                    <BackTop>
                        <div
                            style={{  height: 40,
                                width: 40,
                                lineHeight: '40px',
                                borderRadius: 4,
                                backgroundColor: '#1088e9',
                                color: '#fff',
                                textAlign: 'center',
                                fontSize: 14,}}
                        >
                            UP
                        </div>
                    </BackTop>

                </Content>
                <Footer style={{textAlign: 'center', float: 'bottom', padding: '25px'}}>
                    ©2020 Politecnico di Milano
                </Footer>
            </Layout>)
    }

}

export default App;

