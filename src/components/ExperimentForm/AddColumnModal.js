import React from "react";
import {Alert, Cascader, Col, Form, Button, Input, Modal, Row, Select, Space, Typography, message} from "antd";

const axios = require('axios');
import Cookies from "js-cookie";
axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');


class AddColumnModal extends React.Component {

    property_list = {
        'temperature': 'K',
        'pressure': ['Pa', 'kPa', 'MPa', 'Torr', 'torr', 'bar', 'mbar', 'atm'],
        'ignition delay': ['s', 'ms', 'us', 'ns', 'min'],
        'composition': ['mole fraction', 'percent', 'ppm', 'ppb'],
        'laminar burning velocity': ['m/s', 'dm/s', 'cm/s', 'mm/s', 'm s-1', 'dm s-1', 'cm s-1', 'mm s-1'],
        'volume': ['m3', 'dm3', 'cm3', 'mm3', 'L'],
        'time': ['s', 'ms', 'us', 'ns', 'min'],
        'residence time': ['s', 'ms', 'us', 'ns', 'min'],
        'distance': ['m', 'dm', 'cm', 'mm'],
        'rate coefficient': ['s-1', 'm3 mol-1 s-1', 'dm3 mol-1 s-1', 'cm3 mol-1 s-1', 'm3 molecule-1 s-1',
            'dm3 molecule-1 s-1', 'cm3 molecule-1 s-1', 'm6 mol-3 s-1', 'dm6 mol-2 s-1',
            'cm6 mol-2 s-1', 'm6 molecule-2 s-1', 'dm6 molecule-2 s-1', 'cm6 molecule-2 s-1'],
        'equivalence ratio': [],
        'length': ['m', 'dm', 'cm', 'mm'],
        'density': ['g m-3', 'g dm-3', 'g cm-3', 'g mm-3', 'kg m-3', 'kg dm-3', 'kg cm-3', 'kg mm-3'],
        'flow rate': ['g m-2x s-1', 'g dm-2 s-1', 'g cm-2 s-1', 'g mm-2 s-1', 'kg m-2 s-1', 'kg dm-2 s-1', 'kg cm-2 s-1', 'kg mm-2 s-1'],
        'concentration': ['mol/m3', 'mol/dm3', 'mol/cm3', 'mol m-3', 'mol dm-3', 'mol cm-3', 'molecule/m3', 'molecule/dm3', 'molecule/cm3', 'molecule m-3', 'molecule dm-3', 'molecule cm-3'],
        'uncertainty': []
    }

    constructor(props) {
        super(props);
        this.state = {
            propertyName: null,
            propertyUnit: null,
            propertySpecie: null,
            propertyPlotScale: null,
            propertyData: [],
            propertyObject: null,
            speciesOptions: null,
            speciesAllowed: ['composition', 'concentration']
        }
    }

    componentDidMount() {
        axios.get(window.$API_address + 'frontend/api/opensmoke/species_names')
            .then(res => {
                let speciesOptions = res.data.names.map((item) => {
                    return (
                        <Select.Option
                            value={item}
                            key={item}
                        >
                            {item}
                        </Select.Option>
                    )
                });
                this.setState({speciesOptions: speciesOptions, propertyObject: this.createOptions()})
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
            placeholder="Please select"
            showSearch={this.filter}
        />)
    }

    onChangePropertyName(value) {
        this.setState({propertyName: value[0], propertyUnit: value[1]})
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

    extractData(dataString){
        const a = dataString.trim().split("\n")
        let result = []
        if (a.length > 0) {
            for (let i in a) {
                result.push(parseFloat(a[i]))
            }
        }
        for (let i in result) {
            if (result[i] === false || Number.isNaN(result[i])) {
                result = []
            }
        }
        return result
    }

    onChangeData = ({target: {value}}) => {
        this.setState({propertyData: this.extractData(value)})
    }

    onFinish = (values) => {
        let species_label;
        let species_array;
        if (values.species && this.state.speciesAllowed.indexOf(values.property[0]) > -1){
            species_label = '[' + values.species.toString() + ']'
            species_array = [values.species]
        }
        else{
            species_label = undefined
            species_array = undefined
        }

        let data = this.extractData(values.data)
        if (data.length === 0){
            message.error("Data field is empty or contains abnormal values.")
            return
        }

        let data_column = {
            name: values.property[0],
            units: values.property[1],
            data: data,
            dg_id: this.props.dg_id,
            ignore: false,
            label: species_label,
            species: species_array,
            plotscale: values.plotscale,
        }
        this.props.handleModal({index: this.props.index, data_column: data_column})
    };

    onFinishFailed = ({values, errorFields}) => {
        const reducer = (accumulator, currentValue) => accumulator + " " + currentValue.errors;
        const errors = errorFields.reduce(reducer, "")
        message.error("There are some errors in the form! " + errors, 5)
    };

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
                    <Form.Item
                        label="Property"
                        name="property"
                        rules={[{required: true, message: 'Please select property.'}]}
                    >
                        {this.state.propertyObject}
                    </Form.Item>

                    <Form.Item
                        label="Specie"
                        name="species"
                        rules={[{
                            required: (this.state.speciesAllowed.indexOf(this.state.propertyName) > -1),
                            message: 'Please select specie.'
                        }]}
                    >
                        <Select
                            showSearch
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

                    <Form.Item
                        label="Plot Scale"
                        name="plotscale"
                        rules={[{required: true, message: 'Please insert Plot Scale.'}]}
                    >
                        <Select
                            placeholder={'Select Plot Scale'}
                        >
                            <Select.Option value="lin">Lin</Select.Option>
                            <Select.Option value="log10">Log10</Select.Option>
                            <Select.Option value="ln">Ln</Select.Option>
                            <Select.Option value="inv">Inv</Select.Option>
                        </Select>
                    </Form.Item>

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