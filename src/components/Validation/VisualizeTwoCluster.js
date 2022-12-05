import React from "react";
import {Table, Row, Col, Space, Typography} from "antd";
import {checkError, replaceValueDiz} from "../Tool";
import {element} from "prop-types";
import TabExperiment from "../ExperimentTable/InfoExperimentFolder/TabExperiment";
import ExperimentListTable from "./ExperimentListTable";

const {Text, Link} = Typography;

class VisualizeTwoCluster extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            modelA_result: [],
            modelB_result: [],

            loading: false,
            diff: {}
        }
    }

    transformListToDiz(list) {
        let tmp_A = {}
        list.forEach(element => {
            const subject = element.name
            tmp_A[subject] = {
                len: element.len,
                min: element.min,
                max: element.max, stdev: element.stdev,
                mean: element.mean, median: element.median,
                variance: element.variance, total: element.total
            }
        })
        return tmp_A
    }

    componentDidMount() {

        this.processCluster()

    }


    processCluster() {
        const queryA = replaceValueDiz(this.props.query, '$$$', this.props.modelA)
        const queryB = replaceValueDiz(this.props.query, '$$$', this.props.modelB)

        const current = this

        this.setState({loading: true})

        Promise.all([
            this.getCluster(queryA, this.props.subject, this.props.modelA, this.props.modelB),
            this.getCluster(queryB, this.props.subject, this.props.modelB, this.props.modelA)]).then(function (values) {

            const index_model_a = values[0]['chemModel_id'] === current.props.modelA ? 0 : 1

            const modelA_result = values[index_model_a].result
            const modelB_result = values[index_model_a === 1 ? 0 : 1].result


            if (modelA_result.length && modelB_result.length) {
                const dizA_result = current.transformListToDiz(modelA_result)
                const dizB_result = current.transformListToDiz(modelB_result)

                let result = {}
                Object.keys(dizA_result).forEach(function (subject) {
                    result[subject] = {}
                    Object.keys(dizA_result[subject]).forEach(function (score) {
                        const new_value = dizA_result[subject][score]
                        const old_value = dizB_result[subject][score]
                        result[subject][score] = (new_value - old_value) / old_value
                    })
                });

                current.setState({
                    diff: result,
                    modelA_result: modelA_result,
                    modelB_result: modelB_result,
                    loading: false
                })

            } else {
                current.setState({modelA_result: modelA_result, modelB_result: modelB_result, loading: false})
            }


        });
    }


    getCluster = (query, subject, chemModel_id, other_id) => {

        if (query !== undefined && chemModel_id !== undefined && chemModel_id !== -1) {
            let models = []
            if (this.props.settings.common_experiments){
                models = [chemModel_id, other_id]
            }
            return axios.post(window.$API_address + 'frontend/API/getCluster', {'query': query, 'subject': subject, 'models': models})
                .then(res => {
                    console.log(res.data)
                    return {'chemModel_id': chemModel_id, 'result': res.data}
                })
                .catch(error => {
                    checkError(error)
                    return {'chemModel_id': chemModel_id, 'result': []}
                })
        } else {
            return {'chemModel_id': chemModel_id, 'result': []}
        }

    }


    render() {
        const settings = this.props.settings
        const diff_obj = this.state.diff

        const modelA = this.props.modelA
        const modelB = this.props.modelB


        function renderValue(name, props, record) {
            if (props < settings.absolute_threshold) {
                return <Text type="danger">{props}</Text>
            } else if (!(diff_obj && Object.keys(diff_obj).length === 0 && Object.getPrototypeOf(diff_obj) === Object.prototype) && Math.abs(diff_obj[record.name][name]) > settings.relative_threshold) {
                return <Text type="warning">{props}</Text>
            } else {
                return <Text>{props}</Text>
            }
        }

        let columns_list = [{
            title: 'Cluster',
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
            render: (props, record) => <div style={{fontWeight: 800}}>{props} ({record['len']})</div>
        },
            {
                title: 'T[K]',
                dataIndex: 'T',
                key: 'T',
                fixed: 'left',
                render: (props, record) => <>({props[0].toFixed(0)}, {props[1].toFixed(0)})</>
            },
            {
                title: 'P[bar]',
                dataIndex: 'P',
                key: 'P',
                fixed: 'left',
                render: (props, record) => <>({props[0].toFixed(0)}, {props[1].toFixed(0)})</>
            },
            {
                title: 'Phi',
                dataIndex: 'phi',
                key: 'phi',
                fixed: 'left',
                render: (props, record) => <>({props[0].toFixed(0)}, {props[1].toFixed(0)})</>
            },
            {
                title: 'Mean',
                dataIndex: 'mean',
                key: 'mean',
                // render: (props, record) => {
                //     return renderValue('mean', props, record)
                // },
                sorter: (a, b) => a.mean > b.mean,
                defaultSortOrder: 'ascend'
            }, {
                title: 'Median',
                dataIndex: 'median',
                key: 'median',
                // render: (props, record) => {
                //     return renderValue('median', props, record)
                // },
                sorter: (a, b) => a > b,
            }, {
                title: 'Min',
                dataIndex: 'min',
                key: 'min',
                // render: (props, record) => {
                //     return this.renderValue('min', props, record)
                // },
                sorter: (a, b) => a > b,
            }, {
                title: 'Max',
                dataIndex: 'max',
                key: 'max',
                // render: (props, record) => {
                //     return this.renderValue('max', props, record)
                // },
                sorter: (a, b) => a > b,
            }, {
                title: 'Stdev',
                dataIndex: 'stdev',
                key: 'stdev',
                sorter: (a, b) => a > b,
            }, {
                title: 'Variance',
                dataIndex: 'variance',
                key: 'variance',
                sorter: (a, b) => a > b,
            }, ]

        return (
            <Row>
                <Col span={11}>
                    <Table
                        columns={columns_list}
                        dataSource={this.state.modelA_result}
                        bordered
                        size="small"
                        pagination={false}
                        loading={this.state.loading}
                        rowKey="name"
                        expandedRowRender={record => {
                            return <ExperimentListTable exp_list_id={record.list}/>
                        }}
                        // scroll={{x: 'calc(700px + 50%)'}}
                    />
                </Col>
                <Col span={2}>
                </Col>
                <Col span={11}>
                    <Table
                        columns={columns_list}
                        dataSource={this.state.modelB_result}
                        bordered
                        size="small"
                        pagination={false}
                        loading={this.state.loading}
                        rowKey="name"
                        expandedRowRender={record => {
                            return <ExperimentListTable exp_list_id={record.list}/>
                        }}
                        // scroll={{x: 'calc(700px + 50%)'}}
                    />
                </Col>
            </Row>

        )
    }
}

export default VisualizeTwoCluster;