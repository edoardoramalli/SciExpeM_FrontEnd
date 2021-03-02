import React from "react";
import {Button, Form, Upload, message, Modal} from "antd";
import {UploadOutlined} from "@ant-design/icons";


class LoadOpenSmokeFile extends React.Component{

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
            message.success(`OpenSMOKE file uploaded successfully`, 3);
            scope.setState({file: file_text});
            scope.props.handleOSinputFile(file_text)
        }
    }

    render() {


        const preview = <div dangerouslySetInnerHTML={{__html: this.state.file}}
                           style={{whiteSpace: "pre-line"}}/>;

        return(
            <>
                <Form.Item
                    name={'os_input_file'}
                    rules={[{required: this.props.required, message: 'Please upload OpenSMOKE input file.'}]}
                >
                    <Upload
                        multiple={false}
                        customRequest={this.uploadFile}
                        showUploadList={
                            {showRemoveIcon: false}
                        }
                        onPreview={this.handleDataPreview}
                        accept={'.dic'}
                    >
                        <Button icon={<UploadOutlined />}>Upload OpenSMOKE++ File</Button>
                    </Upload>
                    {/*<Upload*/}
                    {/*    multiple={false}*/}
                    {/*    name="data"*/}
                    {/*    action={window.$API_address + this.props.api}*/}
                    {/*    accept={this.props.ext}*/}
                    {/*    headers={{"X-CSRFToken": csrftoken}}*/}
                    {/*    onChange={this.onFileDataChange}*/}
                    {/*    onPreview={this.handleDataPreview}*/}
                    {/*    style={{width: "35%"}}*/}
                    {/*>*/}
                    {/*    <Button icon={<UploadOutlined />}>Click to upload</Button>*/}
                    {/*</Upload>*/}
                </Form.Item>
                <Modal visible={this.state.dataPreviewVisible} footer={null} width={800}
                       onCancel={this.handleCancel}>
                    {preview}
                </Modal>
            </>
        )
    }
}

export default LoadOpenSmokeFile;