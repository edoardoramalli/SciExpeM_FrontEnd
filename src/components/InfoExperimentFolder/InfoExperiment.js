import React from "react";
import { Descriptions } from 'antd';
import axios from "axios";


import HyperLink from "../HyperLink";

import "./styles.less"

class InfoExperiment extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            exp: this.props,
            author: "None",
            date: "None",
            status: "None"
        }
    }

    componentDidMount() {
        const exp_id = this.state.exp.props.id;

        axios.get(window.$API_address + 'frontend/api/experiment/info/' + exp_id.toString())
            .then(res => {
                const response = res.data;
                this.setState({
                    author: response.author,
                    date: response.date});
            }).catch(error => {
                console.log(error.response);
        })
    }

    renderSpecies() {
        return this.state.exp.props.initial_species.map((species) => {
            return (
                <>
                    <Descriptions.Item label={"Name"}>{species.name}</Descriptions.Item>
                    <Descriptions.Item label={"Value"}>{species.value}</Descriptions.Item>
                    <Descriptions.Item label={"Units"}>{species.units}</Descriptions.Item>
                    <Descriptions.Item label={"ID"}>{species.id}</Descriptions.Item>

                </>
            );
        });
    }

    renderCommonProperties() {
        return this.state.exp.props.common_properties.map((property) => {
            return (
                <>
                    <Descriptions.Item label={"Name"}>{property.name}</Descriptions.Item>
                    <Descriptions.Item label={"Value"}>{property.value}</Descriptions.Item>
                    <Descriptions.Item label={"Units"}>{property.units}</Descriptions.Item>
                    <Descriptions.Item label={"ID"}>{property.id}</Descriptions.Item>
                </>
            );
        });
    }

    render() {
        return(
            <div className={"description"}>
                <Descriptions
                    title={<HyperLink link={this.state.exp.props.fileDOI}/>}
                    bordered
                    column={2}
                    className={"description"}
                >
                    <Descriptions.Item label="Author" >{this.state.author}</Descriptions.Item>
                    <Descriptions.Item label="Creation Date" >{this.state.date}</Descriptions.Item>
                    <Descriptions.Item label="Status" >{this.state.exp.props.status}</Descriptions.Item>
                    <Descriptions.Item label="Classifier">{this.state.exp.props.experiment_classifier}</Descriptions.Item>
                    <Descriptions.Item label="Experiment ID" >{this.state.exp.props.id}</Descriptions.Item>
                    <Descriptions.Item label="Experiment Type">{this.state.exp.props.experiment_type}</Descriptions.Item>
                    <Descriptions.Item label="Reactor">{this.state.exp.props.reactor}</Descriptions.Item>
                    <Descriptions.Item label="Ignition Type">{this.state.exp.props.ignition_type}</Descriptions.Item>
                </Descriptions>

                <br />

                <Descriptions title={"Characteristics"} bordered column={3}>
                    <Descriptions.Item label="Experiment Type">{this.state.exp.props.experiment_type}</Descriptions.Item>
                    <Descriptions.Item label="Reactor">{this.state.exp.props.reactor}</Descriptions.Item>
                    <Descriptions.Item label="Fuels">{this.state.exp.props.fuels ? this.state.exp.props.fuels.toString() : null}</Descriptions.Item>
                    <Descriptions.Item label="Equivalent Ratio">[{this.state.exp.props.phi_inf} - {this.state.exp.props.phi_sup}]</Descriptions.Item>
                    <Descriptions.Item label="Temperature Profile [K]">[{this.state.exp.props.t_inf} - {this.state.exp.props.t_sup}]</Descriptions.Item>
                    <Descriptions.Item label="Pressure Profile [Bar]">[{this.state.exp.props.p_inf} - {this.state.exp.props.p_sup}]</Descriptions.Item>
                </Descriptions>

                <br />

                <Descriptions title={"Common Properties"} bordered column={4}>
                    {this.renderCommonProperties()}
                </Descriptions>

                <br />

                <Descriptions title={"Initial Species"} bordered column={4}>
                    {this.renderSpecies()}
                </Descriptions>

                <br />

                <Descriptions title={"Bibliography"} bordered column={2}>
                    <Descriptions.Item label="Reference" span={2}>
                        {this.state.exp.props.file_paper.title}
                    </Descriptions.Item>
                    <Descriptions.Item label="Paper DOI" >
                        {<HyperLink link={this.state.exp.props.file_paper.reference_doi}/>}
                    </Descriptions.Item>
                    <Descriptions.Item label="Reference ID" >{this.state.exp.props.file_paper.id}</Descriptions.Item>
                </Descriptions>
            </div>

        )
    }
}

export default InfoExperiment;