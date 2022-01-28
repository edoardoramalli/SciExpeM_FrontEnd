import React from "react";
import {Col, Empty, Row, Spin} from "antd";

import {checkError, replaceValueDiz} from "../Tool";

const Plotly = require('plotly-latest')
import createPlotlyComponent from "react-plotly.js/factory";
const Plot = createPlotlyComponent(Plotly);

class GroupPlot extends React.Component{

    constructor() {
        super();
        this.state = {
            plots: [],
            baseConfig: {
                width: 200,
                height: 200,
                showlegend: false,
                margin: {l: 60 , r: 5, b: 50, t: 50},
                font: {
                    size: 10,
                },
            }
        }
    }

    createGroupPlot(list_plot){
        let tmp = {};
        list_plot.forEach(plot => {
                Object.keys(plot.data).forEach(y_name => {
                    Object.keys(plot.data[y_name]).forEach(x_name => {
                            tmp[plot.info[y_name][x_name]['title']] =
                                <Col>
                                    <Plot
                                        data={plot.data[y_name][x_name]}
                                        layout={{...this.state.baseConfig, ...plot.info[y_name][x_name]}}
                                        config={{staticPlot: true}}
                                    />
                                </Col>
                        }
                    )
                })
            }
        )
        let tmp2 = []
        Object.keys(tmp).map(Number).sort().forEach(key =>{
            tmp2.push(tmp[key])
        })
        return tmp2
    }


    render() {
        let obj;

        if (this.props.list_plot.length > 0) {
            obj = <Row>{this.createGroupPlot(this.props.list_plot)}</Row>
        } else if (this.props.loading) {
            obj = <Row justify="space-around" align="middle"><Spin size="large"/></Row>
        } else {
            obj = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
        }
        return(
            <>
                {obj}
            </>
        )
    }

}

export default GroupPlot;