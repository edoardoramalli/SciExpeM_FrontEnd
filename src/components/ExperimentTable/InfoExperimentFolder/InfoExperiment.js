import React from "react";
import {Descriptions, Empty, Button, Input, message, Space, Select} from 'antd';

const axios = require('axios');
import Cookies from "js-cookie";

axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

import HyperLink from "../../HyperLink";

import {checkError} from "../../Tool";
import {EditOutlined, SaveOutlined, RollbackOutlined} from "@ant-design/icons";
import Variables from "../../Variables";

const {reactors, experimentTypeToReactor, ignition} = Variables

class InfoExperiment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            exp: this.props,
            status: "None",
            comment: 'loading...',
            notes: 'loading...',
            reactor_modes: 'loading..',
            editable: false,
            savable: false,
            rollback: false,

            reactor: this.props.props.reactor,
            experiment_type: this.props.props.experiment_type,
            ignition_type: this.props.props.ignition_type,

            fileDOI: 'loading..',

            new_comment: undefined,
            new_notes: undefined,
            new_reactor: undefined,
            new_experiment_type: undefined,
            new_ignition_type: undefined,
        }
    }

    componentDidMount() {
        const params = {
            'model_name': 'Experiment',
            'element_id': this.state.exp.props.id,
            'fields': ['comment', 'notes', 'reactor_modes', 'fileDOI'],
        }
        axios.post(window.$API_address + 'ExperimentManager/API/requestPropertyList', params)
            .then(res => {
                const result = JSON.parse(res.data)
                this.setState({comment: result.comment, notes: result.notes, reactor_modes: result.reactor_modes, fileDOI: result.fileDOI})
            }).catch(error => {
            checkError(error)
            // this.setState({comment: 'Error loading comment', notes})
            // TODO msg di errore
        })
    }

    onChange = (e, name) => {
        this.setState({['new_' + name]: e.target.value})
    }

    onChangeOption = (e, name) => {
        this.setState({['new_' + name]: e})
    }

    renderEdit = (record, name, always_editable) => {
        const content = record[name]
        if (this.state.editable && (this.state.exp.props.status !== 'verified' || always_editable)) {

            return <Input.TextArea
                style={{width: '80vw'}}
                defaultValue={content}
                onChange={(e) => this.onChange(e, name)}
                autoSize={{minRows: 1, maxRows: 6}}
            />

        } else {
            return content
        }
    }

    renderEditOptions = (record, name, options) => {
        const content = record[name]
        if (this.state.editable && (this.state.exp.props.status !== 'verified')) {

            return <Select
                defaultValue={content}
                style={{width: '15vw'}}
                onChange={(e) => this.onChangeOption(e, name)}
            >
                {options.map((item) => {
                    return (
                        <Select.Option
                            value={item}
                            key={item}
                        >
                            {item}
                        </Select.Option>
                    )
                })}
            </Select>

        } else {
            return content
        }
    }

    editGeneral = () => {
        this.setState({
            rollback: true,
            editable: true,
            savable: true,
            new_comment: this.state.comment,
            new_notes: this.state.notes,
            new_reactor: this.state.reactor,
            new_experiment_type: this.state.experiment_type,
            new_ignition_type: this.state.ignition_type,
        })
    }

    saveEdit = () => {
        const properties = {
            'notes': this.state.new_notes,
            'comment': this.state.new_comment,
            'experiment_type': this.state.new_experiment_type,
            'reactor': this.state.new_reactor,
            'ignition_type': this.state.new_ignition_type,
        }

        const params = {
            'model_name': 'Experiment',
            'element_id': this.state.exp.props.id,
            'property_dict': JSON.stringify(properties)
        }
        axios.post(window.$API_address + 'ExperimentManager/API/updateElement', params)
            .then(res => {
                message.success('Edit Successful!');
                this.setState(
                    {
                        editable: false,
                        savable: false,
                        rollback: false,
                        notes: this.state.new_notes,
                        comment: this.state.new_comment,
                        reactor: this.state.new_reactor,
                        experiment_type: this.state.new_experiment_type,
                        ignition_type: this.state.new_ignition_type,
                    })
            })
            .catch(error => {
                this.setState({loading: false})
                checkError(error)
            })

    }

    cancelEdit = () => {
        this.setState(
            {
                editable: false,
                savable: false,
                rollback: false,
            })
    }


    render() {
        return (
            <div className={"description"}>
                <Descriptions
                    title={
                        <Space>
                            {!this.state.rollback ? <Button
                                    shape="round"
                                    icon={<EditOutlined/>}
                                    onClick={() => this.editGeneral()}
                                    // disabled={this.state.exp.props.status === 'verified'}
                                >
                                    Edit
                                </Button> :
                                <Button
                                    shape="round"
                                    icon={<RollbackOutlined/>}
                                    onClick={() => this.cancelEdit()}
                                >
                                    Cancel
                                </Button>}
                            <Button
                                shape="round"
                                icon={<SaveOutlined/>}
                                onClick={() => this.saveEdit()}
                                disabled={!this.state.savable}
                            >
                                Save
                            </Button>
                        </Space>
                    }
                    bordered={true}
                    column={2}
                    labelStyle={{fontWeight: 900}}
                >
                    <Descriptions.Item label="Experiment DOI">{<HyperLink link={this.state.fileDOI}/>}
                    </Descriptions.Item>
                    <Descriptions.Item label="Author">{this.state.exp.props.username}</Descriptions.Item>
                    <Descriptions.Item label="Status">{this.state.exp.props.status}</Descriptions.Item>
                    <Descriptions.Item
                        label="Interpreter">{this.state.exp.props.interpreter_name}</Descriptions.Item>
                    <Descriptions.Item label="Experiment ID">{this.state.exp.props.id}</Descriptions.Item>
                    <Descriptions.Item
                        label="Experiment Type">{this.renderEditOptions(this.state, 'experiment_type', Object.keys(experimentTypeToReactor))}</Descriptions.Item>
                    <Descriptions.Item
                        label="Reactor">{this.renderEditOptions(this.state, 'reactor', reactors)}</Descriptions.Item>
                    <Descriptions.Item label="Ignition Type">{this.renderEditOptions(this.state, 'ignition_type', ignition)}</Descriptions.Item>
                    {/*TODO mettere render options to reactor modes*/}
                    <Descriptions.Item label="Reactor Modes" span={2}>{this.state.reactor_modes ? this.state.reactor_modes.toString() : undefined}</Descriptions.Item>
                    <Descriptions.Item label="Comment"
                                       span={2}>{this.renderEdit(this.state, 'comment')}</Descriptions.Item>
                    <Descriptions.Item label="Notes" span={2}>{this.renderEdit(this.state, 'notes', true)}</Descriptions.Item>

                </Descriptions>
            </div>

        )
    }
}

export default InfoExperiment;