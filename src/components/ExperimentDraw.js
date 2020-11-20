import React from 'react';
import {Alert} from 'antd';
import './index.css';

import "react-table/react-table.css";
import axios from 'axios';
import 'antd/dist/antd.css';  // or 'antd/dist/antd.less'
import 'react-table/react-table.css'

import {GenericMultiDraw} from "./Components";



class ExperimentDraw extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            response: {},
            error: null,
            exp_id: this.props.exp_id

        }
    }

    render() {
        if (this.state.error) {
            return (
                <Alert message={this.state.error.data} type="warning"/>
            )
        }

        return (
            <GenericMultiDraw response={this.state.response}/>
        );
    }

    componentDidMount() {
        axios.get(window.$API_address + 'frontend/api/experiment/curves/' + this.state.exp_id.toString())
            .then(res => {
                const response = res.data;
                this.setState({response: response});
                // console.log(this.state.response.curves)
            }).catch(error => {
            console.log(error.response);
            this.setState({error: error.response})
        })
    }

}


export default ExperimentDraw;