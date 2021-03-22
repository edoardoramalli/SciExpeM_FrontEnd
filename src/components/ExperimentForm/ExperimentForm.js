// Built-in import
import React from "react";

// Third-parties import
import {Form, Button, Collapse, Space, message, Select, Table, Row, InputNumber} from "antd"

const axios = require('axios');
import Cookies from "js-cookie";

axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

// Local import
import ExperimentType from "./ExperimentType";
import ReactorType from "./ReactorType";
import InitialSpecies from "./InitialSpecies";
import CommonProperty from "./CommonProperty";
import References from "./References";
import IgnitionDefinition from "./IgnitionDefinition";
import Characteristics from "./Characteristics";
import LoadOpenSmokeFile from "./LoadOpenSmokeFile"
import DataColumns from "./DataColumns";
import DataGroup from "./DataGroup";
import {zip, checkError} from "../Tool"
import ProfileColumns from "./ProfileColumns";


class ExperimentForm extends React.Component {
    formRef = React.createRef();

    constructor() {
        super();
        this.onFinish = this.onFinish.bind(this)
        this.state = {
            reactor_inactive: true,
            idt: false,
            rcm: false,
            base_active: ['clp1', 'clp2', 'clp3', 'clp4', 'clp5', 'clp8', 'clp9', 'clp10'],
            active_key: ['clp1', 'clp2', 'clp3', 'clp4', 'clp5', 'clp8', 'clp9', 'clp10'],
            reactor_value: null,
            experiment: null,
            tableColumns: [],
            dataTableColumns: [],
            dataGroupAssociation: {},
            dataGroup: 1,
            dataColumns: {},
        }
        this.handleExperimentType = this.handleExperimentType.bind(this);
        this.handleReactorType = this.handleReactorType.bind(this);
    }

    handleValueForm = values => {
        let ignition_type;
        if (values.ignition_definition_measured_quantity && values.ignition_definition_type) {
            ignition_type = values.ignition_definition_measured_quantity + '-' + values.ignition_definition_type
        } else {
            ignition_type = undefined
        }
        let data_columns;
        let dc_len = []
        const experimental_data = values.data_columns
        for (let i in experimental_data) {
            dc_len.push(experimental_data[i]['data'].length)
        }
        // This is checked by BE. bisognerebbe controllare se all'interno dello stesso dg ! non fra tutti
        // if (!dc_len.every((val, i, arr) => val === arr[0])) {
        //     message.error("Data columns have different length.")
        //     return true
        // }
        if (!values.profile_data_column) {
            data_columns = experimental_data
        } else {
            data_columns = experimental_data.concat(values.profile_data_column)
        }
        let experiment = {
            // Model Mandatory
            experiment_type: values.experiment_type,
            reactor: values.reactor,
            fileDOI: values.fileDOI,
            // Model Optional
            comment: values.comment,
            ignition_type: ignition_type,
            fuels: values.fuels,

            p_sup: values.p_profile.p_sup,
            p_inf: values.p_profile.p_inf,
            t_sup: values.t_profile.t_sup,
            t_inf: values.t_profile.t_inf,
            phi_sup: values.phi_profile.phi_sup,
            phi_inf: values.phi_profile.phi_inf,

            os_input_file: values.os_input_file,
            // Foreign Key
            data_columns: data_columns,
            common_properties: values.common_properties,
            initial_species: values.initial_species,
            file_paper: {references: values.references, reference_doi: values.reference_doi},

        }
        this.setState({experiment: experiment})
    }

    getDataGroup(){
        const current = this.state.dataGroup;
        this.setState({dataGroup: current + 1})
        return current
    }


    onFinishFailed = ({values, errorFields}) => {
        this.handleValueForm(values)
        const reducer = (accumulator, currentValue) => accumulator + " " + currentValue.errors;
        const errors = errorFields.reduce(reducer, "")
        message.error("There are some errors in the form! " + errors, 5)

    };

    onFinish = values => {
        const error = this.handleValueForm(values)

        if (!error) {
            const params = {
                'model_name': 'Experiment',
                'property_dict': JSON.stringify(this.state.experiment)
            }

            axios.post(window.$API_address + 'ExperimentManager/API/insertElement', params)
                .then(() => {
                    this.formRef.current.resetFields();
                    message.success('Experiment added successfully', 5);
                })
                .catch(error => {
                    checkError(error)
                })
        }

    }

    handleKey = () => {
        this.setState({
            active_key: this.state.base_active
        })
        if (this.state.idt) {
            this.setState({
                active_key: this.state.base_active.concat(['clp7'])
            })
        }
        if (this.state.idt && this.state.rcm) {
            this.setState({
                active_key: this.state.base_active.concat(['clp6', 'clp7'])
            })
        }


    }


    handleOSinputFile = (text_file) => {
        this.formRef.current.setFieldsValue({os_input_file: text_file})
    }

    addDataColumn = (key, data_column) => {
        let tmp = this.state.dataColumns
        tmp[key] = data_column
        this.setState({dataColumns: tmp})
        this.handleDataColumns(tmp)
    }

    removeDataColumn = (key) =>{
        let tmp = this.state.dataColumns
        if (key in tmp){
            delete tmp[key]
            this.setState({dataColumns: tmp})
            this.handleDataColumns(tmp)
        }
    }

    handleDataColumns = (data_columns) => {
        const data_cols_array = Object.values(data_columns)
        this.previewTableDataColumns(JSON.stringify(data_cols_array))  // JSON is necessary otherwise is passed by reference
        this.formRef.current.setFieldsValue({data_columns: data_cols_array})
    }


    handleProfileColumns = data_columns => {
        const data_cols_array = Object.values(data_columns)
        let result = [];
        data_cols_array.forEach(item =>{item.forEach(col =>{result.push(col)})})
        this.formRef.current.setFieldsValue({profile_data_column: result})
    }

    previewTableDataColumns(columns_list) {
        let columns = JSON.parse(columns_list)
        let columns_table = []
        let columns_name = []
        let dataSource = []
        columns.forEach(col => {
            if (col['uncertainty_reference'] !== undefined) {
                let data = [];
                col['data'].forEach((item, index) => {
                    let text = item.toString() + ' +- ' + col['uncertainty_reference']['data'][index]
                    text = col['uncertainty_reference']['uncertainty_kind'] === 'absolute' ? text : text + ' %'
                    data.push(text)
                })
                col['data'] = data
            }
        })
        columns.forEach(col => {
            let title = col['name'] + ' [' + col['units'] + '] ' + '(' + col['dg_id'] + ') ';
            if (col['label'] !== undefined) {
                title += ' - ' + col['label']
            }
            columns_table.push({title: title, dataIndex: title, key: title})
            columns_name.push(title)
            dataSource.push(col['data'])
        })

        let record = this.createRecord(columns_name, dataSource)

        this.setState({tableColumns: columns_table, dataTableColumns: record})
    }

    createRecord(header_list, data_list_of_lists) {
        let final = []
        if (header_list.length !== data_list_of_lists.length) {
            throw Error('createRecord. Different Length!')
        }
        let zipped = zip(data_list_of_lists)
        zipped.forEach(item => {
            let result = {};
            item.forEach((key, i) => result[header_list[i]] = key)
            final.push(result)
        })
        return final
    }

    handleReactorType = (reactorType) => {
        this.setState({
            reactor_value: reactorType,
            rcm: reactorType === 'rapid compression machine'
        }, () => {
            this.handleKey()
        });
    }

    handleExperimentType = (experimentType) => {
        this.setState(
            {
                idt: false,
                rcm: false,
                reactor_value: undefined
            }
        )

        axios.post(window.$API_address + 'ReSpecTh/API/getReactors', {'experiment_type': [experimentType]})
            .then((res) => {
                const reactor_type_list = res.data;
                let options = reactor_type_list.map((item) => {
                    return (
                        <Select.Option value={item} style={{"textTransform": "capitalize"}}>{item}</Select.Option>
                    )
                });
                this.setState({
                    reactor_inactive: false,
                    reactor_list: options
                })
                if (experimentType === 'ignition delay measurement') {
                    this.setState({idt: true}, () => {
                        this.handleKey()
                    })
                }
                this.handleKey()

            })
            .catch(error => {
                if (error.response.status === 403) {
                    message.error("You don't have the authorization!", 3);
                } else if (error.response.status === 400) {
                    message.error("Bad Request. " + error.response.data, 3);
                } else {
                    message.error(error.response.data, 3);
                }
            })

    }

    onChangeDataGroupAssociation(value) {
        this.setState({dataGroupAssociation: value})
    }

    render() {

        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                sm: {span: 20, offset: 0},
            },
        };

        let props_reactor = {
            'reactor_inactive': this.state.reactor_inactive,
            'reactor_list': this.state.reactor_list,
            'reactor_value': this.state.reactor_value,
            'handleReactorType': this.handleReactorType
        }

        return (
            <Form
                onFinish={this.onFinish}
                onFinishFailed={this.onFinishFailed}
                layout="vertical"
                autoComplete="off"
                ref={this.formRef}
            >
                <Collapse activeKey={this.state.active_key}>
                    <Collapse.Panel header="General" key="clp1">
                        <ExperimentType handleExperimentType={this.handleExperimentType}/>
                        <ReactorType {...props_reactor}/>
                        <Row>
                            <Form.Item name={'data_columns'}/>
                            <Form.Item name={'profile_data_column'}/>
                        </Row>
                    </Collapse.Panel>
                    <Collapse.Panel header="Common Properties" key="clp2">
                        <CommonProperty/>
                    </Collapse.Panel>
                    <Collapse.Panel header="Initial Species" key="clp3">
                        <InitialSpecies/>
                    </Collapse.Panel>
                    <Collapse.Panel header="Data Groups" key="clp4">
                        <DataGroup
                            onChangeDataGroupAssociation={this.onChangeDataGroupAssociation.bind(this)}
                            dataGroupAssociation={this.state.dataGroupAssociation}
                            getDataGroup={this.getDataGroup.bind(this)}
                        />
                    </Collapse.Panel>
                    <Collapse.Panel header="Varied experimental conditions and measured results" key="clp5">
                        <Space direction="vertical">
                            <Row>
                                <Space style={{display: 'flex'}} align="baseline">
                                    <DataColumns
                                        addDataColumn={this.addDataColumn.bind(this)}
                                        removeDataColumn={this.removeDataColumn.bind(this)}
                                        handleDataColumns={this.handleDataColumns.bind(this)}
                                        dataGroupAssociation={this.state.dataGroupAssociation}
                                    />
                                </Space>
                            </Row>

                            <Row>
                                <Table
                                    title={() => <div style={{
                                        textAlign: 'center',
                                        fontWeight: '600', fontSize: 15
                                    }}>Preview Table Data Columns</div>}
                                    size='small'
                                    pagination={false}
                                    bordered
                                    columns={this.state.tableColumns}
                                    dataSource={this.state.dataTableColumns}
                                />
                            </Row>
                        </Space>

                    </Collapse.Panel>
                    <Collapse.Panel header="Profiles (Only for 'Rapid Compression Machine')" key="clp6"
                                    disabled={!this.state.rcm} accordion>
                        <Space direction="vertical">
                            <Row>
                                <Space style={{display: 'flex'}} align="baseline">
                                    <ProfileColumns
                                        handleProfileColumns={this.handleProfileColumns}
                                        getDataGroup={this.getDataGroup.bind(this)}
                                    />
                                </Space>
                            </Row>
                        </Space>
                    </Collapse.Panel>
                    <Collapse.Panel header="Ignition definition (Only for 'Ignition Delay Measurement') "
                                    key="clp7"
                                    disabled={!this.state.idt}>
                        <IgnitionDefinition required={this.state.idt}/>
                    </Collapse.Panel>
                    <Collapse.Panel header="OpenSMOKE++ input file" key="clp8">
                        <LoadOpenSmokeFile
                            required={true}
                            handleOSinputFile={this.handleOSinputFile}
                        />
                    </Collapse.Panel>
                    <Collapse.Panel header="Characteristics" key="clp9">
                        <Characteristics/>
                    </Collapse.Panel>

                    <Collapse.Panel header="References" key="clp10">
                        <References/>
                    </Collapse.Panel>

                </Collapse>

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
            </Form>
        )
    }
}

export default ExperimentForm;