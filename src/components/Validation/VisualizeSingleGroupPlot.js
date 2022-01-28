import React from "react";
import {checkError, replaceValueDiz} from "../Tool";
import {Col, Row, Spin} from "antd";

const Plotly = require('plotly-latest')
import createPlotlyComponent from "react-plotly.js/factory";

const Plot = createPlotlyComponent(Plotly);


class VisualizeSingleGroupPlot extends React.Component {

    constructor() {
        super();
        this.state = {
            plots: [],
            baseConfig: {
                width: 300,
                showlegend: true,
                margin: {l: 60, r: 5, b: 50, t: 150},
                font: {
                    size: 12,
                },
            }
        }
        console.log(this.props)
    }

    componentDidMount() {

        this.setState({loading: true})

        let newQuery = {}
        let queryA = {}
        let queryB = {}

        console.log('edooo', this.props.query  )

        if (this.props.query !== undefined) {

            Object.keys(this.props.query).forEach(e => {
                if (e.includes('chemModel__id')) {
                    // newQuery[e.replace('execution_column__execution__chemModel__id', 'execution__chemModel__id__in')] = [this.props.modelA, this.props.ModelB]
                } else if (e.startsWith('execution_column__')) {
                    newQuery[e.replace('execution_column__', '')] = this.props.query[e]
                } else {
                    newQuery[e] = this.props.query[e]
                }
            })

        }

        console.log('new', newQuery)

        axios.post(window.$API_address + 'frontend/API/getPlotsValidation', {
            'query': newQuery,
            'target': this.props.target,
            'chemModel_ids': [this.props.modelA, this.props.modelB]
        })
            .then(res => {
                this.setState({plots: this.createGroupPlot(JSON.parse(res.data)), loading:false})

                // return {'chemModel_id': chemModel_id, 'result': JSON.parse(res.data)}
            })
            .catch(error => {
                checkError(error)
                this.setState({loading:false})
                // return {'chemModel_id': chemModel_id, 'result': []}
            })
    }

    createGroupPlot(obj_plot_list) {

        let exp_plot = []

        let colors = ['blue', 'orange']

        let line = {'blue': ''}

        let color = {}

        obj_plot_list.forEach(obj_plot => {
            const data = obj_plot.data
            const info = obj_plot.info

            Object.keys(data).forEach(y_name => {
                Object.keys(data[y_name]).forEach(x_name => {
                    data[y_name][x_name].forEach(pair =>{
                        if(pair['mode'] === 'lines'){
                            if (!(Object.keys(color).includes(pair['name']))){
                                color[pair['name']] = colors.pop()
                            }
                            pair['line']['color'] = color[pair['name']]
                        }
                    })
                    exp_plot.push(
                        <Col>
                            <Plot
                                data={data[y_name][x_name]}
                                layout={{
                                    ...this.state.baseConfig,
                                    ...info[y_name][x_name],
                                    ...{
                                        'legend': {
                                            'orientation': "h",
                                            yanchor: "bottom",
                                            y: 1.02,
                                            xanchor: "left",
                                            x: 0,
                                            font: {
                                                size: 10
                                            }
                                        }
                                    }
                                }}
                            />
                        </Col>
                    )
                })
            })

        })


        return exp_plot
    }

    render() {
        return (
            <Row justify="space-around" align="middle">
                {this.state.loading ? <Spin size="large"/> : this.state.plots}
            </Row>
        )
    }

}

export default VisualizeSingleGroupPlot;