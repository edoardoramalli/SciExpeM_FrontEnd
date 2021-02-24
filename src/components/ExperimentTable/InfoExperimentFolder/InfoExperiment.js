import React from "react";
import {Descriptions} from 'antd';


import HyperLink from "../../HyperLink";

import "./styles.less"

class InfoExperiment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            exp: this.props,
            status: "None"
        }
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
        return (
            <div className={"description"}>
                <Descriptions
                    title="General"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="Experiment DOI">
                        {<HyperLink link={this.state.exp.props.fileDOI}/>}
                    </Descriptions.Item>
                    <Descriptions.Item label="Author">{this.state.exp.props.username}</Descriptions.Item>
                    <Descriptions.Item label="Status">{this.state.exp.props.status}</Descriptions.Item>
                    <Descriptions.Item
                        label="Interpreter">{this.state.exp.props.experiment_interpreter}</Descriptions.Item>
                    <Descriptions.Item label="Experiment ID">{this.state.exp.props.id}</Descriptions.Item>
                    <Descriptions.Item
                        label="Experiment Type">{this.state.exp.props.experiment_type}</Descriptions.Item>
                    <Descriptions.Item label="Reactor">{this.state.exp.props.reactor}</Descriptions.Item>
                    <Descriptions.Item label="Ignition Type">{this.state.exp.props.ignition_type}</Descriptions.Item>
                </Descriptions>
            </div>

        )
    }
}

export default InfoExperiment;