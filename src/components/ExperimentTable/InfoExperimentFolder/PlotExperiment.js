import React from "react";
import {Tabs, Alert} from "antd";

const axios = require('axios');
import Cookies from "js-cookie";
axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

const Plotly = require('plotly-latest')

import createPlotlyComponent from "react-plotly.js/factory";
const Plot = createPlotlyComponent(Plotly);
import {checkError} from "../../Tool"



class PlotExperiment extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            plotList: [],
            baseConfig: {width: 640, height: 480, showlegend: true, autosize: true, },
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
                        layout={{...this.state.baseConfig, ...value}}
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
                const result = res.data
                console.log('prima', result)
                // const edo = {'Data Group (dg2)': {'xaxis': {'title': 'distance [m] (lin)', 'linecolor': 'lightgrey', 'linewidth': 2, 'mirror': true}, 'yaxis': {'title': 'particle diameter [nm] (lin)', 'linecolor': 'lightgrey', 'linewidth': 2, 'mirror': true}}, 'Data Group (dg1)': {'xaxis': {'title': 'distance [m] (lin)', 'linecolor': 'lightgrey', 'linewidth': 2, 'mirror': true}, 'yaxis': {'title': 'soot volume fraction [unitless] (lin)', 'linecolor': 'lightgrey', 'linewidth': 2, 'mirror': true}}}
                const tabs =  this.renderTabs(result['info'], result['data'])
                // const tabs =  this.renderTabs(edo, result['data'])

                // console.log('dopo', result)
                // console.log('edooo', result['info'])
                // console.log('ellle', result)
                // console.log(res.data)
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