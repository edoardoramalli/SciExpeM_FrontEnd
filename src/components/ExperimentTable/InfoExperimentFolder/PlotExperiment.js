import React from "react";
import {Tabs, Alert, Descriptions} from "antd";

const axios = require('axios');

const Plotly = require('plotly-latest')

import createPlotlyComponent from "react-plotly.js/factory";
const Plot = createPlotlyComponent(Plotly);
import {checkError} from "../../Tool"



class PlotExperiment extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            plotList: [],
            baseConfig: {width: 640, height: 480, showlegend: true, autosize: true},
            addConfig: {},
            renderObject: null,
            tabs: null
        }
    }

    extend(obj, src) {
        Object.keys(src).forEach(function(key) { obj[key] = src[key]; });
        return obj;
    }

    renderTabs = (info, data) => {
        return (Object.entries(info).map(([key, value], index) => {
            return(
                <Tabs.TabPane tab={key} key={index}>
                    <Plot
                        data={data[key]}
                        layout={this.extend(this.state.baseConfig, value)}
                    />
                </Tabs.TabPane>
            )
        }))

    }

    componentDidMount() {
        this.setState({loading: true});
        const params = {exp_id: this.props.exp_id.toString()}
        axios.post(window.$API_address + 'frontend/API/getPlotExperiment', params)
            .then(res => {
                const result = JSON.parse(res.data)
                const tabs =  this.renderTabs(result['info'], result['data'])
                this.setState({
                    renderObject:
                        <Tabs defaultActiveKey="1">
                            {tabs}
                        </Tabs>
                })
            })
            .catch(error => {
                this.setState({
                    renderObject:
                        <Alert message="Experiment Plot is not supported yet." type="warning" />
                })
                checkError(error)
            })
    }

    render() {
        return(this.state.renderObject)
    }

}

export default PlotExperiment;