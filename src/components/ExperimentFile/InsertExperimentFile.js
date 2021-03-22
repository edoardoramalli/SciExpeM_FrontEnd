// Built-in import
import React from "react";

// Third-parties import
import {Button, Upload, Space, Statistic, Row, Col} from "antd"
import { UploadOutlined } from '@ant-design/icons';

const axios = require('axios');
import Cookies from "js-cookie";
import {checkError} from "../Tool";
axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

class InsertExperimentFile extends React.Component {
    constructor() {
        super();
        this.state = {
            n_files: 0,
            done: 0,
            error: 0,
            uploading: 0,
        }
    }

    onChangeUpload = (state) => {
        let fileList = state['fileList']
        let i;
        let done = 0;
        let error = 0;
        let uploading = 0;
        let n_files = fileList.length;
        for (i = 0; i < fileList.length; i++) {
            if(fileList[i].status === 'done'){
                done++;
            }
            else if (fileList[i].status === 'error'){
                error++;
            }
            else if (fileList[i].status === 'uploading'){
                uploading++;
            }

        }
        this.setState({
            n_files: n_files,
            done: done,
            error: error,
            uploading: uploading
        })
    }



    render() {

        const uploadFile = options => {

            const { onSuccess, onError, file, onProgress } = options;

            const reader = new FileReader();
            let file_text;
            reader.readAsText(file);
            reader.onloadend = function(e) {
                file_text = e.target.result
                const data = {
                    format_file : 'XML_ReSpecTh',
                    file_text: file_text
                }
                axios
                    .post(window.$API_address + 'ExperimentManager/API/loadExperiment', data)
                    .then(res => {
                        onSuccess(file);
                    })
                    .catch(error=>{
                        file.response = error.response.data
                        onError(file, error.response.data)
                    });
            };



        }

        return(

            <Space direction="vertical" style={{ width: '100%' }} size="large">
                <Row>
                    <Col span={2} offset={1}>
                        <Statistic title="Done" value={this.state.done} suffix={"/ " + this.state.n_files}/>
                    </Col>
                    <Col span={2} offset={3}>
                        <Statistic title="Errors" value={this.state.error} suffix={"/ " + this.state.n_files}/>
                    </Col>
                    <Col span={2} offset={5}>
                        <Statistic title="Uploading" value={this.state.uploading}/>
                    </Col>
                </Row>
                <Row>
                    <Col offset={1} span={16}>
                        <Upload
                            multiple
                            customRequest={uploadFile}
                            showUploadList={
                                {showRemoveIcon: false}
                            }
                            onChange={this.onChangeUpload}
                            accept={'.xml'}
                        >
                            <Button icon={<UploadOutlined />}>Upload ReSpecTh Files</Button>
                        </Upload>
                    </Col>
                </Row>

            </Space>
            )
    }
}


export default InsertExperimentFile;
