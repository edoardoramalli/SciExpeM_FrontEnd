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
import LoadOpenSmokeFile from "./InputForm/LoadOpenSmokeFile"
import LoadDataColumn from "./InputForm/LoadDataColumn"


const csrftoken = Cookies.get('csrftoken');
axios.defaults.headers.post['X-CSRFToken'] = csrftoken;


class ExperimentForm extends React.Component {
    formRef = React.createRef();

    constructor() {
        super();
        this.onFinish = this.onFinish.bind(this)
        this.state = {
            reactor_inactive: true,
            idt: false,
            rcm: false,
            base_active: ['1', '2', '3', '4', '7', '8', '9'],
            active_key: ['1', '2', '3', '4', '7', '8', '9'],
            reactor_value: null,
            experiment: null
        }
        this.handleExperimentType = this.handleExperimentType.bind(this);
        this.handleReactorType = this.handleReactorType.bind(this);
    }

    handleValueForm = values => {
        let ignition_type;
        if (values.ignition_definition_measured_quantity && values.ignition_definition_type) {
            ignition_type = values.ignition_definition_measured_quantity + '-' + values.ignition_definition_type
        } else {
            ignition_type = undefined
        }
        let data_columns;
        if (!values.volume_time) {
            data_columns = values.experimental_data
        } else {
            data_columns = values.experimental_data.concat(values.volume_time)
        }
        let experiment = {
            // Model Mandatory
            experiment_type: values.experiment_type,
            reactor: values.reactor,
            fileDOI: values.fileDOI,
            // Model Optional
            comment: values.comment,
            ignition_type: ignition_type,
            fuels: values.fuels,

            p_sup: values.p_profile.p_sup,
            p_inf: values.p_profile.p_inf,
            t_sup: values.t_profile.t_sup,
            t_inf: values.t_profile.t_inf,
            phi_sup: values.phi_profile.phi_sup,
            phi_inf: values.phi_profile.phi_inf,

            os_input_file: values.os_input_file,
            volume_time_profile: {},
            // Foreign Key
            data_columns: data_columns,
            common_properties: values.common_properties,
            initial_species: values.initial_species,
            file_paper: {references: values.references, reference_doi: values.reference_doi},

        }
        this.setState({experiment: experiment})
    }


    onFinishFailed = ({values, errorFields}) => {
        this.handleValueForm(values)
        const reducer = (accumulator, currentValue) => accumulator + " " + currentValue.errors;
        const errors = errorFields.reduce(reducer, "")
        message.error("There are some errors in the form! " + errors, 5)

    };

    onFinish = values => {
        this.handleValueForm(values)

        const params = {
            'model_name': ['Experiment'],
            'property': [JSON.stringify(this.state.experiment)]
        }

        axios.post(window.$API_address + 'ExperimentManager/API/insertElement', params)
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
        if (this.state.idt) {
            this.setState({
                active_key: this.state.base_active.concat(['6'])
            })
        }
        if (this.state.idt && this.state.rcm) {
            this.setState({
                active_key: this.state.base_active.concat(['5', '6'])
            })
        }


    }

    handleDataColumn = text_file => {
        this.formRef.current.setFieldsValue({experimental_data: text_file})
    }

    handleVolumeTime = text_file => {
        this.formRef.current.setFieldsValue({volume_time: text_file})
    }

    handleOSinputFile = (text_file) => {
        this.formRef.current.setFieldsValue({os_input_file: text_file})
    }

    handleReactorType = (reactorType) => {
        this.setState({
            reactor_value: reactorType,
            rcm: reactorType === 'rapid compression machine'
        }, () => {
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
                    return (
                        <Select.Option value={item} style={{"textTransform": "capitalize"}}>{item}</Select.Option>
                    )
                });
                this.setState({
                    reactor_inactive: false,
                    reactor_list: options
                })
                if (experimentType === 'ignition delay measurement') {
                    this.setState({idt: true}, () => {
                        this.handleKey()
                    })
                }
                this.handleKey()

            })
            .catch(error => {
                if (error.response.status === 403) {
                    message.error("You don't have the authorization!", 3);
                } else if (error.response.status === 400) {
                    message.error("Bad Request. " + error.response.data, 3);
                } else {
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
                            <LoadDataColumn
                                name={'experimental_data'}
                                dataGroup={'dg1'}
                                required={true}
                                handleDataColumn={this.handleDataColumn}
                            />
                            <HelpGuide/>
                        </Space>
                    </Collapse.Panel>
                    <Collapse.Panel header="Volume-time profile (Only for 'Rapid Compression Machine')" key="5"
                                    disabled={!this.state.rcm} accordion>
                        <Space style={{display: 'flex'}} align="baseline">
                            <LoadDataColumn
                                name={'volume_time'}
                                dataGroup={'dg2'}
                                required={true}
                                handleDataColumn={this.handleVolumeTime}
                            />
                            <HelpGuide/>
                            {/*// todo helph guide deve essere diversa*/}
                        </Space>
                    </Collapse.Panel>
                    <Collapse.Panel header="Ignition definition (Only for 'Ignition Delay Measurement') " key="6"
                                    disabled={!this.state.idt}>
                        <IgnitionDefinition required={this.state.idt}/>
                    </Collapse.Panel>
                    <Collapse.Panel header="OpenSMOKE++ input file" key="7">
                        <LoadOpenSmokeFile
                            required={true}
                            handleOSinputFile={this.handleOSinputFile}
                        />
                    </Collapse.Panel>
                    <Collapse.Panel header="Characteristics" key="8">
                        <Characteristics/>
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