import React from "react";
import {Alert, Col, Empty, Spin, Table, Tabs} from "antd";


const axios = require('axios');
import Cookies from "js-cookie";
axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

const Plotly = require('plotly-latest')
import createPlotlyComponent from "react-plotly.js/factory";
import {checkError} from "../../Tool";
const Plot = createPlotlyComponent(Plotly);

class CurveMatchingResult extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            renderObjectPlot: <Col span={1} offset={11}><Spin size="large" tip="Loading..."/></Col>,
            loading: true,
            dataSource: []
        }
    }

    componentDidMount() {
        const params = {'exp_id': [this.props.exp_id.toString()]}
        axios.post(window.$API_address + 'ExperimentManager/API/getCurveMatching', params)
            .then(res => {
                let x =[];
                let y = [];
                let y_error = [];
                console.log(res)
                res.data[0]['models'].map((item) => {
                    x.push(item['name'])
                    y.push(item['score'])
                    y_error.push(item['error'])
                })
                if (x.length !== 0){
                    this.setState({
                        renderObjectPlot:
                            <Plot
                                data={[{type: 'bar', x: x, y: y, error_y: {type: 'data', array: y_error, visible: true}}]}
                                layout={{
                                    title: 'Curve Matching Score Vs. ChemModel',
                                    yaxis: {title: 'Curve Matching Score',}}}
                            />,
                        dataSource: res.data[0]['models']
                    })
                }
                else{
                    this.setState({
                        renderObjectPlot: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>,
                    })
                }
            })
            .catch(error => {
                this.setState({
                    renderObjectPlot: <Alert message="Bar Plot is not supported yet." type="warning" />
                })
                checkError(error)
            })
        this.setState({loading: false})
    }

    render() {
        const columns = [
            {
                title: 'ChemModel',
                dataIndex: 'name',
                key: 'name',
                sorter: (a, b) => {
                    return a.id > b.id
                },
            },
            {
                title: 'Score',
                dataIndex: 'score',
                key: 'score',
                sorter: (a, b) => {
                    return a.id > b.id
                },
            },
            {
                title: 'Error',
                dataIndex: 'error',
                key: 'error',
                sorter: (a, b) => {
                    return a.id > b.id
                },
            },
        ];
        return(
            <Tabs tabPosition={'left'}>
                <Tabs.TabPane tab="Raw Data" key="1">
                    <Table
                        title={() => <div style={{textAlign: 'center',
                            fontWeight: 'bold', fontSize: 15}}>Curve Matching Score</div>}
                        bordered
                        dataSource={this.state.dataSource}
                        columns={columns}
                        loading={this.state.loading}
                    />

                </Tabs.TabPane>
                <Tabs.TabPane tab="Bar Plot" key="2">
                    {this.state.renderObjectPlot}
                </Tabs.TabPane>
            </Tabs>
        )
    }
}

export default CurveMatchingResult;