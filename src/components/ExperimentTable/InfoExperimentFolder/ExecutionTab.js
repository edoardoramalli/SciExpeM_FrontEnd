import React from "react";
import {checkError} from "../../Tool";
import Cookies from "js-cookie";
import {Button, Col, Dropdown, Menu, Popconfirm, Row, Space, Table, Tabs, message} from "antd";
import {PlusOutlined, RetweetOutlined, UploadOutlined} from '@ant-design/icons';


// const DetailExecutionTab = lazy(() => import('./Execution/DetailExecutionTab'))
// const ExecutionPlot = lazy(() => import('./Execution/ExecutionPlot'))
// const AddExecution = lazy(() => import('./Execution/AddExecution'))
import DetailExecutionTab from "./Execution/DetailExecutionTab";
import ExecutionPlot from "./Execution/ExecutionPlot";
import AddExecution from "./Execution/AddExecution";

import ActionCell from "../../Shared/ActionCell";
import UploadExecution from "./Execution/UploadExecution";

import {table_columns} from "../../Variables";

const axios = require('axios');

axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');


class ExecutionTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            loading: true,
            addExecutionVisible: false,
            uploadExecutionVisible: false,
            listFiles: [],
            uploadExecutionObject: null,
            uploadButtonLoading: false,
            execution_id: null,
            restartLoading: false,
        }
    }

    componentDidMount() {
        this.refreshTable()
    }

    refreshTable() {
        this.setState({loading: true})
        let params = {
            fields: ['id', 'chemModel', 'execution_start', 'execution_end', 'username', 'num_files', 'folder_size', 'has_error', 'backup_chemModel'],
            query: {experiment__id: this.props.experiment.id.toString()},
            model_name: 'Execution'
        }
        axios.post(window.$API_address + 'ExperimentManager/API/filterDataBase', params)
            .then(res => {
                this.setState({dataSource: res.data, loading: false})
            })
            .catch(error => {
                checkError(error)
                this.setState({loading: false})
            })
    }


    closeAddExecution() {
        this.setState({addExecutionVisible: false})
    }

    handleDelete = (e_id) => {
        this.setState({dataSource: this.state.dataSource.filter(item => item.id !== e_id)});
    };

    uploadExecutionNotVisible() {
        this.setState({uploadExecutionVisible: false})
    }

    uploadExecution(execution_id) {
        axios.post(window.$API_address + 'frontend/API/getExecutionFileList', {execution_id: execution_id})
            .then(res => {
                this.setState({uploadExecutionVisible: true, listFiles: res.data, execution_id: execution_id})
            })
            .catch(error => {
                checkError(error)
            })

    }

    handleRestart = (exec_id) => {
        axios.post(window.$API_address + 'OpenSmoke/API/restartExecution', {execution_id: exec_id})
            .then(res => {
                message.success('Execution Restarted!')
                this.refreshTable()
            })
            .catch(error => {
                checkError(error)
            })
    }

    handleCurveMatching = (exec_id) => {
        const params = {'execution_id': exec_id}
        this.setState({restartLoading: true})
        axios.post(window.$API_address + 'CurveMatching/API/createUpdateExecutionCurveMatching', params)
            .then(res => {
                this.setState({restartLoading: false})
                message.success('Request Sent!')
            })
            .catch(error => {
                checkError(error)
                this.setState({restartLoading: false})
            })
        this.refreshTable()
    }

    createMenu = (obj, id) => {
        return (
            <Menu>
                <Menu.Item>
                    <Button shape="text" loading={obj.state.restartLoading}
                            onClick={() => obj.handleCurveMatching(id)}>Compute Curve Matching</Button>
                </Menu.Item>
                <Menu.Item>
                    <Popconfirm
                        title="Are you sure to delete and restart?"
                        onConfirm={() => obj.handleRestart(id)}
                        okText="Yes"
                        cancelText="No">
                        <Button shape="text" loading={obj.state.restartLoading}>Restart Simulation</Button>
                    </Popconfirm>
                </Menu.Item>
            </Menu>
        )
    }

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
                width: '15%'

            },
            {
                title: 'Backup ChemModel',
                dataIndex: ['backup_chemModel', 'name'],
                key: 'backup_chemModel',
                sorter: (a, b) => {
                    return a.id > b.id
                },
                width: '15%'

            },
            table_columns['execution__execution_start'],
            table_columns['execution__execution_end'],
            table_columns['execution__username'],
            table_columns['execution__num_files'],
            table_columns['execution__folder_size'],
            {
                title: 'Action',
                dataIndex: 'actions',
                key: 'actions',
                // width: '12%',
                fixed: 'right',
                render: (text, record) =>
                    <Space>
                        <ActionCell
                            items={{'Execution': {'label': 'Raw Data (.zip)', 'extension': '.zip', 'file': 'rawData'}}}
                            element_id={record.id}
                            model_name={'Execution'}
                            handleDelete={this.handleDelete}
                        />
                        <Dropdown overlay={this.createMenu(this, record.id)}>
                            <Button
                                shape="circle"
                                disabled={record.execution_end === null}
                                // onClick={this.uploadExecution.bind(this, record.id)}
                                icon={<RetweetOutlined/>}
                                loading={this.state.restartLoading}
                            />
                        </Dropdown>
                        <Button
                            shape="circle"
                            disabled={record.execution_end !== null}
                            onClick={this.uploadExecution.bind(this, record.id)}
                            icon={<UploadOutlined/>}
                            loading={this.state.uploadButtonLoading}
                        />
                    </Space>
            },
        ];
        return (
            <>
                <UploadExecution
                    execution_id={this.state.execution_id}
                    uploadExecutionVisible={this.state.uploadExecutionVisible}
                    listFiles={this.state.listFiles}
                    refreshTable={this.refreshTable.bind(this)}
                    uploadExecutionNotVisible={this.uploadExecutionNotVisible.bind(this)}
                />
                <Tabs tabPosition={'left'}>
                    <Tabs.TabPane tab="List" key="1">
                        <AddExecution
                            addExecutionVisible={this.state.addExecutionVisible}
                            refreshTable={this.refreshTable.bind(this)}
                            closeAddExecution={this.closeAddExecution.bind(this)}
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
                                            disabled={!(this.props.experiment.status === 'verified')}
                                            onClick={() => {
                                                this.setState({addExecutionVisible: true})
                                            }}
                                        >
                                            Add Execution
                                        </Button>
                                    </Col>
                                    <Col offset={8}>
                                        <div style={{fontWeight: 'bold', fontSize: 15}}>Execution List</div>
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
                            expandedRowRender={record => {
                                return <DetailExecutionTab exec_id={record.id} ropa={record.num_files > 0}/>
                            }}
                        />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Plot" key="2">
                        <ExecutionPlot id={this.props.experiment.id} api={'frontend/API/getAllPlotExecution'}/>
                    </Tabs.TabPane>
                </Tabs>
            </>

        )
    }
}

export default ExecutionTab;