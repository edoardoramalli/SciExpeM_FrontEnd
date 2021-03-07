// Built-in import
import React from "react";

// Third-parties import
import {Form, Button, Collapse, Space, message, Select, Table, Row} from "antd"

const axios = require('axios');
import Cookies from "js-cookie";
axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

// Local import
import ExperimentType from "./ExperimentType";
import ReactorType from "./ReactorType";
import InitialSpecies from "./InitialSpecies";
import CommonProperty from "./CommonProperty";
import HelpGuide from "./HelpGuide";
import References from "./References";
import IgnitionDefinition from "./IgnitionDefinition";
import Characteristics from "./Characteristics";
import LoadOpenSmokeFile from "./LoadOpenSmokeFile"
import LoadDataColumn from "./LoadDataColumn"
import DataColumns from "./DataColumns";



class ExperimentForm extends React.Component {
    formRef = React.createRef();

    constructor() {
        super();
        this.onFinish = this.onFinish.bind(this)
        this.state = {
            reactor_inactive: true,
            idt: false,
            rcm: false,
            base_active: ['1', '2', '3', '4', '7', '8', '9'],
            active_key: ['1', '2', '3', '4', '7', '8', '9'],
            reactor_value: null,
            experiment: null,
            tableColumns: [],
            dataTableColumns: [],
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
        for(let i in values.experimental_data){
            dc_len.push(values.experimental_data[i]['data'].length)
        }
        if (!dc_len.every( (val, i, arr) => val === arr[0] )){
            message.error("Data columns have different length.")
            return true
        }
        if (!values.volume_time) {
            data_columns = values.experimental_data
        } else {
            data_columns = values.experimental_data.concat(values.volume_time)
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
            volume_time_profile: {},
            // Foreign Key
            data_columns: data_columns,
            common_properties: values.common_properties,
            initial_species: values.initial_species,
            file_paper: {references: values.references, reference_doi: values.reference_doi},

        }
        this.setState({experiment: experiment})
    }


    onFinishFailed = ({values, errorFields}) => {
        this.handleValueForm(values)
        const reducer = (accumulator, currentValue) => accumulator + " " + currentValue.errors;
        const errors = errorFields.reduce(reducer, "")
        message.error("There are some errors in the form! " + errors, 5)

    };

    onFinish = values => {
        const error = this.handleValueForm(values)

        if(!error){
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
                    message.error(error.response.data, 5)
                })
        }

    }

    handleKey = () => {
        this.setState({
            active_key: this.state.base_active
        })
        if (this.state.idt) {
            this.setState({
                active_key: this.state.base_active.concat(['6'])
            })
        }
        if (this.state.idt && this.state.rcm) {
            this.setState({
                active_key: this.state.base_active.concat(['5', '6'])
            })
        }


    }

    // handleDataColumn = text_file => {
    //     this.formRef.current.setFieldsValue({experimental_data: text_file})
    // }

    handleVolumeTime = text_file => {
        this.formRef.current.setFieldsValue({volume_time: text_file})
    }

    handleOSinputFile = (text_file) => {
        this.formRef.current.setFieldsValue({os_input_file: text_file})
    }

    handleDataColumns = data_columns => {
        let data_cols_array = []
        for (let key in data_columns){
            data_cols_array.push(data_columns[key])
        }
        this.formRef.current.setFieldsValue({experimental_data: data_cols_array})
        let columns = []
        let columns_name = []
        let dataSource = []
        const len_cols = data_cols_array.length
        let deep_cols = 0
        for (let i in data_cols_array){
            let title;
            if (data_cols_array[i]['label'] !== undefined){
                title = data_cols_array[i]['name'] + ' - ' + data_cols_array[i]['label'] + ' - ' + '[' + data_cols_array[i]['units']+ ']'
            }
            else{
                title = data_cols_array[i]['name'] +  ' [' + data_cols_array[i]['units']+ ']'
            }
            columns.push({title: title, dataIndex: title, key: title})
            columns_name.push(title)
            if (data_cols_array[i]['data'].length > deep_cols){
                deep_cols = data_cols_array[i]['data'].length
            }
        }
        for(let i=0 ; i < deep_cols; i++) {
            let tmp_dict = {}
            for (let j = 0; j < len_cols; j++) {
                tmp_dict[columns_name[j]] = data_cols_array[j]['data'][i]
            }
            dataSource.push(tmp_dict)
        }
        this.setState({tableColumns: columns, dataTableColumns: dataSource})
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
                    <Collapse.Panel header="General" key="1">
                        <ExperimentType handleExperimentType={this.handleExperimentType}/>
                        <ReactorType {...props_reactor}/>
                    </Collapse.Panel>
                    <Collapse.Panel header="Common Properties" key="2">
                        <CommonProperty/>
                    </Collapse.Panel>
                    <Collapse.Panel header="Initial Species" key="3">
                        <InitialSpecies/>
                    </Collapse.Panel>
                    <Collapse.Panel header="Varied experimental conditions and measured results" key="4">
                        <Row>
                            <Space style={{display: 'flex'}} align="baseline">
                                <DataColumns handleDataColumns={this.handleDataColumns} />
                            </Space>
                        </Row>


                            {/*<LoadDataColumn*/}
                            {/*    name={'experimental_data'}*/}
                            {/*    dataGroup={'dg1'}*/}
                            {/*    required={true}*/}
                            {/*    handleDataColumn={this.handleDataColumn}*/}
                            {/*/>*/}
                            {/*<HelpGuide/>*/}
                            <Row>
                                <Table
                                    title={() => <div style={{textAlign: 'center',
                                        fontWeight: '600', fontSize: 15}}>Preview Table Data Columns</div>}
                                    size='small'
                                    pagination={false}
                                    bordered
                                    columns={this.state.tableColumns}
                                    dataSource={this.state.dataTableColumns}
                                />
                            </Row>
                    </Collapse.Panel>
                    <Collapse.Panel header="Volume-time profile (Only for 'Rapid Compression Machine')" key="5"
                                    disabled={!this.state.rcm} accordion>
                        <Space style={{display: 'flex'}} align="baseline">
                            <LoadDataColumn
                                name={'volume_time'}
                                dataGroup={'dg2'}
                                required={true}
                                handleDataColumn={this.handleVolumeTime}
                            />
                            <HelpGuide/>
                            {/*// todo helph guide deve essere diversa*/}
                        </Space>
                    </Collapse.Panel>
                    <Collapse.Panel header="Ignition definition (Only for 'Ignition Delay Measurement') " key="6"
                                    disabled={!this.state.idt}>
                        <IgnitionDefinition required={this.state.idt}/>
                    </Collapse.Panel>
                    <Collapse.Panel header="OpenSMOKE++ input file" key="7">
                        <LoadOpenSmokeFile
                            required={true}
                            handleOSinputFile={this.handleOSinputFile}
                        />
                    </Collapse.Panel>
                    <Collapse.Panel header="Characteristics" key="8">
                        <Characteristics/>
                    </Collapse.Panel>

                    <Collapse.Panel header="References" key="9">
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