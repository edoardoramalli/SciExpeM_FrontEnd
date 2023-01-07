// import React, { lazy, Suspense } from 'react';
import React from 'react';


// Import CSS
import './App.css';

// Import Libraries
import {BackTop, Layout, message, Select, Spin, ConfigProvider, theme} from "antd";
import NavBar from "./NavBar";


import ExperimentTable from "./ExperimentTable/ExperimentTable";
import InsertCheModelFile from "./ChemModelForm/InsertCheModelFile";
import InsertExperimentForm from './ExperimentForm/ExperimentForm';
import ModelTable from "./ModelTable/ModelTable";
import InsertExperimentFile from "./ExperimentFile/InsertExperimentFile";
import ExperimentFilterTable from "./Analysis/ExperimentFilterTable";
import SpeciesTable from "./SpeciesTable/SpeciesTable";
import CrowdSourcing from "./CrowdSourcing/CrowdSourcing";
import Validation from "./Validation/Validation";
import DashBoard from "./DashBoard/DashBoard";
import Homepage from "./Homepage/Homepage";


const {Header, Content, Footer} = Layout;


const {defaultAlgorithm, darkAlgorithm} = theme;

class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            current: 'homepage',
            fuels: [],
            species: [],
            current_theme: localStorage.hasOwnProperty('current_theme') ? localStorage.getItem('current_theme') : 'normal',
            select_theme: {'normal': defaultAlgorithm, 'dark': darkAlgorithm}
        }
    }


    updateStateApp = (e) => {
        this.setState({current: e.key})
    }

    updateStateUpDirect = (e) => {
        this.setState({current: e})
    }

    switchTheme = () => {
        let new_theme;
        if (this.state.current_theme === 'normal') {
            new_theme = 'dark'
        } else {
            new_theme = 'normal'
        }
        localStorage.setItem('current_theme', new_theme)
        this.setState({current_theme: new_theme})
    }

    render() {

        const current = this.state.current;
        const currentMapping = {
            "homepage": <Homepage updateStateUpDirect={this.updateStateUpDirect}/>,
            "experiments": <ExperimentTable/>,
            "experimentInputFile": <InsertExperimentFile/>,
            "experimentInputForm": <InsertExperimentForm/>,
            "models": <ModelTable/>,
            "species": <SpeciesTable/>,
            "chemModelInputForm": <InsertCheModelFile/>,
            "analysis": <ExperimentFilterTable/>,
            "crowdSourcing": <CrowdSourcing/>,
            "validation": <Validation/>,
            "dashboard": <DashBoard/>
        }


        return (
            <ConfigProvider
                theme={{
                    algorithm: this.state.select_theme[this.state.current_theme],
                    token: {
                        colorPrimary: '#1faf21',
                    },
                }}
            >
                <Layout className="layout" style={{minHeight: "100vh"}}>
                    <Header style={{backgroundColor: "transparent"}}>
                        <NavBar
                            current={current}
                            updateStateApp={this.updateStateApp}
                            switchTheme={this.switchTheme}
                            theme={this.state.current_theme}
                        />
                    </Header>
                    <Content style={{padding: '25px 25px', height: "100%"}}>
                        {/*<div style={{background: '#fff', padding: 0}}>*/}
                        {currentMapping[current]}
                        {/*</div>*/}
                        <BackTop>
                            <div
                                style={{
                                    height: 40,
                                    width: 40,
                                    lineHeight: '40px',
                                    borderRadius: 4,
                                    backgroundColor: '#1088e9',
                                    color: '#fff',
                                    textAlign: 'center',
                                    fontSize: 14,
                                }}
                            >
                                UP
                            </div>
                        </BackTop>

                    </Content>
                    <Footer style={{textAlign: 'center', float: 'bottom', padding: '25px'}}>
                        ©2020 Politecnico di Milano - Developed by <b>Edoardo Ramalli</b>
                    </Footer>
                </Layout>
            </ConfigProvider>
        )
    }

}

export default App;

