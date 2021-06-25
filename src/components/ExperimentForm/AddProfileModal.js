import React from "react";
import {Alert, Cascader, Form, Button, Input, Modal, Row, Select, Space, Typography, message, Col} from "antd";

const axios = require('axios');
import Cookies from "js-cookie";

axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

import {extractData} from "../Tool";


class AddProfileModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            profile_sx: '',
            profile_dx: '',
            propertyDataTime: [],
            propertyData: [],
            dg_id: 'dg' + this.props.getDataGroup().toString()
        }
    }


    onChangeProfile(value) {
        let profile_sx;
        let profile_dx;
        if (value === 'V-t history') {
            profile_sx = 'volume'
            profile_dx = 'time'
        } else if (value === 'p-t history') {
            profile_sx = 'pressure'
            profile_dx = 'time'
        } else if (value === 'T-t history') {
            profile_sx = 'temperature'
            profile_dx = 'time'
        }
        else if (value === 'T-l history') {
            profile_sx = 'temperature'
            profile_dx = 'length'
        }
        this.setState({profile_dx: profile_dx, profile_sx: profile_sx})
    }

    createUnitOptions(property) {
        let units = [];
        if (property === 'volume') {
            units = ['m3', 'dm3', 'cm3', 'mm3', 'L']
        } else if (property === 'pressure') {
            units = ['Pa', 'kPa', 'MPa', 'Torr', 'torr', 'bar', 'mbar', 'atm']
        } else if (property === 'temperature') {
            units = ['K']
        } else if (property === 'length') {
            units = ['m', 'dm', 'cm', 'mm']
        }else if (property === 'time') {
            units = ['ms', 'us', 'ns', 's', 'min']
        }
        let result = []
        units.forEach(key => {
            result.push(<Select.Option value={key} key={'unit' + key}>{key}</Select.Option>)
        })
        return result
    }


    onChangeDataTime = ({target: {value}}) => {
        this.setState({propertyDataTime: extractData(value)})
    }

    onChangeData = ({target: {value}}) => {
        this.setState({propertyData: extractData(value)})
    }

    onFinish = (values) => {
        let data_profile = extractData(values.data)
        let data_time = extractData(values.time)

        if (data_profile.length === 0 || data_time.length === 0) {
            message.error("Data field is empty or contains abnormal values.")
            return
        }

        let data_column = {
            name: this.state.profile_sx,
            units: values.profile_units,
            data: data_profile,
            source_type: values.source_type,
            dg_id: this.state.dg_id,
            dg_label: values.dg_label,
            data_group_profile: values.data_group_profile
        }
        let time_column = {
            name: this.state.profile_dx,
            units: values.time_units,
            data: data_time,
            source_type: values.source_type,
            dg_id: this.state.dg_id,
            dg_label: values.dg_label,
            data_group_profile: values.data_group_profile
        }
        this.props.handleModal({index: this.props.index, data_column: [data_column, time_column]})
    };

    onFinishFailed = ({values, errorFields}) => {
        const reducer = (accumulator, currentValue) => accumulator + " " + currentValue.errors;
        const errors = errorFields.reduce(reducer, "")
        message.error("There are some errors in the form! " + errors, 5)
    };


    render() {
        return (
            <Modal
                title="Add Profile"
                visible={this.props.modalVisible}
                onOk={this.props.hideModel}
                onCancel={this.props.hideModel}
                footer={null}
            >

                <Form
                    name="basic"
                    layout="vertical"
                    autoComplete="off"
                    onFinish={this.onFinish}
                    onFinishFailed={this.onFinishFailed}
                >
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                label="Profile Type"
                                name="dg_label"
                                rules={[{required: true, message: 'Please select profile type.'}]}
                            >
                                <Select
                                    placeholder={'Select Profile Type'}
                                    style={{width: 200}}
                                    onChange={this.onChangeProfile.bind(this)}
                                >
                                    <Select.Option value="V-t history">volume-time history</Select.Option>
                                    <Select.Option value="p-t history">pressure-time history</Select.Option>
                                    <Select.Option value="T-t history">temperature-time history</Select.Option>
                                    <Select.Option value="T-l history">temperature-length history</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col offset={2} span={10}>
                            <Form.Item
                                label="Source Type"
                                name="source_type"
                                rules={[{required: true, message: 'Please insert Source Type.'}]}
                            >
                                <Select
                                    placeholder={'Select Source Type'}
                                >
                                    <Select.Option value="reported">Reported</Select.Option>
                                    <Select.Option value="digitized">Digitized</Select.Option>
                                    <Select.Option value="calculated">Calculated</Select.Option>
                                    <Select.Option value="estimated">Estimated</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label={"Association"}
                        name="data_group_profile"
                        rules={[{required: true, message: 'Please insert Association.'}]}
                    >
                        <Select mode="tags" style={{ width: '100%' }} placeholder="Insert Association Rows">
                        </Select>
                    </Form.Item>

                    <Row>
                        <Col span={10}>
                            <Form.Item
                                label={this.state.profile_sx + " Unit"}
                                name="profile_units"
                                rules={[{required: true, message: 'Please insert Data Unit.'}]}
                            >
                                <Select
                                    placeholder={'Select time unit'}
                                    style={{width: 200}}
                                >
                                    {this.createUnitOptions(this.state.profile_sx)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col offset={4} span={10}>
                            <Form.Item
                                label={this.state.profile_dx + " Unit"}
                                name="time_units"
                                rules={[{
                                    required: true,
                                    message: 'Please select time unit.'
                                }]}
                            >
                                <Select
                                    placeholder={'Select time unit'}
                                    style={{width: 200}}
                                >
                                    {this.createUnitOptions(this.state.profile_dx)}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>


                    <Row>
                        <Col span={10}>
                            <Form.Item
                                label={this.state.profile + " Column"}
                                name="data"
                                rules={[{required: true, message: 'Please insert Data Column.'}]}
                            >
                                <Input.TextArea
                                    autoSize={{minRows: 5, maxRows: 10}}
                                    placeholder="Insert Data Column"
                                    allowClear
                                    onChange={this.onChangeData.bind(this)}/>
                            </Form.Item>
                        </Col>
                        <Col offset={4} span={10}>
                            <Form.Item
                                label={this.state.profile_dx + " Column"}
                                name="time"
                                rules={[{required: true, message: 'Please insert Time Column.'}]}
                            >
                                <Input.TextArea
                                    autoSize={{minRows: 5, maxRows: 10}}
                                    placeholder="Insert Column"
                                    allowClear
                                    onChange={this.onChangeDataTime.bind(this)}/>
                            </Form.Item>
                        </Col>
                    </Row>


                    <Form.Item>
                        <Space direction="vertical">
                            <Row>
                                <Alert
                                    message="Please write only one value of the data column for each line."
                                    type="warning"
                                />
                            </Row>
                            <Row>
                                Preview Data:
                            </Row>
                            <Row>
                                <Typography.Text>
                                    [{this.state.propertyData.join(', ')}]
                                </Typography.Text>
                            </Row>
                            <Row>
                                Preview Data Time:
                            </Row>
                            <Row>
                                <Typography.Text>
                                    [{this.state.propertyDataTime.join(', ')}]
                                </Typography.Text>
                            </Row>
                        </Space>
                    </Form.Item>


                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>

            </Modal>


        )
    }

}

export default AddProfileModal;