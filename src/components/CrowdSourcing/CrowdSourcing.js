import React from "react";

const axios = require('axios');
import Cookies from "js-cookie";
import {
    Alert,
    Tabs,
    Statistic,
    Row,
    Col,
    Checkbox,
    Divider,
    Radio,
    Form,
    Space,
    Input,
    Button,
    message,
    Rate, Spin
} from "antd";

import {StepForwardOutlined} from '@ant-design/icons';


import {checkError} from "../Tool";

axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

const Plotly = require('plotly-latest')

import createPlotlyComponent from "react-plotly.js/factory";

const Plot = createPlotlyComponent(Plotly);

class CrowdSourcing extends React.Component {
    formRef = React.createRef();


    constructor(props) {
        super(props);
        this.state = {
            tabs: undefined,
            total: 0,
            remaining: 0,
            experiment_id: undefined,
            choices: undefined,
            submitLoading: false,
            renderObject: <Col span={1} offset={11}><Spin size="large" tip="Loading..."/></Col>,
        }
    }

    extend(obj, src) {
        Object.keys(src).forEach(function (key) {
            obj[key] = src[key];
        });
        return obj;
    }

    onFinish = (values) => {

        this.setState({submitLoading: true})

        Object.keys(values).forEach((key) => {
            values[key]['choices'] = this.state.choices[key]
            const models1 = values[key].best_models
            if (models1.includes(-1)  && models1.length > 1){
                message.error("'No One' cannot be with another model.")
                return

            }
            if(models1.includes(-1)){
                values[key].best_models = undefined
            }


            const models2 = values[key].wrong_models
            if (models2.includes(-1)  && models2.length > 1){
                message.error("'No One' cannot be with another model.")
                return
            }

            if(models2.includes(-1)){
                values[key].wrong_models = []
            }
        })


        const params = {
            'answer': values,
            'experiment_id': this.state.experiment_id,
        }
        axios.post(window.$API_address + 'CrowdSourcing/API/saveQuestionResult', params)
            .then(res => {
                this.setState({submitLoading: false})
                this.formRef.current.resetFields();
                this.loadNextQuestion()
                message.success("Task completed successfully", 3)

            })
            .catch(error => {
                checkError(error)
                this.setState({submitLoading: false})
            })
    }

    onFinishFailed = ({values, errorFields}) => {
        const reducer = (accumulator, currentValue) => accumulator + " " + currentValue.errors;
        const errors = errorFields.reduce(reducer, "")
        message.error("There are some errors in the form! " + errors, 5)
    }


    createTab = (y_exp_id, name, y_element, model_options) => {
        let plots = [y_element['plot']]


        y_element['models'].forEach((model) => {
            plots.push(model['plot'])
        })

        let options = [{label: 'No One', value: -1}].concat(model_options);


        return <>

            <Divider style={{fontSize: 25, fontWeight: 700}}>{name}</Divider>
            <Row>
                <Space size={'large'}>
                    <Col>
                        <Plot
                            data={plots}
                            layout={this.extend({
                                width: 640,
                                height: 480,
                                showlegend: true,
                                autosize: true
                            }, y_element['layout'])}
                        />
                    </Col>
                    <Col>
                        <Divider style={{color: 'red'}}>Q1. Which is the best Model?</Divider>
                        <Form.Item
                            name={[y_exp_id, "best_models"]}
                            rules={[{required: true, message: name + ': Please select the best model.'}]}
                        >

                            <Checkbox.Group options={options}/>
                        </Form.Item>
                        <Divider style={{color: 'red'}}>Q2. Which is the level of noise of the experimental data
                            ?</Divider>

                        <Form.Item
                            name={[y_exp_id, "noise_level"]}
                            rules={[{required: true, message: name + ': Please select the noise level.'}]}
                        >
                            <Row>
                                <Space size={'large'}>
                                    No Noise
                                    <Radio.Group>
                                        <Radio value={1}>1</Radio>
                                        <Radio value={2}>2</Radio>
                                        <Radio value={3}>3</Radio>
                                        <Radio value={4}>4</Radio>
                                        <Radio value={5}>5</Radio>
                                    </Radio.Group>
                                    Very Noisy
                                </Space>
                            </Row>
                        </Form.Item>

                        <Divider style={{color: 'red'}}>Q3. Is there a model clearly wrong?</Divider>

                        <Form.Item
                            name={[y_exp_id, "wrong_models"]}
                            rules={[{required: true, message: name + ': Please select a clearly wrong model.'}]}
                        >
                            {/*<Radio.Group>*/}
                            {/*    <Radio value={1}>Not Noisy</Radio>*/}
                            {/*    <Radio value={3}>Noisy</Radio>*/}
                            {/*    <Radio value={5}>Very Noisy</Radio>*/}
                            {/*</Radio.Group>*/}
                            <Checkbox.Group options={options}/>
                        </Form.Item>

                    </Col>
                </Space>

            </Row>


        </>
    }

    loadNextQuestion(){
        const params = {}
        axios.post(window.$API_address + 'CrowdSourcing/API/getNextQuestion', params)
            .then(res => {


                const remaining = res.data.remaining

                if (remaining > 0){



                    let result = []
                    let choices = {}


                    for (const [key, value] of Object.entries(res.data.data)) {
                        let model_options = []
                        choices[key] = []
                        value.models.forEach((model) => {
                            model_options.push({label:model.fake_name, value:model.y_execution_column_id})
                            choices[key].push(model.y_execution_column_id)
                        })
                        result.push(this.createTab(key, value.y_exp_name, value, model_options))
                    }

                    const object = <>
                        <Row>
                            <Col offset={9}>
                                <Statistic title="Remaining Tasks:" value={remaining} style={{textAlign: 'center'}}/>
                            </Col>
                        </Row>
                        <Row style={{width: '100%'}}>
                            <Form
                                onFinish={this.onFinish}
                                onFinishFailed={this.onFinishFailed}
                                layout="vertical"
                                autoComplete="off"
                                ref={this.formRef}
                            >

                                {result}
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    style={{margin: "10px"}}
                                    size={"large"}
                                    loading={this.state.submitLoading}
                                    icon={<StepForwardOutlined />}
                                >
                                    Submit
                                </Button>
                            </Form>
                        </Row>


                    </>


                    this.setState({
                        experiment_id: res.data.experiment_id,
                        choices: choices,
                        renderObject: object,
                    })
                }
                else{
                    const object = <Alert
                        message="All the task are completed! "
                        description={<><br/> Thank you for your time. See you next time!</>}
                        type="success"
                        showIcon
                    />
                    this.setState({renderObject: object})
                }


            })
            .catch(error => {
                this.setState({
                    renderObject:
                        <Alert message="Something went wrong!" type="warning"/>
                })
                checkError(error)
            })
    }

    componentDidMount() {
        this.loadNextQuestion()
    }

    render() {
        return (
            <>{this.state.renderObject}</>
        )
    }

}

export default CrowdSourcing