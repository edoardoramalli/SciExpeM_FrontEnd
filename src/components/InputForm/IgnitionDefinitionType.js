import React from "react";
import {Select, Form} from "antd";

const FormItem = Form.Item;

class IgnitionDefinitionType extends React.Component{
    render() {
        return(
            <FormItem label={"Ignition definition measured quantity"}>
                {getFieldDecorator('ignition_definition_quantity', {
                    rules: [{required: false, message: 'Please insert experiment type.'}],
                })(
                    <Select
                        placeholder="Select an ignition measured quantity"
                        allowClear={true}
                        style={{width: "25%"}}
                    >
                        <Option value="p">pressure</Option>
                        <Option value="T">temperature</Option>
                        <Option value="CH">CH</Option>
                        <Option value="OH">OH</Option>
                        <Option value="CO2">C02</Option>
                    </Select>
                )}
            </FormItem>
        )
    }
}

export default IgnitionDefinitionType;