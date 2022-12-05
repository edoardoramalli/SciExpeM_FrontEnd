import React from "react";
import {Modal, Row, Select, Button, Space, message} from "antd";
import {checkError} from "../../../Tool";
import {PlayCircleOutlined} from "@ant-design/icons";

const axios = require('axios');
import Cookies from "js-cookie";
axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

class AddExecution extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            models_options: null,
            chemModelsSelected: null,
            chemModelsSelectedBackup: null,
            addExecutionLoading: false,
        }
    }

    componentDidMount() {
        axios.post(window.$API_address + 'ExperimentManager/API/filterDataBase',
            {fields: ['id', 'name'],
            model_name: 'ChemModel',
            query: {}})
            .then(res => {
                this.setState({models_options: this.createCheModelOptions(res.data)})
            }).catch(error => {
            checkError(error)
        })
    }

    createCheModelOptions(model_list) {
        return model_list.map(item => {
            return (<Select.Option key={item['id']} value={item['id']}>{item['name']}</Select.Option>)
        })
    }

    changeModels(value){
        this.setState({chemModelsSelected: value})
    }

    changeModelsBackup(value){
        this.setState({chemModelsSelectedBackup: value})
    }

    onClick = (value) => {
        if(!this.state.chemModelsSelected){
            message.error('Chem Model is not selected')
            return
        }

        const params = {
            'experiment_id': this.props.experiment.id,
            'chemModel_id': this.state.chemModelsSelected,
            'backup_chemModel': this.state.chemModelsSelectedBackup,
            'everything': value,
        }

        this.setState({addExecutionLoading: true})

        axios.get(window.$API_address + 'frontend/API/addExecution',
            {responseType: 'blob', params: params})
            .then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                const file_name = 'Execution_' + this.props.experiment.fileDOI + '_' + this.state.chemModelsSelected + '.zip'
                link.setAttribute('download', file_name);
                document.body.appendChild(link);
                link.click();
                message.success('File downloaded')
                this.props.refreshTable()
                this.props.closeAddExecution()
                this.setState({addExecutionLoading: false})
            }).catch(error => {
            this.setState({addExecutionLoading: false})
            checkError(error)
        })

    }

    createExecution = () =>{
        if (this.state.chemModelsSelected){
            this.setState({addExecutionLoading: true})
            axios.post(window.$API_address + 'OpenSmoke/API/initializeSimulation',
                {experiment: this.props.experiment.id, chemModel: this.state.chemModelsSelected, backup_chemModel: this.state.chemModelsSelectedBackup})
                .then(res => {
                    message.success('Execution successfully created!')
                    this.setState({addExecutionLoading: false})
                    this.props.closeAddExecution()
                    this.props.refreshTable()
                }).catch(error => {
                this.setState({addExecutionLoading: false})
                checkError(error)
            })
        }
        else{
            message.error('Please insert chem Model.')
        }

    }

    render() {
        return(
            <Modal
                title="Add Execution"
                visible={this.props.addExecutionVisible}
                onCancel={this.props.closeAddExecution}
                footer={null}
            >
                <Space direction={'vertical'} size={'large'}>
                    <Row>
                        Select Chem Model:
                    </Row>
                    <Row>
                        <Select
                            showSearch
                            placeholder="Please select Chem Model"
                            style={{width: 400}}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onChange={this.changeModels.bind(this)}
                        >
                            {this.state.models_options}
                        </Select>
                    </Row>
                    <Row>
                        <Select
                            showSearch
                            placeholder="Please select Backup Chem Model"
                            style={{width: 400}}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onChange={this.changeModelsBackup.bind(this)}
                        >
                            {this.state.models_options}
                        </Select>
                    </Row>
                    <Row>
                        <Button
                            type="primary"
                            shape="round"
                            icon={<PlayCircleOutlined />}
                            onClick={this.createExecution}
                            loading={this.state.addExecutionLoading}
                        >
                            Add Execution
                        </Button>
                    </Row>
                    <Row>
                        <Button
                            type="primary"
                            shape="round"
                            icon={<PlayCircleOutlined />}
                            onClick={() =>{this.onClick(true)}}
                            loading={this.state.addExecutionLoading}
                        >
                            Add Execution and Download Zip (Model and OS++ File)
                        </Button>

                    </Row>
                    <Row>
                        <Button
                            type="primary"
                            shape="round"
                            icon={<PlayCircleOutlined />}
                            onClick={() =>{this.onClick(false)}}
                            loading={this.state.addExecutionLoading}
                        >
                            Add Execution and Download Zip (OS++ File)
                        </Button>
                    </Row>
                </Space>
            </Modal>
        )
    }
}

export default AddExecution;