import React from "react";

import {Spin, Empty, Row} from "antd";


const Plotly = require('plotly-latest')

import createPlotlyComponent from "react-plotly.js/factory";

const axios = require('axios');
import Cookies from "js-cookie";
import {checkError} from "../Tool";

axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

const Plot = createPlotlyComponent(Plotly);


class WorldDiff extends React.Component {
    constructor() {
        super();

        this.state = {
            data: {},
            loading: false
        }
    }

    colorScale = [
        [0, "rgb(165,0,38)"],
        [0.1, "rgb(215,48,39)"],
        [0.2, "rgb(244,109,67)"],
        [0.3, "rgb(253,174,97)"],
        [0.4, "rgb(254,224,139)"],
        [0.5, "rgb(0,104,55)"],
        [0.6, "rgb(139,239,216)"],
        [0.7, "rgb(106,200,217)"],
        [0.8, "rgb(19,145,193)"],
        [0.9, "rgb(8,76,112)"],
        [1, "rgb(0,29,104)"]]

    componentDidMount() {
        if (this.props.modelA !== -1 && this.props.modelB !== -1) {
            this.setState({loading: true})
            axios.post(window.$API_address + 'frontend/API/getWorldDiff',
                {
                    'query': this.props.query,
                    'subject': this.props.subject,
                    'modelA': this.props.modelA,
                    'modelB': this.props.modelB,
                    'common_experiments': this.props.settings.common_experiments
                })

                .then(res => {
                    this.setState({data: JSON.parse(res.data), loading: false})
                })
                .catch(error => {
                    checkError(error)
                    this.setState({loading: false})
                })
        }
    }

    render() {
        let obj;

        if (this.state.data !== {} && this.state.data.x) {
            obj = <Plot
                data={[
                    {
                        type: 'scatter3d',
                        mode: 'markers',
                        name: '',
                        z: this.state.data.z,
                        x: this.state.data.x,
                        y: this.state.data.y,
                        colorscale: this.colorScale,
                        customdata: this.state.data.s,
                        marker: {
                            size:  this.state.data.s.map(i => this.props.settings.offset_size + i),
                            color: this.state.data.c,
                            colorscale: this.colorScale,
                            opacity: 0.5,
                            showscale: true,
                            cmax: this.props.settings.cmax_diff,
                            cmin: this.props.settings.cmin_diff,
                        },
                        hovertemplate: '(T: %{x}, P: %{y}, Phi: %{z}) <br> ' +
                            '#: %{customdata} - Diff: %{marker.color:.3f}'
                    },
                ]}
                layout={{
                    // autosize: true,
                    width: '100px',
                    margin: {l: 0, r: 0, b: 0, t: 0, pad: 0},
                    scene: {
                        xaxis: {title: 'Temperature [K]'},
                        yaxis: {title: 'Pressure [bar]'},
                        zaxis: {title: 'Phi'}
                    }
                }}
            />
        } else if (this.state.loading) {
            obj = <Spin size="large"/>
        } else {
            obj = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
        }

        return (
            <Row justify="space-around" align="middle">
                {obj}
            </Row>

        )
    }
}

export default WorldDiff;