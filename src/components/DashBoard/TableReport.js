import React from "react";
import {checkError} from "../Tool";
import {Table, Tabs, Typography, Row, Col, Button, Dropdown, Menu, Popconfirm, Space} from "antd";
import ActionCell from "../Shared/ActionCell";

const axios = require('axios');
import Cookies from "js-cookie";
import TabExperiment from "../ExperimentTable/InfoExperimentFolder/TabExperiment";
import {RetweetOutlined, SettingOutlined} from "@ant-design/icons";

axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

class TableReport extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            record: [],
            selectedRowKeys: [],
        }
    }

    refreshTable = () =>{
        this.setState({loading: true, selectedRowKeys: []});

        const params = {
            username_list: [],
            params: ['id', 'experiment__id', 'chemModel__id',
                'chemModel__name', 'username', 'execution_error',
                'execution_created', 'execution_start', 'execution_end', 'computer']
        }

        axios.post(window.$API_address + this.props.api, params)
            .then(res => {
                this.setState(
                    {
                        record: res.data,
                        loading: false,
                    }
                )
            })
            .catch(error => {
                this.setState({loading: false})
                checkError(error)
            })
    }

    componentDidMount() {
        this.refreshTable()
    }

    parseTime(timeString) {
        return timeString ? <>{new Date(timeString).toUTCString()}</> : <></>
    }

    onSelectChange = (e) => {
        this.setState({selectedRowKeys: e})
    }

    confirmCurveMatching = () =>{
        this.setState({loading: true})
        this.state.selectedRowKeys.forEach(exec_id =>{
            const params = {'execution_id': exec_id}
            axios.post(window.$API_address + 'CurveMatching/API/createUpdateExecutionCurveMatching', params)
                .then(res => {
                })
                .catch(error => {
                    checkError(error)
                })
        })
        this.setState({loading: false})
        this.delay(1000).then(() => this.refreshTable());
    }

    confirmDeleteAll = () =>{
        this.setState({loading: true})
        this.state.selectedRowKeys.forEach(exec_id =>{
            const params = {
                'element_id': exec_id,
                'model_name': 'Execution'

            }
            axios.post(window.$API_address + 'ExperimentManager/API/deleteElement', params)
                .then(res => {
                }).catch(error => {
                checkError(error)
            });
        })
        this.setState({loading: false})
        this.delay(1000).then(() => this.refreshTable());


    }

    removeErrorAll = () =>{
        this.setState({loading: true})
        this.state.selectedRowKeys.forEach(exec_id =>{
            const params = {
                'element_id': exec_id,
                'model_name': 'Execution',
                'property_dict': JSON.stringify({'execution_error': null})
            }
            axios.post(window.$API_address + 'ExperimentManager/API/updateElement', params)
                .then(res => {
                }).catch(error => {
                checkError(error)
            });
        })
        this.setState({loading: false})
        this.delay(1000).then(() => this.refreshTable());

    }
    delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }




    render() {
        const columns = [
            {
                title: 'Exec. ID',
                dataIndex: 'id',
                key: 'id',
                sorter: {
                    compare: (a, b) => a.id - b.id,
                    multiple: 3,
                },
            },
            {
                title: 'Exp. ID',
                dataIndex: 'experiment__id',
                sorter: {
                    compare: (a, b) => a.experiment__id - b.experiment__id,
                    multiple: 1,
                },
            },
            {
                title: 'Chem. Model',
                dataIndex: 'chemModel__name',
                render: (props, record) => <>{record['chemModel__name']} ({record['chemModel__id']})</>,
                sorter: {
                    compare: (a, b) => a.chemModel__id - b.chemModel__id,
                    multiple: 2,
                },
            },
            {
                title: 'Username',
                dataIndex: 'username',
                sorter: (a, b) => a.username.localeCompare(b.username)

            },
            {
                title: 'Exec. Created',
                dataIndex: 'execution_created',
                render: (props, record) => <>{this.parseTime(record.execution_created)}</>,
                sorter: (a, b) => new Date(a.execution_created) - new Date(b.execution_created),
            },
            {
                title: 'Exec. Started',
                dataIndex: 'execution_start',
                render: (props, record) => <>{this.parseTime(record.execution_start)}</>,
                sorter: (a, b) => new Date(a.execution_start) - new Date(b.execution_start),
            },
            {
                title: 'Exec. End',
                dataIndex: 'execution_end',
                render: (props, record) => <>{this.parseTime(record.execution_end)}</>,
                sorter: (a, b) => new Date(a.execution_end) - new Date(b.execution_end),
            },
            {
                title: 'Computer Name',
                dataIndex: 'computer',
                sorter: (a, b) => a.computer.localeCompare(b.computer)
            },
        ];

        const rowSelection =  {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.onSelectChange,
            selections: [Table.SELECTION_ALL],
            columnWidth: '55px'
        }



        const menu = (
            <Menu>
                <Menu.Item>
                    <Popconfirm placement="bottomRight" title={'Are you sure?'} onConfirm={this.confirmCurveMatching} okText="Yes" cancelText="No">
                        <Button loading={this.state.loading}>Compute Curve Matching</Button>
                    </Popconfirm>
                </Menu.Item>
                <Menu.Item>
                    <Popconfirm placement="bottomRight" title={'Are you sure?'} onConfirm={this.confirmDeleteAll} okText="Yes" cancelText="No">
                        <Button loading={this.state.loading}>Delete Execution</Button>
                    </Popconfirm>
                </Menu.Item>
                <Menu.Item>
                    <Popconfirm placement="bottomRight" title={'Are you sure?'} onConfirm={this.removeErrorAll} okText="Yes" cancelText="No">
                        <Button loading={this.state.loading}>Remove Error</Button>
                    </Popconfirm>
                </Menu.Item>
                <Menu.Item>
                    <Button disabled loading={this.state.loading}>Restart Execution</Button>
                </Menu.Item>
            </Menu>
        );

        return (
            <>
                <Table
                    dataSource={this.state.record}
                    loading={this.state.loading}
                    columns={columns}
                    rowSelection={rowSelection}
                    size='small'
                    pagination={true}
                    rowKey="id"
                    title={() => <Row>
                        <Col span={20}><Typography.Title level={5}>Number of record: {this.state.record.length}</Typography.Title></Col>
                        <Col span={4} >
                            <Space>
                                <Dropdown overlay={menu} placement="bottomCenter" arrow>
                                    <Button icon={<SettingOutlined />}>Actions</Button>
                                </Dropdown>
                                <Button
                                    type="primary"
                                    shape="round"
                                    icon={<RetweetOutlined />}
                                    onClick={() => {this.refreshTable()}}
                                >
                                    Refresh
                                </Button>
                            </Space>
                        </Col>
                        </Row>}
                    bordered
                    expandRowByClick={true}
                    expandedRowRender={record => {return <><h2>Error:</h2>{record.execution_error}</>}}
                />
            </>
        )
    }

}

export default TableReport;