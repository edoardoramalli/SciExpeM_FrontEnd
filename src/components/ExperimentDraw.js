import React from 'react';
import {Alert} from 'antd';

import axios from 'axios';


import GenericMultiDraw from "./GenericMultiDraw";



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
            }).catch(error => {
                this.setState({error: error.response})
        })
    }

}


export default ExperimentDraw;