// Built-in import
import React from "react";

// Third-parties import
import {Form, Button, Collapse, Space, message, Select} from "antd"
import axios from "axios";
import Cookies from "js-cookie";

// Local import
import ExperimentType from "./InputForm/ExperimentType";
import ReactorType from "./InputForm/ReactorType";
import InitialSpecies from "./InputForm/InitialSpecies";
import CommonProperty from "./InputForm/CommonProperty";
import UploadExperimentData from "./InputForm/UploadExperimentData";
import HelpGuide from "./InputForm/HelpGuide";
import References from "./InputForm/References";
import IgnitionDefinition from "./InputForm/IgnitionDefinition";
import Characteristics from "./InputForm/Characteristics";


const csrftoken = Cookies.get('csrftoken');
axios.defaults.headers.post['X-CSRFToken'] = csrftoken;




class ExperimentForm extends React.Component {
    formRef = React.createRef();

    constructor() {
        super();
        this.onFinish = this.onFinish.bind(this)
        this.state ={
            reactor_inactive: true,
            idt: false,
            rcm: false,
            base_active: ['1', '2', '3', '4', '7', '8', '9'],
            active_key: ['1', '2', '3', '4', '7', '8', '9'],
            reactor_value: null
        }
        this.handleExperimentType = this.handleExperimentType.bind(this);
        this.handleReactorType = this.handleReactorType.bind(this);
    }


    onFinishFailed = errorInfo => {
        const reducer = (accumulator, currentValue) => accumulator + " " + currentValue.errors;
        const errors = errorInfo.errorFields.reduce(reducer, "")
        message.error("There are some errors in the form! " + errors, 3)

    };

    onFinish = values => {
        axios.post(window.$API_address + 'frontend/input/submit', {params: {"values": values}})
            .then(() => {
                message.success('Experiment added successfully', 3);
                this.formRef.current.resetFields();
            })
            .catch(error => {
                message.error(error.response.data, 3)
            })
    }

    handleKey = () => {
        this.setState({
            active_key: this.state.base_active
        })
        if (this.state.idt){
            this.setState({
                active_key: this.state.base_active.concat(['6'])
            })
        }
        if (this.state.idt && this.state.rcm){
            this.setState({
                active_key: this.state.base_active.concat(['5', '6'])
            })
        }


    }

    handleReactorType = (reactorType) => {
        this.setState({
            reactor_value: reactorType,
            rcm: reactorType === 'rapid compression machine'
        },() => {
            this.handleKey()
        });
    }

    handleExperimentType = (experimentType) => {
        this.setState(
            {
                idt: false,
                rcm: false,
                reactor_value: undefined
            }
        )

        axios.post(window.$API_address + 'ReSpecTh/API/getReactors', {'experiment_type': [experimentType]})
            .then((res) => {
                const reactor_type_list = res.data;
                let options = reactor_type_list.map((item) => {
                    return(
                        <Select.Option value={item} style={{"textTransform": "capitalize"}}>{item}</Select.Option>
                    )
                });
                this.setState({
                    reactor_inactive: false,
                    reactor_list: options
                })
                if (experimentType === 'ignition delay measurement'){
                    this.setState({idt: true}, () =>{this.handleKey()})
                }
                this.handleKey()

            })
            .catch(error => {
                if (error.response.status === 403){
                    message.error("You don't have the authorization!", 3);
                }
                else if (error.response.status === 400){
                    message.error("Bad Request. " + error.response.data, 3);
                }
                else{
                    message.error(error.response.data, 3);
                }
            })

    }

    render() {

        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                sm: {span: 20, offset: 0},
            },
        };

        let props_reactor = {
            'reactor_inactive': this.state.reactor_inactive,
            'reactor_list': this.state.reactor_list,
            'reactor_value': this.state.reactor_value,
            'handleReactorType': this.handleReactorType
        }

        return (
            <Form
                onFinish={this.onFinish}
                onFinishFailed={this.onFinishFailed}
                layout="vertical"
                autoComplete="off"
                ref={this.formRef}
            >
                <Collapse activeKey={this.state.active_key}>
                    <Collapse.Panel header="General" key="1">
                        <ExperimentType handleExperimentType={this.handleExperimentType}/>
                        <ReactorType {...props_reactor}/>
                    </Collapse.Panel>
                    <Collapse.Panel header="Common Properties" key="2">
                        <CommonProperty/>
                    </Collapse.Panel>
                    <Collapse.Panel header="Initial Species" key="3">
                        <InitialSpecies/>
                    </Collapse.Panel>
                    <Collapse.Panel header="Varied experimental conditions and measured results" key="4">
                        <Space style={{display: 'flex'}} align="baseline">
                            <UploadExperimentData
                                name={"experimental_data"}
                                type={"data"}
                                api={'frontend/input/data_excel'}
                                ext={".xlsx"}
                                required={true}
                            />
                            <HelpGuide/>
                        </Space>
                    </Collapse.Panel>
                    <Collapse.Panel header="Volume-time profile (Only for 'Rapid Compression Machine')" key="5"
                                    disabled={!this.state.rcm} accordion>
                        <Space style={{display: 'flex'}} align="baseline">
                            <UploadExperimentData
                                name={"volume_time_data"}
                                type={"data"}
                                api={'frontend/input/data_excel'}
                                ext={".xlsx"}
                                required={this.state.rcm}
                            />
                            <HelpGuide/>
                        </Space>
                    </Collapse.Panel>
                    <Collapse.Panel header="Ignition definition (Only for 'Ignition Delay Measurement') " key="6"
                                    disabled={!this.state.idt}>
                        <IgnitionDefinition required={this.state.idt}/>
                    </Collapse.Panel>
                    <Collapse.Panel header="OpenSMOKE input file" key="7">
                        <UploadExperimentData
                            name={"os_input_file"}
                            type={"text"}
                            api={'frontend/input/os_input_file'}
                            ext={".dic"}
                            required={false}
                        />
                    </Collapse.Panel>
                    <Collapse.Panel header="Characteristics" key="8">
                        <Characteristics />
                    </Collapse.Panel>

                    <Collapse.Panel header="References" key="9">
                        <References/>
                    </Collapse.Panel>

                </Collapse>

                <Form.Item {...formItemLayoutWithOutLabel}>

                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{margin: "10px"}}
                        size={"large"}
                    >
                        Submit
                    </Button>

                </Form.Item>
            </Form>
        )
    }
}

export default ExperimentForm;