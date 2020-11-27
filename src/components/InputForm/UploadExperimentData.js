import React from "react";
import {Button, Form, Upload, message, Modal} from "antd";
import {UploadOutlined} from "@ant-design/icons";

const GenericTable = React.lazy(() => import('../GenericTable'));

class UploadExperimentData extends React.Component{
    constructor() {
        super();
        this.state = {
            dataPreviewVisible: false,
            dataFilePreview: null,
            previewType: "",
        }
    }
    onFileDataChange = (info) => {

        if (info.file.status === 'done') {
            message.success(`${info.file.name} data file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} data file upload failed: ${info.file.response}`);
        }
    };

    normFile = (e) => {

        let fileList = e.fileList;

        // 1. Limit the number of uploaded files
        // Only to show two recent uploaded files, and old ones will be replaced by the new
        fileList = fileList.slice(-1);

        // 2. Read from response and show file link
        fileList = fileList.map((file) => {
            if (file.response) {
                // Component will show file.url as link
                file.url = file.response.url;
            }
            return file;
        });

        // 3. Filter successfully uploaded files according to response from server
        // fileList = fileList.filter((file) => {
        //     if (file.response) {
        //         return file.response.status === 'success';
        //     }
        //     return false;
        // });

        return fileList
    };

    handleDataPreview = (file) => {
        console.log(file)
        this.setState({dataPreviewVisible: true, dataFilePreview: file, previewType: this.props.type})
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };

    handleCancel = () => this.setState({dataPreviewVisible: false});

    render() {
        let preview = null;
        if (this.state.previewType === "data") {
            const data_file_preview_names = this.state.dataFilePreview == null ? null : this.state.dataFilePreview.response.names;
            const data_file_preview_data = this.state.dataFilePreview == null ? null : this.state.dataFilePreview.response.data;
            preview = <GenericTable names={data_file_preview_names} data={data_file_preview_data}/>;
        } else if (this.state.previewType === "text") {
            preview = <div dangerouslySetInnerHTML={{__html: this.state.dataFilePreview.response.data}}
                           style={{whiteSpace: "pre-line"}}/>;
        }
        return(
            <>
                <Form.Item
                    name={this.props.name}
                    valuePropName="fileList"
                    getValueFromEvent={this.normFile}
                    rules={[{required: this.props.required, message: 'Please upload File'}]}
                >
                    <Upload
                            multiple={false}
                            name="data"
                            action={window.$API_address + this.props.api}
                            accept={this.props.ext}
                            onChange={this.onFileDataChange}
                            onPreview={this.handleDataPreview}
                            style={{width: "35%"}}
                    >
                        <Button icon={<UploadOutlined />}>Click to upload</Button>
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

export default UploadExperimentData;