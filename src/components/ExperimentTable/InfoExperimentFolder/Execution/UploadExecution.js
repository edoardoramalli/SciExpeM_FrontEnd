import React from "react";

const axios = require('axios');
import Cookies from "js-cookie";
axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

import {Button, Form, Divider, Modal, message, Upload} from "antd";
import {checkError} from "../../../Tool";
import {UploadOutlined} from "@ant-design/icons";


class  UploadExecution extends React.Component{
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            formItems: null,
            dataPreviewVisible: false,
            file: '',
            listFiles: this.props.listFiles,
            uploadLoading: false,
        }
    }

    createItems(){
        let options = this.props.listFiles.map(item =>{
            return(
                <Form.Item
                    label={item}
                    name={item}
                    rules={[{required: true, message: 'Please insert ' + item + ' file.'}]}
                >
                    <Upload
                        multiple={false}
                        customRequest={this.uploadFile}
                        showUploadList={{showRemoveIcon: false}}
                        onPreview={this.handleDataPreview}
                        accept={'.out'}
                        name={item}
                    >
                        <Button icon={<UploadOutlined />}>Upload File</Button>
                    </Upload>
                    <Divider />

                </Form.Item>
            )
        })
        return options

    }

    uploadFile = options => {

        const { onSuccess, onError, file, onProgress, filename } = options;

        const reader = new FileReader();
        let file_text;
        const scope = this
        reader.readAsText(file);
        reader.onloadend = function(e) {
            file_text = e.target.result
            onSuccess(file);
            message.success(`File uploaded successfully`, 3);
            scope.setState({file: file_text});
            scope.formRef.current.setFieldsValue({[filename]: e.target.result})
        }
    }

    onFinish(value){
        this.setState({uploadLoading: true})
        axios.post(window.$API_address + 'frontend/API/addExecutionFiles',
            {execution_id: this.props.execution_id, files: value})
            .then(res => {
                message.success('Execution Files updated successfully!')
                this.setState({uploadLoading: false})
                this.props.uploadExecutionNotVisible()
                this.props.refreshTable()
            })
            .catch(error => {
                this.setState({uploadLoading: false})

                checkError(error)
            })
    }

    onFinishFailed = ({values, errorFields}) => {
        const reducer = (accumulator, currentValue) => accumulator + " " + currentValue.errors;
        const errors = errorFields.reduce(reducer, "")
        message.error("There are some errors in the form! " + errors, 5)

    };

    handleCancel = () => this.setState({dataPreviewVisible: false});

    handleDataPreview = (file) => {this.setState({dataPreviewVisible: true})};


    render() {

        const preview = <div dangerouslySetInnerHTML={{__html: this.state.file}}
                             style={{whiteSpace: "pre-line"}}/>;

        return(
            <Modal
                title="Add Simulation Files"
                visible={this.props.uploadExecutionVisible}
                onCancel={this.props.uploadExecutionNotVisible}
                footer={null}
            >
                <Modal visible={this.state.dataPreviewVisible} footer={null} width={800}
                       onCancel={this.handleCancel}>
                    {preview}
                </Modal>
                <Form
                    onFinish={this.onFinish.bind(this)}
                    onFinishFailed={this.onFinishFailed}
                    layout="vertical"
                    autoComplete="off"
                    ref={this.formRef}
                >
                    {this.createItems()}
                    <Form.Item>

                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{margin: "10px"}}
                            size={"large"}
                            loading={this.state.uploadLoading}
                        >
                            Upload Files
                        </Button>

                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}

export default UploadExecution;