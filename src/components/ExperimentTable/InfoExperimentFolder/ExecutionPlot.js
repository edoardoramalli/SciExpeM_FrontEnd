import React from "react";
import {Alert, Empty, Tabs} from "antd";

const axios = require('axios');
import Cookies from "js-cookie";
axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

const Plotly = require('plotly-latest')
import createPlotlyComponent from "react-plotly.js/factory";
import {checkError} from "../../Tool";
const Plot = createPlotlyComponent(Plotly);

class ExecutionPlot extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            baseConfig: {width: 640, height: 480, showlegend: true, autosize: true},
            renderObjectPlot: null,
        }
    }

    extend(obj, src) {
        Object.keys(src).forEach(function(key) { obj[key] = src[key]; });
        return obj;
    }

    renderTabs = (info, data) => {
        return (Object.entries(info).map(([key_y, value_y], index_y) => {
            return (Object.entries(info[key_y]).map(([key_x, value_x], index_x) => {
                return(
                    <Tabs.TabPane tab={key_x + ' Vs. ' + key_y} key={index_x + index_y}>
                        <Plot
                            data={data[key_y][key_x]}
                            layout={this.extend(this.state.baseConfig, info[key_y][key_x])}
                        />
                    </Tabs.TabPane>
                )
            }))
        }))
    }

    componentDidMount() {
        const params = {'e_id': this.props.id.toString()}
        axios.post(window.$API_address + this.props.api, params)
            .then(res => {
                const result = JSON.parse(res.data)
                if(Object.keys(result['info']).length === 0){
                    this.setState({renderObjectPlot: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />})
                }
                else {
                    const tabs = this.renderTabs(result['info'], result['data'])
                    this.setState({renderObjectPlot: <Tabs defaultActiveKey="1">{tabs}</Tabs>})
                }
            })
            .catch(error => {
                this.setState({
                    renderObjectPlot:
                        <Alert message="Experiment Plot is not supported yet." type="warning" />
                })
                checkError(error)
            })
    }

    render() {
        return(this.state.renderObjectPlot)
    }

}

export default ExecutionPlot;