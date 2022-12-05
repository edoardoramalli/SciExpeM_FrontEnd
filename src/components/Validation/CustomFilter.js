import React from "react";

import {Button, Col, Row, Select, Space, Form, Collapse, message, Input} from "antd";


import MinMaxRangeFormItem from "../Shared/MinMaxRangeFormItem";
import Variables from "../Variables";

const {reactors, experimentTypeToReactor} = Variables

import QueryVisualizer from "./QueryVisualizer";
import VisualizeTwoIntervalAnalysis from "./VisualizeTwoIntervalAnalysis";
import VisualizeTwoGroupPlot from "./VisualizeTwoGroupPlot";
import VisualizeTwoParityPlot from "./VisualizeTwoParityPlot";

const {Panel} = Collapse;

class CustomFilter extends React.Component {
    constructor() {
        super();
        this.state = {
            mountKey: Math.random(),
            reactors_options: this.createReactorOptions(),
            exp_type_options: this.createExperimentTypeOptions(),
            query: null,
        }
    }

    onFinishFailed = ({values, errorFields}) => {

    };

    checkField(dict, name) {
        return dict ? (dict[name] ? dict[name] : undefined) : undefined
    }


    onFinish = values => {
        message.success('Filter request sent!')
        const diz = {
            'execution_column__execution__experiment__t_inf__gte': this.checkField(values.t_profile, 't_inf'),
            'execution_column__execution__experiment__t_sup__lte': this.checkField(values.t_profile, 't_sup'),
            'execution_column__execution__experiment__p_inf__gte': this.checkField(values.p_profile, 'p_inf'),
            'execution_column__execution__experiment__p_sup__lte': this.checkField(values.p_profile, 'p_sup'),
            'execution_column__execution__experiment__phi_inf__gte': this.checkField(values.phi_profile, 'phi_inf'),
            'execution_column__execution__experiment__phi_sup__lte': this.checkField(values.phi_profile, 'phi_sup'),
            'execution_column__execution__experiment__experiment_type': values.experiment_type,
            'execution_column__execution__experiment__reactor': values.reactor,
            'execution_column__execution__experiment__file_paper__description__icontains': values.description !== '' ? values.description : undefined,
            'execution_column__label': this.props.target,
            ...this.props.query
        }

        this.setState({query: diz, mountKey: Math.random(),})

    }

    createExperimentTypeOptions() {
        return Object.keys(experimentTypeToReactor).map((key, index) => {
            return (<Select.Option key={key} value={key}>{key}</Select.Option>)
        })
    }

    createReactorOptions() {
        return reactors.map((item) => {
            return (<Select.Option value={item.toString()}>{item.toString()}</Select.Option>)
        })
    }

    render() {
        let obj;
        const {mountKey} = this.state;
        if (this.state.query) {
            obj = <QueryVisualizer {...this.props} key={mountKey} query={this.state.query} additional={
                <>
                    <Panel header={"Interval Analysis"} key="2E">
                        <VisualizeTwoIntervalAnalysis  {...this.props} query={this.state.query}/>
                    </Panel>
                    {this.props.target !== undefined ?
                        <>
                            <Panel header={"Plots"} key="2F">
                                <VisualizeTwoGroupPlot  {...this.props} query={this.state.query} target={this.props.target}/>
                            </Panel>
                            <Panel header={"Parity Plots"} key="2G">
                                <VisualizeTwoParityPlot  {...this.props} query={this.state.query} target={this.props.target}/>
                            </Panel>
                        </>
                        :
                        <></>
                    }

                </>
            }/>
        } else {
            obj = null
        }
        return (
            <Col span={24}>
                <Row>
                    <Form
                        onFinish={this.onFinish}
                        onFinishFailed={this.onFinishFailed}
                        autoComplete="off"
                    >
                        <Row>
                            <Space>
                                <Col>
                                    <Form.Item
                                        name={'experiment_type'}
                                        label={'Experiment Type:'}
                                        rules={[{required: false}]}
                                    >
                                        <Select allowClear placeholder={'Please select an experiment type'}
                                                style={{width: 320}}>
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
                                        <Select allowClear placeholder={'Please select a reactor'} style={{width: 200}}>
                                            {this.state.reactors_options}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col>
                                    <Form.Item
                                        name={'description'}
                                        label={'Author:'}
                                        rules={[{required: false}]}
                                    >
                                        <Input placeholder="Insert author" allowClear style={{width: 300}}/>
                                    </Form.Item>
                                </Col>
                            </Space>
                        </Row>
                        <Row>
                            <Space>
                                <Col>
                                    <MinMaxRangeFormItem
                                        label={"Temperature [K]"}
                                        require={false}
                                        groupName={'t_profile'}
                                        minName={'t_inf'}
                                        maxName={'t_sup'}
                                        min={250}
                                        max={3500}
                                        step={10}
                                    />
                                </Col>
                                <Col>
                                    <MinMaxRangeFormItem
                                        label={"Pressure [bar]"}
                                        require={false}
                                        groupName={'p_profile'}
                                        minName={'p_inf'}
                                        maxName={'p_sup'}
                                        min={0}
                                        max={150}
                                        step={5}
                                    />
                                </Col>
                                <Col>
                                    <MinMaxRangeFormItem
                                        label={"Equivalent Ratio [phi = 100 (+inf)]"}
                                        require={false}
                                        groupName={'phi_profile'}
                                        minName={'phi_inf'}
                                        maxName={'phi_sup'}
                                        min={0}
                                        max={150}
                                        step={0.1}
                                    />
                                </Col>
                            </Space>
                        </Row>
                        <Row>
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
                            </Form.Item>
                        </Row>
                    </Form>

                </Row>
                <Row>
                    <Col span={24}>
                        {obj}
                    </Col>
                </Row>
            </Col>
        )
    }
}

export default CustomFilter;