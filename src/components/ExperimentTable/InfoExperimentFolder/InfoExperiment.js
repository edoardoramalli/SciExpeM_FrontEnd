import React from "react";
import {Descriptions, Empty} from 'antd';

const axios = require('axios');
import Cookies from "js-cookie";
axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

import HyperLink from "../../HyperLink";

import "./styles.less"
import {checkError} from "../../Tool";

class InfoExperiment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            exp: this.props,
            status: "None",
            comment: 'loading...'
        }
    }

    componentDidMount() {
        const params = {
            'model_name': 'Experiment',
            'element_id': this.state.exp.props.id,
            'property_name': 'comment'
        }
        axios.post(window.$API_address + 'ExperimentManager/API/requestProperty', params)
            .then(res => {
                this.setState({comment: res.data})
            }).catch(error => {
            checkError(error)
            this.setState({comment: 'Error loading comment'})
        })
    }

    render() {
        return (
            <div className={"description"}>
                <Descriptions
                    title="General"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="Experiment DOI">
                        {<HyperLink link={this.state.exp.props.fileDOI}/>}
                    </Descriptions.Item>
                    <Descriptions.Item label="Author">{this.state.exp.props.username}</Descriptions.Item>
                    <Descriptions.Item label="Status">{this.state.exp.props.status}</Descriptions.Item>
                    <Descriptions.Item
                        label="Interpreter">{this.state.exp.props.experiment_interpreter}</Descriptions.Item>
                    <Descriptions.Item label="Experiment ID">{this.state.exp.props.id}</Descriptions.Item>
                    <Descriptions.Item
                        label="Experiment Type">{this.state.exp.props.experiment_type}</Descriptions.Item>
                    <Descriptions.Item label="Reactor">{this.state.exp.props.reactor}</Descriptions.Item>
                    <Descriptions.Item label="Ignition Type">{this.state.exp.props.ignition_type}</Descriptions.Item>
                    <Descriptions.Item label="Comment">{this.state.comment}</Descriptions.Item>
                </Descriptions>
            </div>

        )
    }
}

export default InfoExperiment;