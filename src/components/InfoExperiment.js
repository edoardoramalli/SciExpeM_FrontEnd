import React from "react";
import { Descriptions } from 'antd';
import axios from "axios";

class InfoExperiment extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            file_doi: "XXXWWWW",
            username: "edoardo",
            paper_doi: "paper_doi",
            paper_title: "paper_title",
            date_time: "12 GEn 2020",
            reactor: "shock tube",
            experiment_type: "IDT",
            ignition_type: "ignition_type"
        }
        console.log(this.props)
    }

    componentDidMount() {
        const exp_id = this.props.experiment.id;

        axios.get(window.$API_address + 'frontend/api/experiment/info/' + exp_id.toString())
            .then(res => {
                const response = res.data;
                // this.setState({response: response});
                console.log(response)
            }).catch(error => {
                console.log(error.response);
                this.setState({error: error.response})
        })
    }

    render() {
        return(
            <Descriptions title={this.state.name} bordered column={1}>
                <Descriptions.Item label="User Name">Zhou Maomao</Descriptions.Item>
                <Descriptions.Item label="Telephone">1810000000</Descriptions.Item>
                <Descriptions.Item label="Live">Hangzhou, Zhejiang</Descriptions.Item>
                <Descriptions.Item label="Remark">empty</Descriptions.Item>
                <Descriptions.Item label="Address">
                    No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
                </Descriptions.Item>
            </Descriptions>
        )
    }
}

export default InfoExperiment;