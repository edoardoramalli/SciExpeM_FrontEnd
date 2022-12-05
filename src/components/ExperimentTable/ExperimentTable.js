import React from "react";

const axios = require('axios');
import Cookies from "js-cookie";
axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

// Local Import
import {checkError} from "../Tool"
import BaseTable from "./BaseTable";
import {Button, Col, Collapse, Form, message, Row, Select, Space, Input, InputNumber, Empty, Tabs, Alert} from "antd";
const { Panel } = Collapse
import MinMaxRangeFormItem from "../Shared/MinMaxRangeFormItem";
import Variables from "../Variables";

const {reactors, experimentTypeToReactor} = Variables


class ExperimentTable extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            experiments: [],
            loading: false,
            fuels: [],
            fuels_options: [],
            exp_type_options: this.createExperimentTypeOptions(),
            reactors_options: this.createReactorOptions(),
        }

    }

    onFinishFailed = ({values, errorFields}) => {

    };

    checkField(dict, name) {
        return dict ? (dict[name] ? dict[name] : undefined) : undefined
    }

    onFinish = values => {

        const params = {
            fields: ['id', 'reactor', 'experiment_type', 'username',
                'fileDOI', 'status', 'ignition_type', 'interpreter_name'],
            query: {
                'id': values.id ? parseInt(values.id) : undefined,
                'experiment_type': values.experiment_type,
                'reactor': values.reactor,
                'username__icontains': values.username !== '' ? values.username : undefined,
                'fuels__contained_by': values.fuels && values.fuels.length > 0 ? values.fuels : undefined,
                't_inf__gte': this.checkField(values.t_profile, 't_inf'),
                't_sup__lte': this.checkField(values.t_profile, 't_sup'),
                'p_inf__gte': this.checkField(values.p_profile, 'p_inf'),
                'p_sup__lte': this.checkField(values.p_profile, 'p_sup'),
                'phi_inf__gte': this.checkField(values.phi_profile, 'phi_inf'),
                'phi_sup__lte': this.checkField(values.phi_profile, 'phi_sup'),
                'file_paper__description__icontains': values.description !== '' ? values.description : undefined,
                'file_paper__author__icontains': values.author !== '' ? values.author : undefined,
                'file_paper__title__icontains': values.title !== '' ? values.title : undefined,
            },
            model_name: 'Experiment',
        }

        this.query(params)




    }
    last_ten = () =>{
        const params = {
            fields: ['id', 'reactor', 'experiment_type', 'username',
                'fileDOI', 'status', 'ignition_type', 'interpreter_name'],
            query: {},
            order_by: '-id',
            n_elements: 10,
            model_name: 'Experiment',
        }

        this.query(params)
    }

    query = (params) =>{
        this.setState({loading: true, experimentSelected: []})
        axios.post(window.$API_address + 'ExperimentManager/API/filterDataBase', params)
            .then(res => {
                message.success('Filter successful!');
                const experiments = res.data
                this.setState({
                    experiments: experiments,
                    loading: false,
                    experiments_managed: experiments.filter((exp) => exp.interpreter_name != null).length,
                    experiments_valid: experiments.filter((exp) => exp.status === "verified").length
                })
            })
            .catch(error => {
                this.setState({loading: false})
                checkError(error)
            })
    }

    // componentDidMount() {
    //
    //     const params = {
    //         fields: ['id', 'reactor', 'experiment_type', 'username',
    //             'fileDOI', 'status', 'ignition_type', 'interpreter_name'],
    //         args: {}
    //     }
    //     axios.post(window.$API_address + 'frontend/API/getExperimentList', params)
    //         .then(res => {
    //             const experiments = JSON.parse(res.data)
    //             this.setState(
    //                 {
    //                     experiments: experiments,
    //                     loading: false,
    //                     experiments_managed: experiments.filter((exp) => exp.interpreter_name != null).length,
    //                     experiments_valid: experiments.filter((exp) => exp.status === "verified").length
    //                 }
    //             )
    //         })
    //         .catch(error => {
    //             this.setState({loading: false})
    //             checkError(error)
    //         })
    //
    // }

    createExperimentTypeOptions() {
        return Object.keys(experimentTypeToReactor).map((key, index) => {
            return (<Select.Option key={key} value={key}>{key}</Select.Option>)
        })
    }

    createFuelsOptions(fuels) {
        return fuels.map(item => {
            return (<Select.Option key={item} value={item}>{item}</Select.Option>)
        })
    }

    createReactorOptions() {
        return reactors.map((item) => {
            return (<Select.Option value={item.toString()}>{item.toString()}</Select.Option>)
        })
    }

    componentDidMount() {
        axios.get(window.$API_address + 'frontend/api/opensmoke/fuels_names')
            .then(res => {
                this.setState({fuels: res.data.names, fuels_options: this.createFuelsOptions(res.data.names)});
            }).catch(error => {
            checkError(error)
        })

        // Development
        // const params = {
        //     fields: ['id', 'reactor', 'experiment_type', 'username',
        //         'fileDOI', 'status', 'ignition_type', 'interpreter_name'],
        //     query: {
        //         'id': 205
        //     },
        //     model_name: 'Experiment',
        // }
        // axios.post(window.$API_address + 'ExperimentManager/API/filterDataBase', params)
        //     .then(res => {
        //         message.success('Filter successful!');
        //         const experiments = res.data
        //         this.setState({
        //             experiments: experiments,
        //             loading: false,
        //             experiments_managed: experiments.filter((exp) => exp.interpreter_name != null).length,
        //             experiments_valid: experiments.filter((exp) => exp.status === "verified").length
        //         })
        //     })
        //     .catch(error => {
        //         this.setState({loading: false})
        //         checkError(error)
        //     })
    }


    render() {

        return (
            <Collapse style={{width: '100%'}} defaultActiveKey={['1']} destroyInactivePanel={true}>
                <Panel
                    header="Filter Experiment DataBase (All the conditions are in logic AND with each other, if the field is not empty)"
                    key="1">
                    <Form
                        onFinish={this.onFinish}
                        onFinishFailed={this.onFinishFailed}
                        layout="vertical"
                        autoComplete="off"
                    >
                        <Row>
                            <Space size={'large'}>
                                <Col>
                                    <Form.Item
                                        name={'id'}
                                        label={'ID:'}
                                        rules={[{required: false}]}
                                    >
                                        <InputNumber
                                            min={1} max={100000} allowClear placeholder={'ID'}
                                            type="number"
                                            step={1}
                                        />
                                    </Form.Item>

                                </Col>
                                <Col>
                                    <Form.Item
                                        name={'experiment_type'}
                                        label={'Experiment Type:'}
                                        rules={[{required: false}]}
                                    >
                                        <Select placeholder={'Please select an experiment type'}
                                                style={{width: 320}}
                                                allowClear
                                        >
                                            {this.state.exp_type_options}
                                        </Select>
                                    </Form.Item>

                                </Col>
                                <Col>
                                    <Form.Item
                                        name={'reactor'}
                                        label={'Reactor Type:'}
                                        rules={[{required: false}]}
                                    >
                                        <Select placeholder={'Please select a reactor'} allowClear style={{width: 200}}>
                                            {this.state.reactors_options}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col>
                                    <Form.Item
                                        name={'fuels'}
                                        label={'Fuels (In logic OR):'}
                                        rules={[{required: false}]}
                                    >
                                        <Select
                                            mode="multiple"
                                            placeholder="Please select fuels"
                                            style={{width: 300}}
                                            allowClear
                                        >
                                            {this.state.fuels_options}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col>
                                    <Form.Item
                                        name={'username'}
                                        label={'Username:'}
                                        rules={[{required: false}]}
                                    >

                                        <Input placeholder="Insert Username" allowClear style={{width: 320}}/>
                                    </Form.Item>
                                </Col>
                            </Space>
                        </Row>
                        <Row>
                            <Space size={'large'}>
                                <MinMaxRangeFormItem
                                    label={"Temperature Range (Min-Max) [K]"}
                                    require={false}
                                    groupName={'t_profile'}
                                    minName={'t_inf'}
                                    maxName={'t_sup'}
                                    min={250}
                                    max={3500}
                                    step={10}
                                />
                                <MinMaxRangeFormItem
                                    label={"Pressure Range (Min-Max) [bar]"}
                                    require={false}
                                    groupName={'p_profile'}
                                    minName={'p_inf'}
                                    maxName={'p_sup'}
                                    min={0}
                                    max={150}
                                    step={5}
                                />
                                <MinMaxRangeFormItem
                                    label={"Eq. Ratio Range (Min-Max) [phi = 100 (+inf)]"}
                                    require={false}
                                    groupName={'phi_profile'}
                                    minName={'phi_inf'}
                                    maxName={'phi_sup'}
                                    min={0}
                                    max={150}
                                    step={0.1}
                                />


                            </Space>

                        </Row>
                        <Row>
                            <Space>
                                <Form.Item
                                    name={'description'}
                                    label={'Description:'}
                                    rules={[{required: false}]}
                                >
                                    <Input placeholder="Insert description" allowClear style={{width: 300}}/>
                                </Form.Item>

                                <Form.Item
                                    name={'author'}
                                    label={'Author:'}
                                    rules={[{required: false}]}
                                >
                                    <Input placeholder="Insert author" allowClear style={{width: 300}}/>
                                </Form.Item>

                                <Form.Item
                                    name={'title'}
                                    label={'Title:'}
                                    rules={[{required: false}]}
                                >
                                    <Input placeholder="Insert title" allowClear style={{width: 300}}/>
                                </Form.Item>
                            </Space>
                        </Row>
                        <Form.Item>

                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{margin: "10px"}}
                                size={"large"}
                                loading={this.state.loading}
                            >
                                Filter DataBase
                            </Button>

                            <Button
                                style={{margin: "10px"}}
                                size={"large"}
                                loading={this.state.loading}
                                onClick={this.last_ten}
                            >
                                Last 10 Experiments
                            </Button>

                        </Form.Item>

                    </Form>
                </Panel>
                <Panel header="Result Table" key="2">
                    <BaseTable
                        header={true}
                        selectHook={undefined}
                        experiments_managed={this.state.experiments_managed}
                        experiments_valid={this.state.experiments_valid}
                        experiments={this.state.experiments}
                        loading={this.state.loading}
                        excludedColumns={[]}
                    />
                </Panel>
            </Collapse>

        )
    }
}

export default ExperimentTable;