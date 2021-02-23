import React from "react";
import {Button, Form, Upload, message, Modal} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import Cookies from "js-cookie";
import axios from "axios";

const GenericTable = React.lazy(() => import('../GenericTable'));

const csrftoken = Cookies.get('csrftoken');
axios.defaults.headers.post['X-CSRFToken'] = csrftoken;

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

        const { onSuccess, onError, file, onProgress } = options;

        const config = {
            headers: {
                "X-CSRFToken": csrftoken,
            'Content-Type': 'multipart/form-data'
            }
        };

        const formData = new FormData();
        formData.append('file',file)
        formData.append('data_group', this.props.dataGroup)


        axios
            .post(window.$API_address + 'frontend/input/data_excel', formData, config)
            .then(res => {
                message.success(`Data file uploaded successfully`, 3);
                onSuccess(file);
                this.props.handleDataColumn(res.data.serialized)
                this.setState({
                    data: res.data.data,
                    names: res.data.names
                })
            })
            .catch(error => {
                const text_error = 'HTTP ' + error.response.status + ' --> ' + error.response.data
                message.error(text_error, 3);
                onError(error, text_error, file);
            });
    }

    render() {


        const preview = <GenericTable names={this.state.names} data={this.state.data}/>;

        return(
            <>
                <Form.Item
                    name={this.props.name}
                    rules={[{required: this.props.required, message: 'Please upload input file.'}]}
                >
                    <Upload
                        multiple={false}
                        accept={'.xlsx'}
                        customRequest={this.uploadFile}
                        showUploadList={
                            {showRemoveIcon: false}
                        }
                        onPreview={this.handleDataPreview}
                    >
                        <Button icon={<UploadOutlined />}>Upload File</Button>
                    </Upload>
                </Form.Item>
                <Modal visible={this.state.dataPreviewVisible} footer={null} width={800}
                       onCancel={this.handleCancel}>
                    {preview}
                </Modal>
            </>
        )
    }
}

export default LoadDataColumn;