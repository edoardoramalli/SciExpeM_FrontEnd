import React from "react";
import {Form, Select} from "antd";

const axios = require('axios');
import Cookies from "js-cookie";
import {checkError} from "../Tool";
axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');


class ExperimentType extends React.Component{
    constructor(props) {
        super(props);
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
                        <Select.Option
                            value={item}
                            style={{"textTransform": "capitalize"}}
                            key={'ExpType' + item.toString()}
                        >
                            {item}
                        </Select.Option>
                    )
                });
                this.setState({options: options})
            }).catch(error => {
            checkError(error)
        })
    }

    onChange = e => {
        this.props.handleExperimentType(e)
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
                    onChange={this.onChange}
                >
                    {this.state.options}
                </Select>
            </Form.Item>
        )
    }
}

export default ExperimentType;