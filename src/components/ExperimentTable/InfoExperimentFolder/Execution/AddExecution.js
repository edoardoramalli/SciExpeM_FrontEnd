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
            chemModelsSelected: null
        }
    }

    componentDidMount() {
        axios.post(window.$API_address + 'frontend/API/getModelList', {fields: ['id', 'name']})
            .then(res => {
                this.setState({models_options: this.createCheModelOptions(JSON.parse(res.data))})
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

    onClick(){
        if(!this.state.chemModelsSelected){
            message.error('Chem Model is not selected')
            return
        }

        const params = {
            'experiment_id': this.props.experiment.id,
            'chemModel_id': this.state.chemModelsSelected,
        }

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
            }).catch(error => {
                checkError(error)
        })

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
                        <Button
                            type="primary"
                            shape="round"
                            icon={<PlayCircleOutlined />}
                            onClick={this.onClick.bind(this)}
                        >
                            Add Execution and Download Zip
                        </Button>
                    </Row>
                </Space>
            </Modal>
        )
    }
}

export default AddExecution;