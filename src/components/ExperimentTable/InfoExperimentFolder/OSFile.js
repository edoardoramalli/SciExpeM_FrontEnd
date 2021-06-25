import React from "react";

const axios = require('axios');
import Cookies from "js-cookie";
axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

import {checkError} from "../../Tool"
import {Button, Col, Input, message, Row, Space, Spin} from "antd";
import {EditOutlined, RollbackOutlined, SaveOutlined} from "@ant-design/icons";

class OSFile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            exp_id: this.props.exp_id,
            // type: this.props.type,
            file: "",
            // renderObject: <Col span={1} offset={11}><Spin size="large" tip="Loading..."/></Col>,
            editButton: false,
            cancelButton: true,
            editButtonText: 'Edit',
            textChanged: '',
        }
    }

    componentDidMount() {
        const params = {
            'model_name': 'Experiment',
            'element_id': this.state.exp_id.toString(),
            'property_name': 'os_input_file'
        }

        axios.post(window.$API_address + 'ExperimentManager/API/requestProperty', params)
            .then(res => {
                if (res.data) {
                    this.setState({file: res.data}, () =>{
                        // this.optional_render()
                    })
                }else{
                    // this.optional_render()
                }
            })
            .catch(error => {
                checkError(error)
            })


    }

    editButtonClick = () =>{
        if (this.state.editButtonText === 'Edit'){
            this.setState({
                cancelButton: false,
                editButtonText: 'Save',
                textChanged: this.state.file,
                })
        }
        else if (this.state.editButtonText === 'Save'){
            const params = {
                'model_name': 'Experiment',
                'property_dict': JSON.stringify({"os_input_file": this.state.textChanged.toString()}),
                'element_id': this.state.exp_id.toString(),
            }
            axios.post(window.$API_address + 'ExperimentManager/API/updateElement', params)
                .then(res => {
                    message.success('OpenSMOKE input file updated!', 3);
                    this.setState({
                        cancelButton: true,
                        editButtonText: 'Edit',
                        file: this.state.textChanged.toString()})

                }).catch(error => {
                checkError(error)
            })
        }

    }

    cancelButtonClick = () => {
        this.setState({cancelButton: true, editButtonText: 'Edit'})

    }

    textChanged(value){
        this.setState({textChanged: value.target.value})
    }

    render() {
        return(
            <>
                <Col>
                    <Space direction="vertical">
                        <Row>
                            <Space direction="horizontal">
                                <Button
                                    type="primary" size="large" shape="round"
                                    icon={this.state.editButtonText === 'Edit' ? <EditOutlined />: <SaveOutlined />}
                                    disabled={this.state.editButton}
                                    onClick={this.editButtonClick}
                                >
                                    {this.state.editButtonText}
                                </Button>
                                <Button
                                    type="primary" size="large" shape="round"
                                    icon={<RollbackOutlined />}
                                    disabled={this.state.cancelButton}
                                    onClick={this.cancelButtonClick}
                                >
                                    Cancel
                                </Button>
                            </Space>
                        </Row>
                        <Row>
                            <Space direction="vertical">
                                {
                                    this.state.editButtonText === 'Edit'
                                        ?
                                        <div style={{whiteSpace: "pre-line"}}>
                                            {this.state.file}
                                        </div>
                                        :
                                        <Input.TextArea
                                            style={{width: '92vw'}}
                                            autoSize={{ minRows: 10, maxRows: 100 }}
                                            defaultValue={this.state.file}
                                            disabled={this.state.cancelButton}
                                            onChange={this.textChanged.bind(this)}
                                        />

                                }


                            </Space>
                        </Row>

                    </Space>
                </Col>

            </>
        )
    }

}

export default OSFile;