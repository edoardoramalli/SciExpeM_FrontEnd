import React from "react";

import XMLViewer from 'react-xml-viewer'
import {message, Button, Upload, Empty, Spin, Col, Space, Input, Row} from "antd";

import {UploadOutlined, EditOutlined, RollbackOutlined} from "@ant-design/icons";

const axios = require('axios');
import Cookies from "js-cookie";
axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

import {checkError} from "../../Tool"


class ExperimentFile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            exp_id: this.props.exp_id,
            type: this.props.type,
            file: "",
            renderObject: <Col span={1} offset={11}><Spin size="large" tip="Loading..."/></Col>,
            editButton: false,
            cancelButton: true,
            editButtonText: 'Edit',
        }
    }

    uploadFile = options => {

        const {onSuccess, onError, file, onProgress} = options;

        const reader = new FileReader();
        let file_text;
        const scope = this
        reader.readAsText(file);
        reader.onloadend = function (e) {
            file_text = e.target.result
            onSuccess(file);
            const params = {
                'model_name': 'Experiment',
                'element_id': scope.state.exp_id.toString(),
                'property_dict': JSON.stringify({'os_input_file': file_text})
            }
            axios.post(window.$API_address + 'ExperimentManager/API/updateElement', params)
                .then(res => {
                    message.success(`OpenSMOKE file uploaded successfully. Refresh Page.`, 3);
                })
                .catch(error => {
                    checkError(error)
                });
        }
    }

    componentDidMount() {
        let property_name;
        if (this.state.type === "OS") {
            property_name = 'os_input_file'
        } else if (this.state.type === "ReSpecTh") {
            property_name = 'xml_file'
        } else {
            return
        }

        const params = {
            'model_name': 'Experiment',
            'element_id': this.state.exp_id.toString(),
            'property_name': property_name
        }



        axios.post(window.$API_address + 'ExperimentManager/API/requestProperty', params)
            .then(res => {
                if (res.data) {
                    this.setState({file: res.data}, () =>{
                        this.optional_render()
                    })
                }else{
                    this.optional_render()
                }
            })
            .catch(error => {
                checkError(error)
            })


    }
    editButtonClick = () =>{
        console.log(this)
        this.setState({cancelButton: true})
    }

    optional_render = () => {
        let render;
        if (this.state.file) {
            if (this.state.type === "ReSpecTh") {
                render = <XMLViewer xml={this.state.file}/>
            } else if (this.state.type === "OS") {
                render =
                    <>
                        <Col>
                            <Space direction="vertical">
                            <Row>
                                <Space direction="horizontal">
                                    <Button
                                        type="primary" size="large" shape="round"
                                        icon={<EditOutlined />}
                                        disabled={this.state.editButton}
                                        onClick={this.editButtonClick.bind(this)}
                                    >
                                        {this.state.editButtonText}
                                    </Button>
                                    <Button
                                        type="primary" size="large" shape="round"
                                        icon={<RollbackOutlined />}
                                        disabled={this.state.cancelButton}
                                    >
                                        Cancel
                                    </Button>
                                </Space>
                            </Row>
                            <Row>
                                <Space direction="vertical">
                                    <Input.TextArea
                                        style={{width: '92vw'}}
                                        autoSize={{ minRows: 10, maxRows: 100 }}
                                        defaultValue={this.state.file}
                                        disabled={this.state.cancelButton}
                                    />
                                </Space>
                            </Row>

                            </Space>
                        </Col>

                    </>
                    // <div dangerouslySetInnerHTML={{__html: this.state.file}} style={{whiteSpace: "pre-line"}}/>
            }
        } else {
            if (this.state.type === "OS"){
                render =
                    <Upload
                        multiple={false}
                        customRequest={this.uploadFile}
                        showUploadList={
                            {showRemoveIcon: false}
                        }
                        accept={'.dic'}
                    >
                        <Button icon={<UploadOutlined/>}>Upload OpenSMOKE++ File</Button>
                    </Upload>
            }
            else{
                render = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
            }
        }

        this.setState({renderObject: render})

    }

    render() {
        return (
            <>{this.state.renderObject}</>
        )
    }
}

export default ExperimentFile;