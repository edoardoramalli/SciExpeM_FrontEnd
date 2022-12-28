import React from "react";
import {Descriptions, Spin, Col, Empty, Table, Row, Button, Space, Dropdown} from 'antd';

const axios = require('axios');
import Cookies from "js-cookie";
axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

import HyperLink from "../../HyperLink";
import {checkError} from "../../Tool"
import {table_columns, parseTime, string_compare} from "../../Variables";
import {PlusOutlined, RetweetOutlined, UploadOutlined} from "@ant-design/icons";
import DetailExecutionTab from "./Execution/DetailExecutionTab";
import UploadBackUp from "./UploadBackUp";
import ActionCell from "../../Shared/ActionCell";

class BackupTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            property_list: null,
            loading: false,
            dataSource: [],
            addBackUpVisible: false,
        }
    }

    refreshTable(){
        this.setState({loading: true});
        const params = {
            fields: ['id', 'chemModel', 'dateTime', 'parameter_name', 'parameter_value', 'parameter_unit'],
            query: {experiment__id: this.props.experiment.id.toString()},
            // query: {experiment__id: 322},

            model_name: 'ExperimentBackUp'
        }
        axios.post(window.$API_address + 'ExperimentManager/API/filterDataBase', params)
            .then(res => {
                this.setState({dataSource: res.data, loading: false})
            })
            .catch(error => {
                this.setState({loading: false})
                checkError(error)
            })
    }



    componentDidMount() {
        this.refreshTable()
    }

    closeAddBackUp() {
        this.setState({addBackUpVisible: false})
    }

    handleDelete = (e_id) => {
        this.setState({dataSource: this.state.dataSource.filter(item => item.id !== e_id)});
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
                width: '7%'
            },
            {
                title: 'ChemModel',
                dataIndex: ['chemModel', 'name'],
                key: 'chemModel',
                sorter: (a, b) => {
                    return a.id > b.id
                },
                width: '20%'

            },
            // table_columns['execution__execution_created'],
            {
                title: 'Parameter',
                dataIndex: 'parameter_name',
                key: 'parameter_name',
                sorter: (a, b) => string_compare(a.username, b.username),
                width: '10%'
            },
            {
                title: 'Unit',
                dataIndex: 'parameter_unit',
                key: 'parameter_unit',
                sorter: (a, b) => string_compare(a.username, b.username),
                width: '10%'
            },
            {
                title: 'Value',
                dataIndex: 'parameter_value',
                key: 'parameter_value',
                sorter: (a, b) => {
                    return a.id > b.id
                },
                width: '10%'
            },
            {
                title: 'Upload Time',
                dataIndex: 'dateTime',
                key: 'dateTime',
                width: '10%',
                sorter: (a, b) => new Date(a.dateTime) - new Date(b.dateTime),
                render: (props, record) => <>{parseTime(record.dateTime)}</>,
            },
            table_columns['execution__username'],
            {
                title: 'Action',
                dataIndex: 'actions',
                key: 'actions',
                // width: '12%',
                fixed: 'right',
                render: (text, record) =>
                    <Space>
                        <ActionCell
                            items={{'ExperimentBackUp': {'label': 'BackUp', 'extension': '.xml', 'file': 'backup'}}}
                            element_id={record.id}
                            model_name={'ExperimentBackUp'}
                            handleDelete={this.handleDelete}
                        />
                    </Space>
            },

        ]
        return(
            <>
                <UploadBackUp
                    addBackUpVisible={this.state.addBackUpVisible}
                    refreshTable={this.refreshTable.bind(this)}
                    closeAddBackUp={this.closeAddBackUp.bind(this)}
                    experiment={this.props.experiment}
                />
                <Table
                    title={() =>
                        <Row>
                            <Col>
                                <Button
                                    type="primary"
                                    shape="round"
                                    icon={<PlusOutlined/>}
                                    // disabled={!(this.props.experiment.status === 'verified')}
                                    onClick={() => {this.setState({addBackUpVisible: true})}}
                                >
                                    Add BackUp
                                </Button>
                            </Col>
                            <Col offset={8}>
                                <div style={{fontWeight: 'bold', fontSize: 15}}>BackUp List</div>
                            </Col>
                            <Col style={{'float': 'right'}} offset={8}>
                                <Button
                                    type="primary"
                                    shape="round"
                                    icon={<RetweetOutlined/>}
                                    onClick={() => {
                                        this.refreshTable()
                                    }}
                                >
                                    Refresh
                                </Button>
                            </Col>
                        </Row>
                    }
                    bordered
                    rowKey="id"
                    dataSource={this.state.dataSource}
                    columns={columns}
                    loading={this.state.loading}
                    // expandRowByClick={true}
                    // expandedRowRender={record => {
                    //     return <DetailExecutionTab exec_id={record.id} ropa={record.num_files > 0}/>
                    // }}
                />
            </>

        )

    }

}

export default BackupTab;