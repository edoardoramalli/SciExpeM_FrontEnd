import React from "react";
import {Button, Collapse, Form, Input, message} from "antd";

import LoadFile from './LoadFile'


class InsertCheModelFile extends React.Component {
    formRef = React.createRef();

    constructor(props) {
        super(props);
        this.onFinish = this.onFinish.bind(this)
        this.state = {
            chemModel: null
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

    handleValueForm = values => {
        let chemModel = {
            // Model Mandatory
            name: values.name,
            xml_file_kinetics: values.xml_file_kinetics,
            xml_file_reaction_names: values.xml_file_reaction_names,
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
                <Collapse activeKey={[1, 2, 3]}>
                    <Collapse.Panel header="ChemModel name" key="1">
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
                    <Collapse.Panel header="Kinetics File" key="2">
                        <LoadFile
                            name={'Kinetics'}
                            labelForm={'xml_file_kinetics'}
                            handleFile={this.handleKineticsFile}
                            required={true}
                        />
                    </Collapse.Panel>
                    <Collapse.Panel header="Reaction Names File" key="3">
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