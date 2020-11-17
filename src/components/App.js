import React, { lazy, Suspense } from 'react';

// Import CSS
import './App.css';

// Import Libraries
import {Layout} from "antd";
import NavBar from "./NavBar";

const ExperimentTable = lazy(() => import('./ExperimentTable'));
const SearchAndExecute = lazy(() => import('./Search'));
const WrappedCommonPropertiesForm = lazy(() => import('./InputExperimentForm'));
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
            "searchandexecute": <SearchAndExecute/>,
            // "input": <WrappedDataForm/>,
            "input-form": <WrappedCommonPropertiesForm/>,
            "about": <div>Ciaooo</div>
        }

        return (
            <Layout className="layout">
                <Header>
                    <NavBar updateStateApp = {this.updateStateApp}/>
                </Header>
                <Content style={{padding: '25px 25px', height: "100%"}}>
                    <div style={{background: '#fff', padding: 0, height: "100%"}}>
                        <Suspense fallback={<div>Loading...</div>}>
                            {currentMapping[current]}
                        </Suspense>
                    </div>

                </Content>
                <Footer style={{textAlign: 'center', float: 'bottom', padding: '25px'}}>
                    ©2020 Politecnico di Milano
                </Footer>
            </Layout>)
    }

}

export default App;

