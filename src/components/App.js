import React, { lazy, Suspense } from 'react';

// Import CSS
import './App.css';

// Import Libraries
import {BackTop, Layout,  Spin} from "antd";
import NavBar from "./NavBar";

// import {SearchAndExecute} from "./Search";


const ExperimentTable = lazy(() => import('./ExperimentTable/ExperimentTable'));
// const SearchAndExecute = lazy(() => import('./Search'));


const InsertExperimentForm = lazy(() => import('./ExperimentForm'));

const InsertExperimentFile = lazy(() => import('./InsertExperimentFile'));
const {Header, Content, Footer} = Layout;



class App extends React.Component {

    constructor(props) {
        super(props);
        this.updateStateApp = this.updateStateApp.bind(this)
        this.state = {
            current: 'experiments'
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
            "input": <InsertExperimentFile/>,
            "input-form": <InsertExperimentForm/>,
            // "about": <div>Ciaooo</div>
        }

        return (
            <Layout className="layout">
                <Header>
                    <NavBar updateStateApp = {this.updateStateApp}/>
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

