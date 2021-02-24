import React from "react";
import {message, Alert} from "antd";

const axios = require('axios');

const Plotly = require('plotly-latest')

import createPlotlyComponent from "react-plotly.js/factory";
const Plot = createPlotlyComponent(Plotly);


class PlotExperiment extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            plotList: [],
            baseConfig: {width: 640, height: 480, showlegend: true, autosize: true},
            addConfig: {},
            renderObject: null
        }
    }

    extend(obj, src) {
        Object.keys(src).forEach(function(key) { obj[key] = src[key]; });
        return obj;
    }

    componentDidMount() {
        this.setState({loading: true});
        const params = {experiment: this.props.exp_id.toString()}
        axios.post(window.$API_address + 'frontend/API/getPlotExperiment', params)
            .then(res => {
                const result = JSON.parse(res.data)
                this.setState({
                    renderObject:
                        <Plot
                            data={result['data']}
                            layout={this.extend(this.state.baseConfig, result['info'])}
                        />
                })
            })
            .catch(error => {
                this.setState({
                    renderObject:
                        <Alert message="Experiment Plot is not supported yet." type="warning" />
                })
                if (error.response.status === 403){
                    message.error("You don't have the authorization!", 3);
                    this.setState({loading: false})
                }
                else if (error.response.status === 400){
                    message.error("Bad Request. " + error.response.data, 3);
                    this.setState({loading: false})
                }
                else{
                    message.error(error.response.data, 3);
                    this.setState({loading: false})
                }
            })
    }

    render() {
        return(this.state.renderObject)
    }

}

export default PlotExperiment;