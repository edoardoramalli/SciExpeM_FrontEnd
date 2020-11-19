import React, {lazy} from "react";
import {Tabs} from 'antd';

const { TabPane } = Tabs;
const InfoExperiment = lazy(() => import('./InfoExperiment'));



class TabExperiment extends React.Component{
    constructor(props) {
        super(props);
        console.log(props);

    }
    callback(key) {
        console.log(key);
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
                    Content of Tab Pane 2
                </TabPane>
                <TabPane tab="Row Data" key="3">
                    Content of Tab Pane 3
                </TabPane>
            </Tabs>
        )
    }
}

export default TabExperiment;