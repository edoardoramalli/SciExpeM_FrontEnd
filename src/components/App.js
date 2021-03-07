import React, { lazy, Suspense } from 'react';

// Import CSS
import './App.css';

// Import Libraries
import {BackTop, Layout, message, Select, Spin} from "antd";
import NavBar from "./NavBar";


// import {SearchAndExecute} from "./Search";


const ExperimentTable = lazy(() => import('./ExperimentTable/ExperimentTable'));
const InsertCheModelFile = lazy(() => import('./ChemModelForm/InsertCheModelFile'));
const InsertExperimentForm = lazy(() => import('./ExperimentForm/ExperimentForm'));
const ModelTable = lazy(()=> import('./ModelTable/ModelTable'))
const InsertExperimentFile = lazy(() => import('./ExperimentFile/InsertExperimentFile'));
const ExperimentFilterTable = lazy(() => import('./Analysis/ExperimentFilterTable'));


const {Header, Content, Footer} = Layout;


const axios = require('axios');

class App extends React.Component {

    constructor(props) {
        super(props);
        this.updateStateApp = this.updateStateApp.bind(this)
        this.state = {
            current: 'models',
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
            // "searchandexecute": <SearchAndExecute/>,
            "experimentInputFile": <InsertExperimentFile/>,
            "experimentInputForm": <InsertExperimentForm/>,
            "models": <ModelTable/>,
            "chemModelInputForm": <InsertCheModelFile />,
            "analysis": <ExperimentFilterTable />
        }

        return (
            <Layout className="layout">
                <Header>
                    <NavBar current={current} updateStateApp = {this.updateStateApp}/>
                </Header>
                <Content style={{padding: '25px 25px', height: "100%"}}>
                    <div style={{background: '#fff', padding: 0, height: "100%"}}>
                        <Suspense fallback={<div><Spin tip="Loading..." size="large" /></div>}>
                            {currentMapping[current]}
                        </Suspense>
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

