import React from "react";
import {Modal, Row, Select, Button, Space, message, Form, Col, Input, Alert, Typography} from "antd";
import {checkError} from "../Tool";
import {PlusOutlined} from "@ant-design/icons";

const axios = require('axios');
import Cookies from "js-cookie";
axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

class AddSpecie extends React.Component{
    formRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            submitLoading: false,
        }
    }


    onFinish = (values) => {
        values['names'] = values['names'] !== undefined ? values['names'].split(',') : undefined

        const params = {
            'model_name': 'Specie',
            'property_dict': JSON.stringify(values)
        }

        this.setState({submitLoading: true})

        axios.post(window.$API_address + 'ExperimentManager/API/insertElement', params)
            .then(() => {
                message.success('Specie added successfully', 5);
                this.setState({submitLoading: false})

                this.formRef.current.resetFields();
                this.props.refreshSpecieList();
                this.props.closeAddSpecie();
            })
            .catch(error => {
                checkError(error)
                this.setState({submitLoading: false})
            })


    }

    onFinishFailed = () => {

    }


    render() {
        return(
            <Modal
                title="Add Species"
                visible={this.props.addSpecieVisible}
                onCancel={this.props.closeAddSpecie}
                footer={null}
            >
                <Space direction={'vertical'} size={'large'}>
                    <Form
                        name="basic"
                        layout="vertical"
                        autoComplete="off"
                        onFinish={this.onFinish.bind(this)}
                        onFinishFailed={this.onFinishFailed}
                        ref={this.formRef}
                    >
                        <Row>
                            <Col span={12}>
                                <Form.Item
                                    name="InChI"
                                    label="InChI"
                                    rules={[{required: true, message: 'Please insert InChI.'}]}
                                >
                                    <Input placeholder={'Please insert InChI.'} allowClear maxLength={150} style={{width: 200}}/>
                                </Form.Item>
                            </Col>
                            <Col offset={2} span={10}>
                                <Form.Item
                                    name="CAS"
                                    label="CAS"
                                    rules={[{required: false, message: 'Please insert CAS.'}]}
                                >
                                    <Input placeholder={'Please insert CAS.'} allowClear maxLength={150} style={{width: 200}}/>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={10}>
                                <Form.Item
                                    name="SMILES"
                                    label="SMILES"
                                    rules={[{required: false, message: 'Please insert SMILES.'}]}
                                >
                                    <Input placeholder={'Please insert SMILES.'} allowClear maxLength={150} style={{width: 200}}/>
                                </Form.Item>
                            </Col>
                            <Col offset={4} span={10}>
                                <Form.Item
                                    name="preferredKey"
                                    label="Preferred Name"
                                    rules={[{required: true, message: 'Please insert a Preferred Name.'}]}
                                >
                                    <Input placeholder={'Please insert a Preferred Name.'} allowClear maxLength={150} style={{width: 200}}/>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={10}>
                                <Form.Item
                                    name="formula"
                                    label="Formula"
                                    rules={[{required: true, message: 'Please insert a formula.'}]}
                                >
                                    <Input placeholder={'Please insert a formula.'} allowClear maxLength={150} style={{width: 200}}/>
                                </Form.Item>
                            </Col>
                            <Col offset={4} span={10}>
                                <Form.Item
                                    name="chemName"
                                    label="Chemical Name"
                                    rules={[{required: false, message: 'Please insert a chemName.'}]}
                                >
                                    <Input placeholder={'Please insert a Chemical Name.'} allowClear maxLength={150} style={{width: 200}}/>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            name="names"
                            label="Alternative Names"
                            rules={[{required: false}]}
                        >
                            <Input placeholder={'Please insert alternative names.'} allowClear maxLength={150} style={{width: 400}}/>
                        </Form.Item>



                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                shape="round"
                                icon={<PlusOutlined />}
                                loading={this.state.submitLoading}
                            >
                                Add Specie
                            </Button>
                        </Form.Item>
                    </Form>
                </Space>
            </Modal>
        )
    }
}

export default AddSpecie;