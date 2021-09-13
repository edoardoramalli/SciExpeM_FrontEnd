import React from "react";
import {Button, Form, Upload, message, Modal, Select, Row, Space} from "antd";
import {UploadOutlined} from "@ant-design/icons";

const axios = require('axios');
import Cookies from "js-cookie";
axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

// const GenericTable = React.lazy(() => import('../GenericTable'));

import GenericTable from "../GenericTable";


class LoadDataColumn extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            dataPreviewVisible: false,
            file: null,
            names: null,
            data: null,
        }
    }


    handleDataPreview = (file) => {
        this.setState({
            dataPreviewVisible: true
        })
    };

    handleCancel = () => this.setState({dataPreviewVisible: false});

    uploadFile = options => {

        // const { onSuccess, onError, file, onProgress } = options;
        //
        // const config = {
        //     headers: {
        //         "X-CSRFToken": csrftoken,
        //     'Content-Type': 'multipart/form-data'
        //     }
        // };
        //
        // const formData = new FormData();
        // formData.append('file',file)
        // formData.append('data_group', this.props.dataGroup)

        const { onSuccess, onError, file, onProgress } = options;

        const reader = new FileReader();
        let file_text;
        const scope = this
        reader.readAsText(file);
        reader.onloadend = function(e) {
            file_text = e.target.result
            axios
                .post(window.$API_address + 'frontend/API/getProfile', {data: file_text})
                .then(res => {
                    console.log(res)
                    message.success(`Profile uploaded successfully`, 3);
                    onSuccess(file);
                })
                .catch(error => {

                });
            onSuccess(file);
            scope.setState({file: file_text});
            // scope.props.handleOSinputFile(file_text)
        }


    }

    render() {


        const preview = <GenericTable names={this.state.names} data={this.state.data}/>;

        return(
            <Row>
                <Space>
                    <Form.Item
                        name={'dg_label'}
                        rules={[{required: this.props.required, message: 'Missing Profile Type'}]}
                    >
                        <Select
                            placeholder={'Select Profile Type'}
                            style={{width: 200}}
                        >
                            <Select.Option value="V-t history">volume-time history</Select.Option>
                            <Select.Option value="p-t history">pressure-time history</Select.Option>
                            <Select.Option value="T-t history">temperature-time history</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name={this.props.name}
                        rules={[{required: this.props.required, message: 'Please upload input file.'}]}
                    >
                        <Upload
                            multiple={false}
                            accept={'.csv'}
                            customRequest={this.uploadFile}
                            showUploadList={
                                {showRemoveIcon: false}
                            }
                            onPreview={this.handleDataPreview}
                        >
                            <Button icon={<UploadOutlined />}>Upload File</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        name={'data_group_profile'}
                        rules={[{required: this.props.required, message: 'Please insert DataPointLink.'}]}
                    >
                        <Select mode="tags"  placeholder="Select Rows">
                        </Select>
                    </Form.Item>




                    <Modal visible={this.state.dataPreviewVisible} footer={null} width={800}
                           onCancel={this.handleCancel}>
                        {preview}
                    </Modal>
                </Space>
            </Row>
        )
    }
}

export default LoadDataColumn;