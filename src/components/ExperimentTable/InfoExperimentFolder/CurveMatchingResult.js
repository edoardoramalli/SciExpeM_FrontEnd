import React from "react";
import {Alert, Col, Empty, Spin, Table, Tabs} from "antd";


const axios = require('axios');
import Cookies from "js-cookie";
axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

const Plotly = require('plotly-latest')
import createPlotlyComponent from "react-plotly.js/factory";
const Plot = createPlotlyComponent(Plotly);

import {checkError} from "../../Tool";


class CurveMatchingResult extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            renderObjectPlot: <Col span={1} offset={11}><Spin size="large" tip="Loading..."/></Col>,
            loading: true,
            dataSource: [],
            dataSourceDetails: []
        }
    }

    componentDidMount() {
        const params = {'exp_id': [this.props.exp_id.toString()]}
        axios.post(window.$API_address + 'ExperimentManager/API/getCurveMatching', params)
            .then(res => {
                let x =[];
                let y = [];
                let y_error = [];
                res.data[0]['models'].map((item) => {
                    x.push(item['name'])
                    y.push(item['score'])
                    y_error.push(item['error'])
                })
                if (x.length !== 0){
                    let details = {}
                    res.data[0]['models'].map((item) =>{
                        details[item['name']] = item['details']
                    })
                    this.setState({
                        renderObjectPlot:
                            <Plot
                                data={[{type: 'bar', x: x, y: y, error_y: {type: 'data', array: y_error, visible: true}}]}
                                layout={{
                                    title: 'Curve Matching Score Vs. ChemModel',
                                    yaxis: {title: 'Curve Matching Score',}}}
                            />,
                        dataSource: res.data[0]['models'],
                        dataSourceDetails: details
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
        const common = [
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
            {
                title: 'd0L2',
                dataIndex: 'd0L2',
                key: 'd0L2',
                sorter: (a, b) => {
                    return a.id > b.id
                },
            },
            {
                title: 'd1L2',
                dataIndex: 'd1L2',
                key: 'd1L2',
                sorter: (a, b) => {
                    return a.id > b.id
                },
            },
            {
                title: 'd0Pe',
                dataIndex: 'd0Pe',
                key: 'd0Pe',
                sorter: (a, b) => {
                    return a.id > b.id
                },
            },
            {
                title: 'd1Pe',
                dataIndex: 'd1Pe',
                key: 'd1Pe',
                sorter: (a, b) => {
                    return a.id > b.id
                },
            },
            {
                title: 'shift',
                dataIndex: 'shift',
                key: 'shift',
                sorter: (a, b) => {
                    return a.id > b.id
                },
            },
        ]
        const columns = [
            {
                title: 'ChemModel',
                dataIndex: 'name',
                key: 'name',
                sorter: (a, b) => {
                    return a.id > b.id
                },
            },

        ].concat(common);
        const columns_details = [
            {
                title: 'Parameter',
                dataIndex: 'execution_column_name',
                key: 'execution_column_name',
                sorter: (a, b) => {
                    return a.id > b.id
                },
            },
        ].concat(common);
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
                        rowKey="name"
                        expandRowByClick={true}
                        expandedRowRender={record => {
                            return(
                            <Table
                                title={() =>
                                    <div style={{textAlign: 'center', fontWeight: 'bold', fontSize: 15}}>
                                        Details Curve Matching Score - {record.name}
                                    </div>}
                                bordered
                                columns={columns_details}
                                dataSource={this.state.dataSourceDetails[record.name]}
                            />)
                        }}
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