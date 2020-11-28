import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import XMLViewer from 'react-xml-viewer'
import {Collapse, message, Form, Button} from "antd";
import UploadExperimentData from "../InputForm/UploadExperimentData";

const csrftoken = Cookies.get('csrftoken');
axios.defaults.headers.post['X-CSRFToken'] = csrftoken;

class ExperimentFile extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            exp_id: this.props.exp_id,
            type: this.props.type,
            file: "",
            render: null
        }
    }

    onFinish = values => {
        console.log(values)
        axios.post(window.$API_address + 'ExperimentManager/API/insertOSFile/' + this.state.exp_id.toString(), {
            params: {"values": values}
        })
            .then(res => {

                // const response = res.data;
                // const a = response['experiment'];
                // this.setState({reviewVisible: true, reviewExperiments: [a]})
                message.success('OS input file added successfully', 3);
            })
            .catch(error => {
                // message.error(error.message + " - " + error.response.message, 3)
                if (error.response.status === 403){
                    message.error("You don't have the authorization to update an experiment!", 3)
                }
                else{
                    message.error(error.response.data, 3)
                }


                // console.log("Start")
                // console.log(error.response.data);
                // console.log(error.response.status);
                // console.log(error.response.headers);
                // console.log(error.message);
                // console.log("Finish")
            })
    }
    componentDidMount() {

        axios.post(window.$API_address + 'frontend/api/get_experiment_file/' + this.state.exp_id.toString(),
            {params: {"type": this.state.type}})
            .then(res => {
                const response = res.data;
                let file = response.file;
                if (file === null){
                    file = "No file."
                    file =
                        <Form
                            onFinish={this.onFinish}
                        >
                            <UploadExperimentData
                                name={"os_input_file"}
                                type={"text"}
                                api={'frontend/input/os_input_file'}
                                ext={".dic"}
                                required={true}
                            />
                            <Button type="primary" htmlType="submit" style={{margin: "10px"}} size={"large"}>
                                Submit
                            </Button>
                        </Form>

                    this.setState({render: file })
                }

                else{
                    if (this.state.type === "ReSpecTh"){
                        this.setState({render: <XMLViewer xml={file} />})
                    }
                    else if (this.state.type === "OS"){
                        this.setState(
                            {render: <div
                                    dangerouslySetInnerHTML={{__html: file}}
                                    style={{whiteSpace: "pre-line"}}/>})
                    }

                }
            }).catch(error => {
                message.error(error.response.data, 3);
        })
    }
    render() {

        return(<>{this.state.render}</>)

    }

}

export default ExperimentFile;