import React from "react";

import {message, Tabs} from "antd";
import VisualizeTwoCluster from "./VisualizeTwoCluster";
import BaseTable from "../ExperimentTable/BaseTable";
import {checkError} from "../Tool";

const axios = require('axios');
import Cookies from "js-cookie";

axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');


class ExperimentListTable extends React.Component {

    constructor() {
        super();

        this.state = {
            experiments: [],
            loading: false,
        }
    }

    componentDidMount() {
        this.setState({loading: true, experimentSelected: []})
        console.log(this.props.exp_list_id)
        const params = {
            fields: ['id', 'reactor', 'experiment_type', 'username',
                'fileDOI', 'status', 'ignition_type', 'interpreter_name'],
            args: {
                'id__in': this.props.exp_list_id,
            }
        }
        axios.post(window.$API_address + 'frontend/API/getExperimentList', params)
            .then(res => {
                message.success('Filter successful! Please select the experiments in the following tab.');
                const experiments = JSON.parse(res.data)
                this.setState({experiments: experiments, loading: false,})
            })
            .catch(error => {
                this.setState({loading: false})
                checkError(error)
            })
    }

    render() {


        return (
            <BaseTable
                header={false}
                experiments={this.state.experiments}
                loading={this.state.loading}
                excludedColumns={['Action', 'Status']}
                // selectHook={this.experimentSelection.bind(this)}
            />
        )
    }

}

export default ExperimentListTable;