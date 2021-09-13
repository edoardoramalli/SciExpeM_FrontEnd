import React from "react";
import {Select, Form, Space} from "antd";


class IgnitionDefinition extends React.Component{
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <Space align="baseline">
                <Form.Item
                    label={"Ignition definition measured quantity"}
                    name="ignition_definition_measured_quantity"
                    rules={[{required: this.props.required, message: 'Please insert ignition definition measured quantity.'}]}
                >
                    <Select
                        placeholder="Select an ignition measured quantity"
                        allowClear={true}
                        style={{width: "100%"}}
                    >
                        <Select.Option value="p">pressure</Select.Option>
                        <Select.Option value="T">temperature</Select.Option>
                        <Select.Option value="CH">CH</Select.Option>
                        <Select.Option value="OH">OH</Select.Option>
                        <Select.Option value="CO2">CO2</Select.Option>
                        <Select.Option value="CO">CO</Select.Option>
                        <Select.Option value="H2">H2O</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label={"Ignition definition type"}
                    name="ignition_definition_type"
                    rules={[{required: this.props.required, message: 'Please insert ignition definition type.'}]}
                >
                    <Select
                        placeholder="Select an ignition type"
                        allowClear={true}
                        style={{width: "250px"}}
                    >
                        <Select.Option value="d/dt max">d/dt max</Select.Option>
                        <Select.Option value="max">max</Select.Option>
                        <Select.Option value="baseline max intercept from d/dt">baseline max intercept from d/dt</Select.Option>
                        <Select.Option value="baseline min intercept from d/dt">baseline min intercept from d/dt</Select.Option>
                        <Select.Option value="concentration">concentration</Select.Option>
                        <Select.Option value="relative concentration">relative concentration</Select.Option>
                    </Select>


            </Form.Item>
            </Space>
        )
    }
}

export default IgnitionDefinition;