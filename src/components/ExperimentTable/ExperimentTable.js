import React from "react";

const axios = require('axios');

// Local Import
import {checkError} from "../Tool"
import BaseTable from "./BaseTable";


class ExperimentTable extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            experiments: [],
            loading: true,
        }
    }

    componentDidMount() {

        const params = {
            fields: ['id', 'reactor', 'experiment_type', 'username',
                'fileDOI', 'status', 'ignition_type', 'experiment_interpreter'],
            args: {}
        }
        axios.post(window.$API_address + 'frontend/API/getExperimentList', params)
            .then(res => {
                const experiments = JSON.parse(res.data)
                this.setState(
                    {
                        experiments: experiments,
                        loading: false,
                        experiments_managed: experiments.filter((exp) => exp.experiment_interpreter != null).length,
                        experiments_valid: experiments.filter((exp) => exp.status === "verified").length
                    }
                )
            })
            .catch(error => {
                this.setState({loading: false})
                checkError(error)
            })

    }


    render() {

        return (
            <BaseTable
                header={true}
                selectHook={undefined}
                experiments_managed={this.state.experiments_managed}
                experiments_valid={this.state.experiments_valid}
                experiments={this.state.experiments}
                loading={this.state.loading}
            />
        )
    }
}

export default ExperimentTable;