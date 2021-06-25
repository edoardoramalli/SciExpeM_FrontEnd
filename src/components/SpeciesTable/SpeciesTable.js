import React from "react";

const axios = require('axios');
import Cookies from "js-cookie";
import {message, Table, Button, Input, Space, Row, Col, Popconfirm} from "antd";
import {DeleteOutlined, EditOutlined, SaveOutlined, RollbackOutlined, PlusOutlined} from "@ant-design/icons";

import {checkError} from "../Tool";

import AddSpecie from "./AddSpecie"

axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

class SpeciesTable extends React.Component {
    constructor() {
        super();
        this.state = {
            species: [],
            editableRow: undefined,
            new_InChI: undefined,
            new_CAS: undefined,
            new_SMILES: undefined,
            new_preferredKey: undefined,
            new_names: undefined,
            new_chemName: undefined,
            new_formula: undefined,

            addSpecieVisible: false,
            loadingDelete: false,
        }
    }

    refreshSpecieList = () => {
        const params = {args: {}, fields: {}}
        axios.post(window.$API_address + 'frontend/API/getSpecieList', params)
            .then(res => {
                const species_list = JSON.parse(res.data)
                this.setState({species: species_list, editableRow: undefined})

            })
            .catch(error => {
                this.setState({loading: false})
                checkError(error)
            })
    }

    componentDidMount() {
        this.refreshSpecieList()
    }

    handleEdit = (record) => {
        this.setState(
            {
                editableRow: record.id,
                new_InChI: record.InChI,
                new_CAS: record.CAS,
                new_SMILES: record.SMILES,
                new_preferredKey: record.prefferedKey,
                new_names: record.names.join(", "),
                new_chemName: record.chemName,
                new_formula: record.formula,
            })

    }

    handleSave = (record) => {


        const properties = {
            'InChI': this.state.new_InChI,
            'CAS': this.state.new_CAS,
            'SMILES': this.state.new_SMILES,
            'preferredKey': this.state.new_preferredKey,
            'names': this.state.new_names.split(','),
            'chemName': this.state.new_chemName,
            'formula': this.state.new_formula,
        }

        const params = {'model_name': 'Specie', 'element_id': record.id, 'property_dict': JSON.stringify(properties)}
        axios.post(window.$API_address + 'ExperimentManager/API/updateElement', params)
            .then(res => {
                message.success('Specie Edit Successful!');
                this.refreshSpecieList()
            })
            .catch(error => {
                this.setState({loading: false})
                checkError(error)
            })

    }

    onChange = (e, name) => {
        this.setState({['new_' + name]: e.target.value})
    }

    renderEdit = (record, name) => {
        const content = name !== 'names' ? record[name] : record[name].join(', ')
        return this.state.editableRow === record.id ?
            <Input defaultValue={content} onChange={(e) => this.onChange(e, name)} values/> : content
    }

    closeAddSpecie = () =>{
        this.setState({addSpecieVisible: false})
    }

    handleDelete = (e, id) => {
        this.setState({loadingDelete: true});
        const params = {
            'element_id': id,
            'model_name': 'Specie'
        }
        axios.post(window.$API_address + 'ExperimentManager/API/deleteElement', params)
            .then(res => {
                this.setState({loadingDelete: false})
                this.refreshSpecieList()
            }).catch(error => {
            this.setState({loadingDelete: false});
            checkError(error)
        });
    };


    render() {
        const columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
                sorter: (a, b) => {
                    return a.id > b.id
                },
                defaultSortOrder: 'ascend',
            },
            {
                title: 'InChI',
                dataIndex: 'InChI',
                key: 'InChI',
                render: (text, record) => {return (this.renderEdit(record, 'InChI'))},
                sorter: (a, b) => {
                    return a.id > b.id
                }
            },
            {
                title: 'CAS',
                dataIndex: 'CAS',
                key: 'CAS',
                render: (text, record) => {return (this.renderEdit(record, 'CAS'))},
                sorter: (a, b) => {
                    return a.id > b.id
                }
            },
            {
                title: 'SMILES',
                dataIndex: 'SMILES',
                key: 'SMILES',
                render: (text, record) => {return (this.renderEdit(record, 'SMILES'))},
                sorter: (a, b) => {
                    return a.id > b.id
                }
            },
            {
                title: 'Preferred Name',
                dataIndex: 'preferredKey',
                key: 'preferredKey',
                render: (text, record) => {return (this.renderEdit(record, 'preferredKey'))},
                sorter: (a, b) => {
                    return a.id > b.id
                }
            },
            {
                title: 'Alternative Names',
                dataIndex: 'names',
                key: 'names',
                render: (text, record) => {return (this.renderEdit(record, 'names'))},
                sorter: (a, b) => {
                    return a.id > b.id
                },
            },
            {
                title: 'Chemical Name',
                dataIndex: 'chemName',
                key: 'chemName',
                render: (text, record) => {return (this.renderEdit(record, 'chemName'))},
                sorter: (a, b) => {
                    return a.id > b.id
                }
            },
            {
                title: 'Formula',
                dataIndex: 'formula',
                key: 'formula',
                render: (text, record) => {return (this.renderEdit(record, 'formula'))},
                sorter: (a, b) => {
                    return a.id > b.id
                }
            },
            {
                title: 'Actions',
                dataIndex: '',
                key: 'actions',
                render: (text, record) => <Space>
                    {record.id !== this.state.editableRow ? <Button
                        shape="circle"
                        icon={<EditOutlined />}
                        onClick={() => this.handleEdit(record)}
                        disabled={this.state.editableRow !== undefined}
                    />: <></>}

                    {record.id === this.state.editableRow ? <Button
                        shape={"circle"}
                        icon={<RollbackOutlined />}
                        onClick={() => this.refreshSpecieList()}
                    /> : <></>}
                    <Button
                        shape="circle"
                        icon={<SaveOutlined />}
                        onClick={() => this.handleSave(record)}
                        disabled={record.id !== this.state.editableRow}
                    />
                    <Popconfirm title="Are you sure delete?" onConfirm={(e) => this.handleDelete(e, record.id)} okText="Yes" cancelText="No">
                        <Button shape="circle" loading={this.state.loadingDelete}><DeleteOutlined/></Button>
                    </Popconfirm>
                </Space>
            }
        ]
        return (
            <>
                <AddSpecie
                    addSpecieVisible={this.state.addSpecieVisible}
                    refreshSpecieList={this.refreshSpecieList}
                    closeAddSpecie={this.closeAddSpecie}
                />
                <Table
                    title={() =>
                        <Row>
                            <Col>
                                <Button
                                    type="primary"
                                    shape="round"
                                    icon={<PlusOutlined/>}
                                    onClick={() => {
                                        this.setState({addSpecieVisible: true})
                                    }}
                                >
                                    Add Specie
                                </Button>
                            </Col>
                            <Col offset={8}>
                                <div style={{fontWeight: 'bold', fontSize: 20}}>Species List</div>
                            </Col>
                        </Row>
                    }
                    columns={columns}
                    dataSource={this.state.species}
                    rowKey="id"
                    size='small'
                    // loading={this.props.loading}
                    bordered
                    style={{minHeight: 100}}
                />
                </>
        )
    }
}

export default SpeciesTable;