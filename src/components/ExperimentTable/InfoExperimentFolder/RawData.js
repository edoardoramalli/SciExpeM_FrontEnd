// System import
import React from "react";

// Third parties import
import axios from "axios";
import Cookies from "js-cookie";
import {message} from "antd";

// Local import
import GenericTable from "../../GenericTable";

axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

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
                message.error(error.response.data, 3);
        })
    }
    render() {
        return(
            <GenericTable names={this.state.header} data={this.state.data} />
        )
    }
}

export default RawData;