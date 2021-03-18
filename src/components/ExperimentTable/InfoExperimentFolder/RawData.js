// System import
import React from "react";

// Third parties import
const axios = require('axios');
import Cookies from "js-cookie";
axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');


// Local import
import GenericTable from "../../GenericTable";
import {checkError} from "../../Tool"
import {Col, Empty, Spin} from "antd";



class RawData extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            exp_id: this.props.exp_id,
            type: this.props.type,
            loading: true,
            renderObject: <Col span={1} offset={11}><Spin size="large" tip="Loading..."/></Col>,
        }
    }
    componentDidMount() {
        this.setState({loading: true})
        axios.post(window.$API_address + 'frontend/api/get_experiment_data_columns/' + this.state.exp_id.toString(),
            {params: {"type": this.state.type}})
            .then(res => {
                const response = res.data;
                let data = response.data;
                let header = response.header
                this.setState({renderObject: <GenericTable names={header} data={data}/>})
            }).catch(error => {
                checkError(error)
                this.setState({loading: false, renderObject: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>})
        })
    }
    render() {
        return(
            <>{this.state.renderObject}</>
        )
    }
}

export default RawData;