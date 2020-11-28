// Built-in import
import React from "react";

// Third-parties import
import {Form, Button, Collapse, Space, message} from "antd"
import axios from "axios";
import Cookies from "js-cookie";

// Local import
import ExperimentType from "./InputForm/ExperimentType";
import ReactorType from "./InputForm/ReactorType";
import InitialSpecies from "./InputForm/InitialSpecies";
import CommonProperty from "./InputForm/CommonProperty";
import UploadExperimentData from "./InputForm/UploadExperimentData";
import HelpGuide from "./InputForm/HelpGuide";
import Bibliography from "./InputForm/Bibliography";


const csrftoken = Cookies.get('csrftoken');
axios.defaults.headers.post['X-CSRFToken'] = csrftoken;


class ExperimentForm extends React.Component {

    constructor() {
        super();
        this.onFinish = this.onFinish.bind(this)
    }

    onFinish = values => {
        console.log(values)
        axios.post(window.$API_address + 'frontend/input/submit', {
                        params: {"values": values}
                    })
                        .then(res => {

                            // const response = res.data;
                            // const a = response['experiment'];
                            // this.setState({reviewVisible: true, reviewExperiments: [a]})
                            message.success('Experiment added successfully', 3);
                        })
                        .catch(error => {
                            // message.error(error.message + " - " + error.response.message, 3)
                            message.error(error.response.data, 3)

                            // console.log("Start")
                            // console.log(error.response.data);
                            // console.log(error.response.status);
                            // console.log(error.response.headers);
                            // console.log(error.message);
                            // console.log("Finish")
                        })
    }

    render() {

        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                sm: {span: 20, offset: 0},
            },
        };

        return (
            <Form
                onFinish={this.onFinish}
                layout="vertical"
                autoComplete="off"
            >
                <Collapse defaultActiveKey={['1', '2', '3', '4', '5', '6', '7', '8']}>
                    <Collapse.Panel header="General" key="1">
                        <ExperimentType/>
                        <ReactorType/>
                    </Collapse.Panel>
                    <Collapse.Panel header="Common Properties" key="2">
                        <CommonProperty/>
                    </Collapse.Panel>
                    <Collapse.Panel header="Initial Species" key="3">
                        <InitialSpecies/>
                    </Collapse.Panel>
                    <Collapse.Panel header="Varied experimental conditions and measured results" key="4">
                        <Space style={{display: 'flex'}} align="baseline">
                            <UploadExperimentData
                                name={"experimental_data"}
                                type={"data"}
                                api={'frontend/input/data_excel'}
                                ext={".xlsx"}
                                required={true}
                            />
                            <HelpGuide/>
                        </Space>
                    </Collapse.Panel>
                    <Collapse.Panel header="Volume-time profile" key="5">
                        <Space style={{display: 'flex'}} align="baseline">
                            <UploadExperimentData
                                name={"volume_time_data"}
                                type={"data"}
                                api={'frontend/input/data_excel'}
                                ext={".xlsx"}
                                required={false}
                            />
                            <HelpGuide/>
                        </Space>
                    </Collapse.Panel>
                    <Collapse.Panel header="OpenSMOKE input file" key="6">
                        <UploadExperimentData
                            name={"os_input_file"}
                            type={"text"}
                            api={'frontend/input/os_input_file'}
                            ext={".dic"}
                            required={false}
                        />
                    </Collapse.Panel>

                    <Collapse.Panel header="Bibliography" key="7">
                        <Bibliography/>
                    </Collapse.Panel>

                </Collapse>

                <Form.Item {...formItemLayoutWithOutLabel}>

                    <Button type="primary" htmlType="submit" style={{margin: "10px"}} size={"large"}>
                        Submit
                    </Button>

                </Form.Item>
            </Form>
        )
    }
}

export default ExperimentForm;