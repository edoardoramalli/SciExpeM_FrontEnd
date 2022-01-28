import React from "react";

const axios = require('axios');
import Cookies from "js-cookie";
import {checkError, replaceValueDiz} from "../Tool";

const Plotly = require('plotly-latest')

import createPlotlyComponent from "react-plotly.js/factory";
import {Row, Col, Typography, Select, Divider, Tabs, Table} from "antd";
import World from "./World";
import Parallel from "./Parallel";

const Plot = createPlotlyComponent(Plotly);

axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

class VisualizeTwoParallelPlot extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            modelA_result: {},
            modelB_result: {},
            loading: false,
            active_dimensions: Object.keys(this.props.support),
            active_targets: [-1],
            targets: [],
            removed_targets: []
        }


    }

    componentDidMount() {
        this.processParallel()
    }


    processParallel() {
        const current = this

        const __targets = new Set()

        this.setState({loading: true})

        Promise.all([
            this.getParallelPlot(this.props.modelA),
            this.getParallelPlot(this.props.modelB)]).then(function (values) {

            const index_model_a = values[0]['chemModel_id'] === current.props.modelA ? 0 : 1

            const modelA_result = values[index_model_a].result
            const modelB_result = values[index_model_a === 1 ? 0 : 1].result

            if (modelA_result.length > 0) {
                modelA_result.forEach(e => {
                    if(Object.keys(e).includes('execution_column__label')){
                        __targets.add(e['execution_column__label'])
                    }
                })
            }
            if (modelB_result.length > 0) {
                modelB_result.forEach(e => {
                    if(Object.keys(e).includes('execution_column__label')){
                        __targets.add(e['execution_column__label'])
                    }
                })
            }

            current.setState({modelA_result: modelA_result, modelB_result: modelB_result,
                loading: false, targets: Array.from(__targets), active_targets: Array.from(__targets)})


        });
    }

    getParallelPlot = (chemModel_id) => {

        if (chemModel_id !== undefined && chemModel_id !== -1) {
            return axios.post(window.$API_address + 'frontend/API/getDataFrameExecution',
                {
                    chemModel_id: chemModel_id,
                    attributes: ['score', 'd0L2', 'd1L2', 'd0Pe', 'd1Pe', 'shift',
                        'execution_column__label',
                        'execution_column__execution__experiment__id',
                        'execution_column__execution__experiment__fuels',
                        'execution_column__execution__experiment__reactor',
                        'execution_column__execution__experiment__file_paper__year',
                        'execution_column__execution__experiment__t_inf', 'execution_column__execution__experiment__t_sup',
                        'execution_column__execution__experiment__p_inf', 'execution_column__execution__experiment__p_sup',
                        'execution_column__execution__experiment__phi_inf', 'execution_column__execution__experiment__phi_sup']
                })
                .then(res => {
                    return {'chemModel_id': chemModel_id, 'result': res.data}

                }).catch(error => {
                    checkError(error)
                    return {'chemModel_id': chemModel_id, 'result': []}
                })
        } else {
            return {'chemModel_id': chemModel_id, 'result': []}
        }

    }

    handleSelect = (e) => {
        let tmp = []
        Object.keys(this.props.support).forEach((d) => {
            if (e.includes(d)) {
                tmp.push(d)
            }
        })
        this.setState({active_dimensions: tmp})
    }

    handleSelectTarget = (e) => {

        const removed = this.state.targets.map((t) => {
            if (!e.includes(t)) {
                return t
            }
        })


        this.setState({active_targets: e, removed_targets: removed})


        // const current_dim = this.filterTarget(this.state.original_dimensions, e)
        // this.setState({dimensions: current_dim, active_targets: e})
    }


    render() {

        const common_props = {
            settings: this.props.settings,
            loading: this.state.loading,
            active_dimensions: this.state.active_dimensions,
            removed_targets: this.state.removed_targets,
            support: JSON.parse(JSON.stringify(this.props.support)),
            ofInterest: JSON.parse(JSON.stringify(this.props.ofInterest))
        }

        const columns = [
            {
                title: 'id',
                dataIndex: 'execution_column__execution__experiment__id',
                sorter: (a, b) => a.execution_column__execution__experiment__id - b.execution_column__execution__experiment__id,
            },
            {
                title: 't_inf',
                dataIndex: 'execution_column__execution__experiment__t_inf',
                sorter: (a, b) => a.execution_column__execution__experiment__t_inf - b.execution_column__execution__experiment__t_inf,
            },
            {
                title: 't_sup',
                dataIndex: 'execution_column__execution__experiment__t_sup',
                sorter: (a, b) => a.execution_column__execution__experiment__t_sup - b.execution_column__execution__experiment__t_sup,

            },
            {
                title: 'p_inf',
                dataIndex: 'execution_column__execution__experiment__p_inf',
                sorter: (a, b) => a.execution_column__execution__experiment__p_inf - b.execution_column__execution__experiment__p_inf,

            },
            {
                title: 'p_sup',
                dataIndex: 'execution_column__execution__experiment__p_sup',
                sorter: (a, b) => a.execution_column__execution__experiment__p_sup - b.execution_column__execution__experiment__p_sup,

            },
            {
                title: 'phi_inf',
                dataIndex: 'execution_column__execution__experiment__phi_inf',
                sorter: (a, b) => a.execution_column__execution__experiment__phi_inf - b.execution_column__execution__experiment__phi_inf,

            },
            {
                title: 'phi_sup',
                dataIndex: 'execution_column__execution__experiment__phi_sup',
                sorter: (a, b) => a.execution_column__execution__experiment__id - b.execution_column__execution__experiment__id,

            },
            {
                title: 'reactor',
                dataIndex: 'execution_column__execution__experiment__reactor',

            },
            {
                title: 'Fuels',
                dataIndex: 'execution_column__execution__experiment__fuels',

            },
            {
                title: 'd0L2',
                dataIndex: 'd0L2',
                sorter: (a, b) => a.d0L2 - b.d0L2,

            },
            {
                title: 'd1L2',
                dataIndex: 'd1L2',
                sorter: (a, b) => a.d1L2 - b.d1L2,

            },
            {
                title: 'd0Pe',
                dataIndex: 'd0Pe',
                sorter: (a, b) => a.d0Pe - b.d0Pe,

            },{
                title: 'd1Pe',
                dataIndex: 'd1Pe',
                sorter: (a, b) => a.d1Pe - b.d1Pe,

            },
            {
                title: 'shift',
                dataIndex: 'shift',
                sorter: (a, b) => a.shift - b.shift,

            },
            {
                title: 'score',
                dataIndex: 'score',
                sorter: (a, b) => a.score - b.score,

            },


        ];

        return (
            <Tabs tabPosition={'top'} centered >
                <Tabs.TabPane tab="Plot" key="Plot">
                    <Row justify="space-around" align="middle">
                        <Col span={11}>
                            <Divider>Dimensions</Divider>
                            <Select
                                mode="multiple"
                                allowClear
                                style={{minWidth: '35vw'}}
                                placeholder="Please select"
                                defaultValue={Object.keys(this.props.ofInterest).map(e => this.props.ofInterest[e]['name'])}
                                onChange={this.handleSelect}
                            >
                                {Object.keys(this.props.ofInterest).map(e => <Select.Option
                                    key={this.props.ofInterest[e]['name']}>{this.props.ofInterest[e]['name']}</Select.Option>)}
                            </Select>
                        </Col>
                        <Col span={2}>

                        </Col>
                        <Col span={11}>
                            <Divider>Targets</Divider>
                            <Select
                                mode="multiple"
                                allowClear
                                style={{minWidth: '35vw'}}
                                placeholder="Please select"
                                value={this.state.active_targets}
                                onChange={this.handleSelectTarget}
                            >
                                {this.state.targets.map(e => <Select.Option key={e}>{e}</Select.Option>)}
                            </Select>
                        </Col>
                    </Row>
                    <Divider></Divider>
                    <Row justify="space-around" align="middle">
                        <Typography.Title
                            level={4}>{this.props.mapping_modelName.hasOwnProperty(this.props.modelA) ? this.props.mapping_modelName[this.props.modelA] : 'Model A'}</Typography.Title>
                    </Row>
                    <Row justify="space-around" align="middle">
                        <Parallel data={this.state.modelA_result} {...common_props}/>
                    </Row>
                    <Row justify="space-around" align="middle">
                        <Typography.Title
                            level={4}>{this.props.mapping_modelName.hasOwnProperty(this.props.modelB) ? this.props.mapping_modelName[this.props.modelB] : 'Model B'}</Typography.Title>
                    </Row>
                    <Row justify="space-around" align="middle">
                        <Parallel data={this.state.modelB_result} {...common_props}/>
                    </Row>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Table" key="Table">
                    <Table
                        dataSource={this.state.modelA_result}
                        columns={columns}
                        rowKey="id"
                        // scroll={{x: total_width}}
                        size='small'
                        pagination={true}
                        bordered
                    />
                </Tabs.TabPane>
            </Tabs>
        )
    }

}

export default VisualizeTwoParallelPlot;