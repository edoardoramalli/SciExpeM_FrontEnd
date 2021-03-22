import React from "react";
import {Button, Form, InputNumber, Select, Space} from "antd";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";

class CommonProperty extends React.Component{
    // formRef = React.createRef();

    constructor() {
        super();
        this.state ={
            mapping: {
                'temperature': ['K'],
                'pressure': ['Pa', 'atm', 'bar', 'Torr', 'mbar'],
                'residence time': ['s', 'ms', 'us'],
                'volume': ['cm3'],
                'laminar burning velocity': ['cm/s']
            },
            properties: null,
            properties_unit: null
        }

    }

    onPropertyChange = (value) => {
        let options = this.state.mapping[value].map((item) => {
            return(
                <Select.Option
                    value={item}
                    key={item}
                >
                    {item}
                </Select.Option>
            )
        });
        // this.formRef.current.setFieldsValue({unit: "",})
        this.setState({properties_unit: options})

    }

    componentDidMount() {
        const property_keys = Object.keys(this.state.mapping)
        let options = property_keys.map((item) => {
            return(
                <Select.Option
                    value={item}
                    key={item}
                >
                    {item}
                </Select.Option>
            )
        });
        this.setState({properties: options})
    }


    render() {


        return(
            <Form.List name="common_properties" >
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(field => (
                            <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                <Form.Item
                                    {...field}
                                    name={[field.name, 'name']}
                                    fieldKey={[field.fieldKey, 'name']}
                                    rules={[{ required: true, message: 'Missing property name.' }]}
                                >
                                    <Select
                                        placeholder={"Select a property"}
                                        style={{width: 200}}
                                        onChange={this.onPropertyChange}
                                    >
                                        {this.state.properties}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    {...field}
                                    name={[field.name, 'value']}
                                    fieldKey={[field.fieldKey, 'value']}
                                    rules={[{ required: true, message: 'Missing property value.' }]}
                                >
                                    <InputNumber
                                        min={0}
                                        defaultValue={0}
                                        style={{width: 150}}
                                    />
                                </Form.Item>
                                <Form.Item
                                    {...field}
                                    name={[field.name, 'units']}
                                    fieldKey={[field.fieldKey, 'units']}
                                    rules={[{ required: true, message: 'Missing property unit.' }]}
                                >
                                    <Select
                                        placeholder={"Select unit"}
                                        style={{width: 150}}
                                    >
                                        {this.state.properties_unit}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    {...field}
                                    name={[field.name, 'source_type']}
                                    fieldKey={[field.fieldKey, 'source_type']}
                                    rules={[{ required: true, message: 'Missing Source Type.' }]}
                                >
                                    <Select
                                        placeholder={'Select Source Type'}
                                        style={{width: 200}}
                                    >
                                        <Select.Option value="reported">Reported</Select.Option>
                                        <Select.Option value="digitized">Digitized</Select.Option>
                                        <Select.Option value="calculated">Calculated</Select.Option>
                                        <Select.Option value="estimated">Estimated</Select.Option>
                                    </Select>
                                </Form.Item>

                                <MinusCircleOutlined onClick={() => remove(field.name)} />
                            </Space>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} style={{width: 750}}>
                                Add field
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
        )

    }
}

export default CommonProperty;