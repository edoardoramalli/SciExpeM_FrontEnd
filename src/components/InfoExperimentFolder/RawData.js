import React from "react";
import axios from "axios";
import GenericTable from "../GenericTable";
import Cookies from "js-cookie";

const csrftoken = Cookies.get('csrftoken');
axios.defaults.headers.post['X-CSRFToken'] = csrftoken;

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
                const data = response.data;
                const header = response.header

                this.setState({data: data, header: header})
            }).catch(error => {
            console.log(error.response);
        })
    }
    render() {
        return(
            <GenericTable names={this.state.header} data={this.state.data} />
        )
    }
}

export default RawData;