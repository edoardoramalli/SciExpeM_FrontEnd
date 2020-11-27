import React from "react";
import {Form, Select} from "antd";
import axios from "axios";

class ExperimentType extends React.Component{
    constructor() {
        super();
        this.state = {
            options: null
        }
    }
    componentDidMount() {
        axios.get(window.$API_address + 'frontend/api/get_experiment_type_list')
            .then(res => {
                const experiment_type_list = res.data.experiment_type_list;
                let options = experiment_type_list.map((item) => {
                    return(
                        <Select.Option value={item} style={{"textTransform": "capitalize"}}>{item}</Select.Option>
                    )
                });
                this.setState({options: options})
            }).catch(error => {
            console.log(error.response);
        })
    }

    render() {
        return(
            <Form.Item
                label="Experiment Type"
                name="experiment_type"
                rules={[{required: true, message: 'Please insert experiment type.'}]}
            >
                <Select
                    placeholder="Select an experiment type"
                    allowClear={true}
                    style={{width: "35%"}}
                >
                    {this.state.options}
                </Select>
            </Form.Item>
        )
    }
}

export default ExperimentType;