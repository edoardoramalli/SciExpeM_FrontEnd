import React from "react";
import {Button, Form, Upload, message, Modal} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import XMLViewer from "react-xml-viewer";


class LoadFile extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            dataPreviewVisible: false,
            file: null,
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

        const reader = new FileReader();
        let file_text;
        const scope = this
        reader.readAsText(file);
        reader.onloadend = function(e) {
            file_text = e.target.result
            onSuccess(file);
            message.success(`File uploaded successfully`, 3);
            scope.setState({file: file_text});
            scope.props.handleFile(file_text)
        }
    }

    render() {


        const preview = <XMLViewer xml={this.state.file}/>

        return(
            <>
                <Form.Item
                    label={this.props.name}
                    name={this.props.labelForm}
                    rules={[{required: this.props.required, message: 'Please upload ' + this.props.name +' file.'}]}
                >
                    <Upload
                        multiple={false}
                        customRequest={this.uploadFile}
                        showUploadList={
                            {showRemoveIcon: false}
                        }
                        onPreview={this.handleDataPreview}
                        accept={'.xml'}
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

export default LoadFile;