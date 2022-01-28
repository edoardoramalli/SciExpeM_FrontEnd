import React from "react";

const axios = require('axios');
import Cookies from "js-cookie";
import {message, Table, Button, Input, Space, Row, Col, Popconfirm} from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    SaveOutlined,
    RollbackOutlined,
    PlusOutlined,
    SearchOutlined
} from "@ant-design/icons";

import {checkError} from "../Tool";

import AddSpecie from "./AddSpecie"
import Highlighter from "react-highlight-words";

axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

class SpeciesTable extends React.Component {
    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div style={{padding: 8}}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{width: 188, marginBottom: 8, display: 'block'}}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    icon={<SearchOutlined type="search"/>}
                    size="small"
                    style={{width: 90}}
                >
                    Search
                </Button>
                <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{width: 90}}>
                    Reset
                </Button>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{color: filtered ? '#1890ff' : 'black'}}/>
        ,
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select(), 100);
            }
        },
        render: text =>
            this.state.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
                    searchWords={[this.state.searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };

    handleReset = clearFilters => {
        clearFilters();
        this.setState({searchText: ''});
    };

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

            loading: false,
        }
    }

    refreshSpecieList = () => {
        this.setState({loading: true})
        const params = {args: {}, fields: ['id', 'InChI', 'preferredKey', 'names', 'CAS', 'SMILES', 'chemName', 'formula']}
        axios.post(window.$API_address + 'frontend/API/getSpecieList', params)
            .then(res => {
                const species_list = JSON.parse(res.data)
                console.log(species_list)
                this.setState({species: species_list, editableRow: undefined, loading: false})

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
                width: 100,
                sorter: (a, b) => {
                    return a.id > b.id
                },
                defaultSortOrder: 'ascend',
                fixed: 'left',
            },
            {
                title: 'Preferred Name',
                dataIndex: 'preferredKey',
                width: 150,
                key: 'preferredKey',
                ...this.getColumnSearchProps('preferredKey'),
                sorter: (a, b) => {
                    return a.id > b.id
                },
                fixed: 'left',
            },
            {
                title: 'InChI',
                dataIndex: 'InChI',
                key: 'InChI',
                width: 600,
                ...this.getColumnSearchProps('InChI'),
                sorter: (a, b) => {
                    return a.id > b.id
                }
            },
            {
                title: 'CAS',
                dataIndex: 'CAS',
                key: 'CAS',
                width: 150,
                ...this.getColumnSearchProps('CAS'),
                sorter: (a, b) => {
                    return a.id > b.id
                }
            },
            {
                title: 'SMILES',
                dataIndex: 'SMILES',
                key: 'SMILES',
                width: 550,
                ...this.getColumnSearchProps('SMILES'),
                sorter: (a, b) => {
                    return a.id > b.id
                }
            },

            {
                title: 'Alternative Names',
                dataIndex: 'names',
                key: 'names',
                width: 150,
                render: (text, record) => {return (this.renderEdit(record, 'names'))},
                sorter: (a, b) => {
                    return a.id > b.id
                },
            },
            {
                title: 'Chemical Name',
                dataIndex: 'chemName',
                key: 'chemName',
                width: 200,
                ...this.getColumnSearchProps('chemName'),
                sorter: (a, b) => {
                    return a.id > b.id
                }
            },
            {
                title: 'Formula',
                dataIndex: 'formula',
                key: 'formula',
                width: 150,
                ...this.getColumnSearchProps('formula'),
                sorter: (a, b) => {
                    return a.id > b.id
                }
            },
            {
                title: 'Actions',
                dataIndex: '',
                key: 'actions',
                fixed: 'right',
                width: 150,
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
                    loading={this.state.loading}
                    bordered
                    scroll={{x: 800}}
                    style={{minHeight: 100}}
                />
                </>
        )
    }
}

export default SpeciesTable;