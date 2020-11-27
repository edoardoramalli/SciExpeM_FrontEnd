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
        axios.get(window.$API_address + 'frontend/api/get_reactor_type_list')
            .then(res => {
                const reactor_type_list = res.data.reactor_type_list;
                let options = reactor_type_list.map((item) => {
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
                label="Reactor Type"
                name="reactor_type"
                rules={[{required: true, message: 'Please insert reactor type.'}]}
            >
                <Select
                    placeholder="Select an reactor type"
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