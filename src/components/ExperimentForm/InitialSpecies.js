import React from "react";

import {Space, Form, Button, Select, InputNumber} from "antd";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";

const axios = require('axios');
import Cookies from "js-cookie";

axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');


class InitialSpecies extends React.Component {
    constructor() {
        super();
        this.state = {
            species: null
        }
    }

    componentDidMount() {
        axios.get(window.$API_address + 'frontend/api/opensmoke/species_names')
            .then(res => {
                const specie_dict = res.data;
                let options = []
                Object.entries(specie_dict).forEach(([key, value]) => {
                    let text = value + ' (ID: ' + key + ')'
                    options.push(<Select.Option key={text} value={key}>{text}</Select.Option>)
                })

                this.setState({species: options})
            }).catch(error => {
            // console.log(error.response);
        })
    }

    render() {
        return (
            <Form.List name="initial_species">
                {(fields, {add, remove}) => (
                    <>
                        {fields.map(field => (
                            <Space key={field.key} style={{display: 'flex', marginBottom: 8}} align="baseline">
                                <Form.Item
                                    {...field}
                                    name={[field.name, 'specie']}
                                    fieldKey={[field.fieldKey, 'specie']}
                                    rules={[{required: true, message: 'Missing species name.'}]}
                                >
                                    <Select
                                        showSearch
                                        placeholder={"Select a species"}
                                        optionFilterProp="children"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        style={{width: 150}}>
                                        {this.state.species}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    {...field}
                                    name={[field.name, 'value']}
                                    fieldKey={[field.fieldKey, 'value']}
                                    rules={[{required: true, message: 'Missing species value.'}]}
                                >
                                    <InputNumber
                                        min={0} max={1} step={0.001}
                                        defaultValue={0}
                                        style={{width: 150}}
                                    />
                                </Form.Item>
                                <Form.Item
                                    {...field}
                                    name={[field.name, 'units']}
                                    fieldKey={[field.fieldKey, 'units']}
                                    rules={[{required: true, message: 'Missing species unit.'}]}
                                >
                                    <Select value="mole fraction" style={{width: 150}} placeholder={"Select unit"}>
                                        <Select.Option value={"mole fraction"}>mole fraction</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    {...field}
                                    name={[field.name, 'configuration']}
                                    fieldKey={[field.fieldKey, 'configuration']}
                                    rules={[{required: true, message: 'Missing Configuration.'}]}
                                >
                                    <Select
                                        placeholder={'Select Configuration'}
                                        style={{width: 200}}
                                    >
                                        <Select.Option value="premixed">Premixed</Select.Option>
                                        <Select.Option value="fuel">Fuel</Select.Option>
                                        <Select.Option value="oxidizer">Oxidizer</Select.Option>
ì                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    {...field}
                                    name={[field.name, 'source_type']}
                                    fieldKey={[field.fieldKey, 'source_type']}
                                    rules={[{required: true, message: 'Missing Source Type.'}]}
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

                                <MinusCircleOutlined onClick={() => remove(field.name)}/>
                            </Space>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}
                                    style={{width: 750}}>
                                Add field
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
        )
    }
}

export default InitialSpecies;