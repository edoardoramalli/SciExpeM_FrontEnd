import React from "react";
const axios = require('axios');
import Cookies from "js-cookie";
import XMLViewer from 'react-xml-viewer'
import {message, Form, Button, Upload} from "antd";

import {UploadOutlined} from "@ant-design/icons";

const csrftoken = Cookies.get('csrftoken');
axios.defaults.headers.post['X-CSRFToken'] = csrftoken;

import checkError from "../../../components/Tool"


class ExperimentFile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            exp_id: this.props.exp_id,
            type: this.props.type,
            file: "",
            render: null
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
                'model_name': ['Experiment'],
                'id': [scope.state.exp_id.toString()],
                'property': [JSON.stringify({'os_input_file': file_text})]
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
            'model_name': ['Experiment'],
            'id': [this.state.exp_id.toString()],
            'property': [property_name]
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
                message.error(error.response.data, 3);
            })


    }

    optional_render = () => {
        let render;
        if (this.state.file) {
            if (this.state.type === "ReSpecTh") {
                render = <XMLViewer xml={this.state.file}/>
            } else if (this.state.type === "OS") {
                render = <div dangerouslySetInnerHTML={{__html: this.state.file}} style={{whiteSpace: "pre-line"}}/>
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
                render = 'No file.'
            }
        }

        this.setState({render: render})

    }

    render() {
        return (
            <>{this.state.render}</>
        )
    }
}

export default ExperimentFile;