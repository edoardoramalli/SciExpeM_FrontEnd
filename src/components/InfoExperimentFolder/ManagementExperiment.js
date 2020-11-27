import React from "react";
import {Button, message} from "antd";

import {CheckOutlined} from "@ant-design/icons";
import axios from "axios";


class ManagementExperiment extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            exp_id: this.props.exp_id
        }
    }
    ok(){
        axios.get(window.$API_address + 'ExperimentManager/API/validateExperiment/' + this.state.exp_id.toString())
            .then(res => {
                message.success('Validation successful! Reload page to see the effects', 3);
            }).catch(error => {
                message.error(error, 3);
        })
    }

    render() {
        return(
            <Button
                icon={<CheckOutlined />}
                onClick={this.ok.bind(this)}
            >
                Validate Experiment
            </Button>
        )
    }
}

export default ManagementExperiment;