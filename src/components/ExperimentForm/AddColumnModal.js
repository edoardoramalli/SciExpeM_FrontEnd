import React from "react";
import {
    Alert,
    Cascader,
    Form,
    Button,
    Input,
    Modal,
    Row,
    Select,
    Space,
    Typography,
    message,
    Col,
    InputNumber
} from "antd";

const axios = require('axios');
import Cookies from "js-cookie";

axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

import {extractData} from "../Tool";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";

class AddColumnModal extends React.Component {

    property_list = {
        'temperature': ['K'],
        'pressure': ['Pa', 'kPa', 'MPa', 'Torr', 'torr', 'bar', 'mbar', 'atm'],
        'ignition delay': ['s', 'ms', 'us', 'ns', 'min'],
        'composition': ['mole fraction'],
        'laminar burning velocity': ['m/s', 'dm/s', 'cm/s', 'mm/s', 'm s-1', 'dm s-1', 'cm s-1', 'mm s-1'],
        'volume': ['m3', 'dm3', 'cm3', 'mm3', 'L'],
        'time': ['s', 'ms', 'us', 'ns', 'min'],
        'residence time': ['s', 'ms', 'us', 'ns', 'min'],
        'distance': ['m', 'dm', 'cm', 'mm'],
        'rate coefficient': ['s-1', 'm3 mol-1 s-1', 'dm3 mol-1 s-1', 'cm3 mol-1 s-1', 'm3 molecule-1 s-1',
            'dm3 molecule-1 s-1', 'cm3 molecule-1 s-1', 'm6 mol-3 s-1', 'dm6 mol-2 s-1',
            'cm6 mol-2 s-1', 'm6 molecule-2 s-1', 'dm6 molecule-2 s-1', 'cm6 molecule-2 s-1'],
        'equivalence ratio': ['unitless'],
        'length': ['m', 'dm', 'cm', 'mm'],
        'density': ['g m-3', 'g dm-3', 'g cm-3', 'g mm-3', 'kg m-3', 'kg dm-3', 'kg cm-3', 'kg mm-3'],
        'flow rate': ['g m-2x s-1', 'g dm-2 s-1', 'g cm-2 s-1', 'g mm-2 s-1', 'kg m-2 s-1', 'kg dm-2 s-1', 'kg cm-2 s-1', 'kg mm-2 s-1'],
        'concentration': ['mol/m3', 'mol/dm3', 'mol/cm3', 'mol m-3', 'mol dm-3', 'mol cm-3', 'molecule/m3', 'molecule/dm3', 'molecule/cm3', 'molecule m-3', 'molecule dm-3', 'molecule cm-3'],
    }

    constructor(props) {
        super(props);
        this.state = {
            propertyName: null,
            propertyUnit: null,
            propertySpecie: null,
            propertyData: [],
            propertyObject: null,
            speciesOptions: null,
            speciesAllowed: ['composition', 'concentration'],
            uncertaintyActive: false,
            propertyDataUncertainty: [],
            species: {},
        }
    }

    componentDidMount() {
        axios.get(window.$API_address + 'frontend/api/opensmoke/species_names')
            .then(res => {

                const specie_dict = res.data;
                let speciesOptions = []
                Object.entries(specie_dict).forEach(([key, value]) => {
                    let text = value + ' (ID: ' + key + ')'
                    speciesOptions.push(<Select.Option key={text} value={key}>{text}</Select.Option>)
                })
                // let speciesOptions = res.data.names.map((item) => {
                //     return (
                //         <Select.Option
                //             value={item}
                //             key={item}
                //         >
                //             {item}
                //         </Select.Option>
                //     )
                // });
                this.setState({species: specie_dict, speciesOptions: speciesOptions, propertyObject: this.createOptions()})
            }).catch(error => {
            console.log(error.response);
        })

    }


    filter(inputValue, path) {
        return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
    }

    createOptions() {
        let opt = []
        for (let key in this.property_list) {
            let children = [];
            for (let item in this.property_list[key]) {
                children.push({value: this.property_list[key][item], label: this.property_list[key][item]})
            }
            opt.push({value: key, label: key, children: children})
        }
        return (<Cascader
            options={opt}
            onChange={this.onChangePropertyName.bind(this)}
            expandTrigger="hover"
            placeholder="Please select Property"
            showSearch={this.filter}
        />)
    }

    onChangePropertyName(value) {
        this.props.setColumnName(this.props.index, ' - ' + value[0].toString())
        this.setState({propertyName: value[0], propertyUnit: value[1]})
    }

    onChangeSpecie(value) {
        let text = []
        value.map(i =>{
            text.push(this.state.species[parseInt(i)])
        })
        this.props.setColumnName(this.props.index, ' - ' + text.toString())
    }

    createUnitOptions() {
        this.property_list[this.state.propertyName].map((key) => {
            return (
                <Select.Option
                    value={key}
                    key={key}
                >
                    {key}
                </Select.Option>
            )
        })
    }


    onChangeDataUncertainty = ({target: {value}}) => {
        this.setState({propertyDataUncertainty: extractData(value)})
    }

    onChangeData = ({target: {value}}) => {
        this.setState({propertyData: extractData(value)})
    }

    onFinish = (values) => {
        let species_label;
        let species_array;
        if (values.species_object && this.state.speciesAllowed.indexOf(values.property[0]) > -1) {
            // species_label = '[' + values.species.toString() + ']'
            // species_label = species_label.replaceAll(',', '+')
            species_array = values.species_object
        } else {
            species_label = undefined
            species_array = undefined
        }

        let data = extractData(values.data)
        if (data.length === 0) {
            message.error("Data field is empty or contains abnormal values.")
            return
        }

        let uncertainty_reference = undefined

        if (values.uncertainty !== 'none') {
            let dataUncertainty = extractData(values.uncertaintyData)
            if (dataUncertainty.length === 0 || dataUncertainty.length !== data.length) {
                message.error("Data Uncertainty field is empty or contains abnormal values.")
                return
            }
            uncertainty_reference = {
                name: 'uncertainty',
                units: values.property[1],
                data: dataUncertainty,
                source_type: values.source_type,
                dg_id: values.dg_id,
                dg_label: this.props.dataGroupAssociation[values.dg_id],
                label: undefined,
                uncertainty_kind: values.uncertainty,
                uncertainty_bound: 'plusminus'
            }
        }

        let data_column = {
            name: values.property[0],
            units: values.property[1],
            data: data,
            source_type: values.source_type,
            dg_id: values.dg_id,
            dg_label: this.props.dataGroupAssociation[values.dg_id],
            label: species_label,
            species_object: species_array,
            uncertainty_reference: uncertainty_reference,
            fuel_oxidizer: values.fuel_oxidizer
        }
        this.props.handleModal({index: this.props.index, data_column: data_column})
    };

    onFinishFailed = ({values, errorFields}) => {
        const reducer = (accumulator, currentValue) => accumulator + " " + currentValue.errors;
        const errors = errorFields.reduce(reducer, "")
        message.error("There are some errors in the form! " + errors, 5)
    };

    createDataGroupOptions(options) {
        let result = []
        for (let val in options) {
            result.push(<Select.Option value={val} key={val}>Data Group {val}</Select.Option>)
        }
        return result
    }

    onChangeUncertainty(value) {
        this.setState({uncertaintyActive: value !== 'none'})
    }

    render() {
        return (
            <Modal
                title="Add Column"
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
                                label="Property"
                                name="property"
                                rules={[{required: true, message: 'Please select property.'}]}
                            >
                                {this.state.propertyObject}
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

                    <Row>
                        <Col span={10}>
                            <Form.Item
                                label="Data Group"
                                name="dg_id"
                                rules={[{required: true, message: 'Please insert Data Group.'}]}
                            >
                                <Select
                                    placeholder={'Select Data Group'}
                                >
                                    {this.createDataGroupOptions(this.props.dataGroupAssociation)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col offset={4} span={10}>
                            <Form.Item
                                label="Uncertainty Type"
                                name="uncertainty"
                                rules={[{
                                    required: true,
                                    message: 'Please select uncertainty.'
                                }]}
                            >
                                <Select
                                    placeholder={'Select Uncertainty Type'}
                                    onChange={this.onChangeUncertainty.bind(this)}
                                >
                                    <Select.Option value={'none'}>None</Select.Option>
                                    <Select.Option value={'absolute'}>Absolute</Select.Option>
                                    <Select.Option value={'relative'}>Relative</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Specie(s)"
                        name="species_object"
                        rules={[{
                            required: (this.state.speciesAllowed.indexOf(this.state.propertyName) > -1),
                            message: 'Please select specie.'
                        }]}
                    >
                        <Select
                            showSearch
                            onChange={this.onChangeSpecie.bind(this)}
                            mode="multiple"
                            placeholder={'Select Specie'}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            disabled={!(this.state.speciesAllowed.indexOf(this.state.propertyName) > -1)}
                        >
                            {this.state.speciesOptions}
                        </Select>
                    </Form.Item>

                    {this.state.propertyName === 'equivalence ratio' ?
                        <Row>
                            <Row>
                                Fuels and Oxidizers
                            </Row>
                            <Row>

                                <Form.List name="fuel_oxidizer">
                                    {(fields, {add, remove}) => (
                                        <>
                                            {fields.map(field => (
                                                <Space key={field.key} style={{display: 'flex', marginBottom: 8}}
                                                       align="baseline">
                                                    <Form.Item
                                                        {...field}
                                                        name={[field.name, 'specie']}
                                                        fieldKey={[field.fieldKey, 'specie']}
                                                        rules={[{required: true, message: 'Missing specie name.'}]}
                                                        style={{width: 150}}
                                                    >
                                                        <Select
                                                            showSearch
                                                            onChange={this.onChangeSpecie.bind(this)}
                                                            placeholder={'Select Specie'}
                                                            optionFilterProp="children"
                                                            filterOption={(input, option) =>
                                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                            }
                                                        >
                                                            {this.state.speciesOptions}
                                                        </Select>
                                                    </Form.Item>
                                                    <Form.Item
                                                        {...field}
                                                        name={[field.name, 'value']}
                                                        fieldKey={[field.fieldKey, 'value']}
                                                        rules={[{required: true, message: 'Missing property value.'}]}
                                                    >
                                                        <InputNumber
                                                            min={0}
                                                            max={1}
                                                            defaultValue={0}
                                                            style={{width: 100}}
                                                        />
                                                    </Form.Item>
                                                    <Form.Item
                                                        {...field}
                                                        name={[field.name, 'type']}
                                                        fieldKey={[field.fieldKey, 'type']}
                                                        rules={[{required: true, message: 'Missing property type.'}]}
                                                    >
                                                        <Select
                                                            placeholder={"Select type"}
                                                            style={{width: 150}}
                                                        >
                                                            <Select.Option value={'Fuel'}
                                                                           key={'fuel'}>Fuel</Select.Option>
                                                            <Select.Option value={'Oxidizer'}
                                                                           key={'oxidizer'}>Oxidizer</Select.Option>
                                                        </Select>
                                                    </Form.Item>
                                                    <MinusCircleOutlined onClick={() => remove(field.name)}/>
                                                </Space>
                                            ))}
                                            <Form.Item>
                                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}
                                                        style={{width: 350}}>
                                                    Add field
                                                </Button>
                                            </Form.Item>
                                        </>
                                    )}
                                </Form.List>
                            </Row>
                        </Row>
                        :
                        <></>}


                    <Row>
                        <Col span={10}>
                            <Form.Item
                                label="Data Column"
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
                                label="Uncertainty Column"
                                name="uncertaintyData"
                                rules={[{
                                    required: this.state.uncertaintyActive,
                                    message: 'Please insert Uncertainty Column.'
                                }]}
                            >
                                <Input.TextArea
                                    autoSize={{minRows: 5, maxRows: 10}}
                                    placeholder="Insert Uncertainty Column"
                                    allowClear
                                    disabled={!this.state.uncertaintyActive}
                                    onChange={this.onChangeDataUncertainty.bind(this)}/>
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
                                Preview Data Uncertainty:
                            </Row>
                            <Row>
                                <Typography.Text>
                                    [{this.state.propertyDataUncertainty.join(', ')}]
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

export default AddColumnModal;