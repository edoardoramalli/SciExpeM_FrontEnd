// System import
import React from "react";

// Third parties import
const axios = require('axios');
import Cookies from "js-cookie";
axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');


// Local import
import GenericTable from "../../GenericTable";
import {checkError} from "../../../components/Tool"



class RawData extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            exp_id: this.props.exp_id,
            type: this.props.type,
            data: [],
            header: []
        }
    }
    componentDidMount() {
        axios.post(window.$API_address + 'frontend/api/get_experiment_data_columns/' + this.state.exp_id.toString(),
            {params: {"type": this.state.type}})
            .then(res => {
                const response = res.data;
                let data = response.data;
                let header = response.header
                this.setState({data: data, header: header})
            }).catch(error => {
                checkError(error)
        })
    }
    render() {
        return(
            <GenericTable names={this.state.header} data={this.state.data} />
        )
    }
}

export default RawData;