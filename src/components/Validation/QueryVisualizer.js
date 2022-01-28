import React from "react";
import VisualizeTwoTable from "./VisualizeTwoTable";
import TabWorld from "./TabWorld";
import TabWorldDiff from "./TabWorldDiff";
import {Collapse} from "antd";
import TabCluster from "./TabCluster";

const {Panel} = Collapse;

class QueryVisualizer extends React.Component{

    render() {
        const common_props = {
            settings: this.props.settings,
            query: this.props.query,
            modelA: this.props.modelA,
            modelB: this.props.modelB
        }
        return(
            <Collapse defaultActiveKey={['2A']}>
                <Panel header="Table" key="2A">
                    <VisualizeTwoTable {...common_props}/>
                </Panel>
                <Panel header="3D Word" key="2B">
                    <TabWorld {...common_props}/>
                </Panel>
                <Panel header="3D Word - Diff" key="2C">
                    <TabWorldDiff {...common_props}/>
                </Panel>
                <Panel header="Clustering" key="2D">
                    <TabCluster {...common_props}/>
                    {/*<VisualizeTwoTable {...common_props}/>*/}
                </Panel>
                {this.props.additional ? this.props.additional : null}
            </Collapse>
        )
    }

}

export default QueryVisualizer;