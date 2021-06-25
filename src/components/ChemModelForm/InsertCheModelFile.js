import React from "react";
import {Button, Collapse, Form, Input, message, Select} from "antd";

import LoadFile from './LoadFile'

const axios = require('axios');
import Cookies from "js-cookie";
import {checkError} from "../Tool";
axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');


class InsertCheModelFile extends React.Component {
    formRef = React.createRef();

    constructor(props) {
        super(props);
        this.onFinish = this.onFinish.bind(this)
        this.state = {
            chemModel: null,
            options: []
        }
    }

    handleKineticsFile = (text_file) => {
        this.formRef.current.setFieldsValue({xml_file_kinetics: text_file})
    }

    handleReactionNameFile = (text_file) => {
        this.formRef.current.setFieldsValue({xml_file_reaction_names: text_file})
    }

    onFinishFailed = ({values, errorFields}) => {
        this.handleValueForm(values)
        const reducer = (accumulator, currentValue) => accumulator + " " + currentValue.errors;
        const errors = errorFields.reduce(reducer, "")
        message.error("There are some errors in the form! " + errors, 5)
    };

    componentDidMount() {
        axios.get(window.$API_address + 'frontend/api/get_chemModel_version_list')
            .then(res => {
                const experiment_type_list = res.data.chemModel_version;
                let options = experiment_type_list.map((item) => {
                    return(
                        <Select.Option
                            value={item}
                            key={'ChemModelVersion' + item.toString()}
                        >
                            {item}
                        </Select.Option>
                    )
                });
                this.setState({options: options})
            }).catch(error => {
            checkError(error)
        })
    }

    handleValueForm = values => {
        let chemModel = {
            // Model Mandatory
            name: values.name,
            xml_file_kinetics: values.xml_file_kinetics,
            xml_file_reaction_names: values.xml_file_reaction_names,
            version: values.version,
        }
        this.setState({chemModel: chemModel})
    }

    onFinish = values => {
        this.handleValueForm(values)
        const params = {
            'model_name': 'ChemModel',
            'property_dict': JSON.stringify(this.state.chemModel)
        }

        axios.post(window.$API_address + 'ExperimentManager/API/insertElement', params)
            .then(() => {
                this.formRef.current.resetFields();
                message.success('ChemModel added successfully', 5);
            })
            .catch(error => {
                message.error(error.response.data, 5)
            })
    }

    render() {
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                sm: {span: 20, offset: 0},
            },
        };
        return (
            <Form
                onFinish={this.onFinish}
                onFinishFailed={this.onFinishFailed}
                layout="vertical"
                autoComplete="off"
                ref={this.formRef}
            >
                <Collapse activeKey={['ChemModel1','ChemModel2','ChemModel3','ChemModel4']}>
                    <Collapse.Panel header="ChemModel name" key="ChemModel1">
                        <Form.Item
                            label="CheModel Name"
                            name="name"
                            rules={[{required: true, message: 'Please insert the name of the ChemModel.'}]}
                        >
                            <Input.TextArea
                                rows={1}
                                showCount
                                maxLength={100}
                                placeholder={"Insert the ChemModel name"}
                                style={{width: "35%"}}/>
                        </Form.Item>
                    </Collapse.Panel>
                    <Collapse.Panel header="ChemModel Version" key="ChemModel2">
                        <Form.Item
                            label="ChemModel Version"
                            name="version"
                            rules={[{required: true, message: 'Please insert the version of the ChemModel.'}]}
                        >
                            <Select
                                placeholder="Select a version"
                                allowClear={true}
                                style={{width: "35%"}}
                            >
                                {this.state.options}
                            </Select>
                        </Form.Item>
                    </Collapse.Panel>
                    <Collapse.Panel header="Kinetics File" key="ChemModel3">
                        <LoadFile
                            name={'Kinetics'}
                            labelForm={'xml_file_kinetics'}
                            handleFile={this.handleKineticsFile}
                            required={true}
                        />
                    </Collapse.Panel>
                    <Collapse.Panel header="Reaction Names File" key="ChemModel4">
                        <LoadFile
                            name={'Reaction Names'}
                            labelForm={'xml_file_reaction_names'}
                            handleFile={this.handleReactionNameFile}
                            required={true}
                        />
                    </Collapse.Panel>
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
                </Collapse>

            </Form>
        )
    }
}

export default InsertCheModelFile;