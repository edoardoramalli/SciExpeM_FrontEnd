import React from "react";
import {checkError} from "../Tool";
import {Empty, Row, Spin} from "antd";


const Plotly = require('plotly-latest')
import createPlotlyComponent from "react-plotly.js/factory";

const Plot = createPlotlyComponent(Plotly);


class VisualizeParityPlot extends React.Component {
    constructor() {
        super();
        this.state = {
            obj_modelA: {}
        }
    }


    createParityPlot = (obj_list) => {


        let tmp = []
        Object.keys(obj_list).forEach(e => {
            let exp = []
            let sim = []
            console.log(obj_list[e])
            console.log(obj_list[e].data)
            obj_list[e].data.forEach(tuple => {
                exp.push(tuple[0])
                sim.push(tuple[1])
            })

            // const line_x = [Math.min.apply(Math, exp), Math.max.apply(Math, exp)]
            // const line_y = [Math.min.apply(Math, sim), Math.max.apply(Math, sim)]

            const min_abs = Math.min.apply(Math, [Math.min.apply(Math, exp), Math.min.apply(Math, sim)])
            const max_abs = Math.max.apply(Math, [Math.max.apply(Math, exp), Math.max.apply(Math, sim)])

            console.log(min_abs)
            console.log(sim)

            tmp.push(
                <Row>
                    <Plot
                        data={[
                            {
                                x: [min_abs, max_abs],
                                y: [min_abs, max_abs],
                                type: 'scatter',
                                mode: 'lines',
                                line: {dash: 'dash'},
                                name: '',
                                hovertemplate: '',
                                // marker: {color: 'red'},
                            },
                            {
                                x: exp,
                                y: sim,
                                type: 'scatter',
                                mode: 'markers',
                                marker: {color: 'red'},
                                text: obj_list[e].info,
                                hovertemplate: '<b>ID: %{text}</b>',
                                name: 'parity'
                            },]}
                        layout={{
                            width: 500,
                            margin: {l: 60 , r: 5, b: 50, t: 50},
                            showlegend: false,
                            title: e,
                            scaleanchor: 'x',
                            scaleratio: 1,
                            xaxis: {
                                type: 'log',
                                title: 'Experiment',
                            },
                            yaxis: {
                                type: 'log',
                                title: 'Simulation',
                            }
                        }}
                        // layout={{...this.state.baseConfig, ...plot.info[y_name][x_name]}}
                        // config={{staticPlot: true}}
                    />
                </Row>
            )
        })
        return tmp
    }

    render() {
        let obj;


        if (this.props.loading) {
            obj = <Row justify="space-around" align="middle"><Spin size="large"/></Row>
        } else if (this.props.list_plot !== undefined && Object.keys(this.props.list_plot).length > 0) {
            obj = <Row>{this.createParityPlot(this.props.list_plot)}</Row>
        } else {
            obj = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
        }
        return (
            <>
                {obj}
            </>
        )
    }
}

export default VisualizeParityPlot;