import React from "react";
import {Table, Row, Col, Space, Typography} from "antd";
import {checkError, replaceValueDiz} from "../Tool";
import {element} from "prop-types";
import {stdev, mean, median, findVariance} from "../Tool";

const {Text, Link} = Typography;

class VisualizeTwoTable extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            modelA_result: [],
            modelB_result: [],
            modelA_discarded: null,
            modelB_discarded: null,

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

        this.processValidation()

    }



    processValidation() {
        const queryA = replaceValueDiz(this.props.query, '$$$', this.props.modelA)
        const queryB = replaceValueDiz(this.props.query, '$$$', this.props.modelB)

        const current = this

        this.setState({loading: true})

        Promise.all([
            this.getValidation(queryA, this.props.modelA, this.props.modelB),
            this.getValidation(queryB, this.props.modelB, this.props.modelA)]).then(function (values) {

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


                current.setState({diff: result,
                    modelA_result: modelA_result,
                    modelB_result: modelB_result,
                    modelA_discarded: values[index_model_a].discarded,
                    modelB_discarded: values[index_model_a === 1 ? 0 : 1].discarded,
                    loading: false})

            }
            else{
                current.setState({
                    modelA_result: modelA_result,
                    modelB_result: modelB_result,
                    modelA_discarded: values[index_model_a].discarded,
                    modelB_discarded: values[index_model_a === 1 ? 0 : 1].discarded,
                    loading: false})
            }




        });
    }

    parseValidation = (result, chemModel_id) =>{
        let discarded = []

        let tmp = {'score': [], 'd0L2':[], 'd1L2': [], 'd0Pe': [], 'd1Pe': [], 'shift': [], 'id': []}

        result[chemModel_id].forEach(cm=>{
            const score = cm.score
            const d0L2 = cm.d0L2
            const d1L2 = cm.d1L2
            const d0Pe = cm.d0Pe
            const d1Pe = cm.d1Pe
            const shift = cm.shift
            const id = cm.id

            if ([score, d0L2, d1L2, d0Pe, d1Pe, shift].filter(x => x > 0).length === 6){
                tmp.score.push(score)
                tmp.d0L2.push(d0L2)
                tmp.d1L2.push(d1L2)
                tmp.d0Pe.push(d0Pe)
                tmp.d1Pe.push(d1Pe)
                tmp.shift.push(shift)
                tmp.id.push(id)
            }
            else{
                discarded.push(cm.id)
            }
        })

        let final = []

        const unique = new Set(tmp.id)

        Object.keys(tmp).forEach(key =>{
            if (key!=='id'){
                const value = tmp[key]
                final.push(
                    {
                        'name': key,
                        'len': value.length,
                        'min': Math.min(...value),
                        'max': Math.max(...value),
                        'stdev': stdev(value),
                        'variance': findVariance(value),
                        'mean': mean(value),
                        'median': median(value),
                        'total': unique.size,
                    }
                )
            }

        })
        const dis = new Set(discarded)

        return [final, dis.size]
    }


    getValidation = (query, chemModel_id, other_id, ) => {

        if (query !== undefined && chemModel_id !== undefined && chemModel_id !== -1) {
            let models = []
            if (this.props.settings.common_experiments){
                models = [chemModel_id, other_id]
            }
            return axios.post(window.$API_address + 'frontend/API/getValidation', {'query': query, 'models': models})
                .then(res => {
                    const [result, discarded] = this.parseValidation(res.data, chemModel_id);
                    return {'chemModel_id': chemModel_id, 'result': result, 'discarded': discarded}
                })
                .catch(error => {
                    checkError(error)
                    return {'chemModel_id': chemModel_id, 'result': [], 'discarded': null}
                })
        } else {
            return {'chemModel_id': chemModel_id, 'result': [], 'discarded': null}
        }

    }


    render() {
        const settings = this.props.settings
        const diff_obj = this.state.diff

        const modelA = this.props.modelA
        const modelB = this.props.modelB


        function renderValue(name, props, record) {
            if (props < settings.absolute_threshold) {
                return <Text type="danger">{props.toPrecision(2)}</Text>
            } else if (!(diff_obj && Object.keys(diff_obj).length === 0 && Object.getPrototypeOf(diff_obj) === Object.prototype) && Math.abs(diff_obj[record.name][name]) > settings.relative_threshold) {
                return <Text type="warning">{props.toPrecision(2)}</Text>
            } else {
                return <Text>{props.toPrecision(2)}</Text>
            }
        }

        let columns_list = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
            render: (props, record) => <div style={{fontWeight: 800}}>{props}</div>
        }, {
            title: 'Mean',
            dataIndex: 'mean',
            key: 'mean',
            render: (props, record) => {
                return renderValue('mean', props, record)
            },
            sorter: (a, b) => a > b,
        }, {
            title: 'Median',
            dataIndex: 'median',
            key: 'median',
            render: (props, record) => {
                return renderValue('median', props, record)
            },
            sorter: (a, b) => a > b,
        }, {
            title: 'Min',
            dataIndex: 'min',
            key: 'min',
            // render: (props, record) => {
            //     return this.renderValue('min', props, record)
            // },
            sorter: (a, b) => a > b,
            render: (props, record) => props.toPrecision(2)
        }, {
            title: 'Max',
            dataIndex: 'max',
            key: 'max',
            // render: (props, record) => {
            //     return this.renderValue('max', props, record)
            // },
            sorter: (a, b) => a > b,
            render: (props, record) =>  props.toPrecision(2)
        }, {
            title: 'Stdev',
            dataIndex: 'stdev',
            key: 'stdev',
            sorter: (a, b) => a > b,
            render: (props, record) =>  props.toPrecision(2)
        }, {
            title: 'Variance',
            dataIndex: 'variance',
            key: 'variance',
            sorter: (a, b) => a > b,
            render: (props, record) =>  props.toPrecision(2)
        }, {

            title: 'Count',
            dataIndex: 'len',
            key: 'len',
            sorter: (a, b) => a > b,
            render: (props, record) => <>{props} ({record['total']})</>
        },]

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
                        // scroll={{x: 'calc(700px + 50%)'}}
                        summary={pageData => {
                            return (
                                <Table.Summary fixed>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell><div style={{fontWeight: 800}}>Discarded</div></Table.Summary.Cell>
                                        <Table.Summary.Cell>
                                            <Text type="warning">{this.state.modelA_discarded}</Text>
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                </Table.Summary>
                            );
                        }}
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
                        // scroll={{x: 'calc(700px + 50%)'}}
                        summary={pageData => {
                            return (
                                <Table.Summary fixed>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell><div style={{fontWeight: 800}}>Discarded</div></Table.Summary.Cell>
                                        <Table.Summary.Cell>
                                            <Text type="warning">{this.state.modelB_discarded}</Text>
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                </Table.Summary>
                            );
                        }}
                    />
                </Col>
            </Row>

        )
    }
}

export default VisualizeTwoTable;