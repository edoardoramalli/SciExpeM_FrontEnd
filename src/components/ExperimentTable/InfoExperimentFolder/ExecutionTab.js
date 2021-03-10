import React, {lazy} from "react";
import {checkError} from "../../Tool";

const axios = require('axios');
import Cookies from "js-cookie";

axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

import {Button, Table, Tabs, Row, Col, Space} from "antd";
import {UploadOutlined, PlusOutlined} from '@ant-design/icons';


const DetailExecutionTab = lazy(() => import('./Execution/DetailExecutionTab'))
const ExecutionPlot = lazy(() => import('./Execution/ExecutionPlot'))
const AddExecution = lazy(() => import('./Execution/AddExecution'))

import ActionCell from "../../Shared/ActionCell";
import UploadExecution from "./Execution/UploadExecution";


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
            execution_id: null
        }
    }

    componentDidMount() {
        this.refreshTable()
    }

    refreshTable() {
        this.setState({loading: true})
        let params = {
            fields: ['id', 'chemModel', 'execution_start', 'execution_end', 'username'],
            experiment_id: this.props.experiment.id.toString()
        }
        axios.post(window.$API_address + 'frontend/API/getExecutionList', params)
            .then(res => {
                this.setState({dataSource: JSON.parse(res.data), loading: false})
            })
            .catch(error => {
                checkError(error)
                this.setState({loading: false})
            })
    }


    closeAddExecution() {
        this.setState({addExecutionVisible: false})
    }

    parseTime(timeString) {
        return timeString ? <>{new Date(timeString).toUTCString()}</> : <></>
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
                this.setState({uploadExecutionVisible: true, listFiles: res.data, execution_id: execution_id})            })
            .catch(error => {
                checkError(error)
            })

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
                width: '20%'

            },
            {
                title: 'Execution Start Time',
                dataIndex: 'execution_start',
                key: 'execution_start',
                sorter: (a, b) => {
                    return a.id > b.id
                },
                render: (props, record) => <>{this.parseTime(record.execution_start)}</>,
                width: '22%'

            },
            {
                title: 'Execution End Time',
                dataIndex: 'execution_end',
                key: 'execution_end',
                sorter: (a, b) => {
                    return a.id > b.id
                },
                render: (props, record) => <>{this.parseTime(record.execution_end)}</>,
                width: '22%'
            },
            {
                title: 'Username',
                dataIndex: 'username',
                key: 'username',
                sorter: (a, b) => {
                    return a.id > b.id
                },
                width: '17%'
            },
            {
                title: 'Action',
                dataIndex: 'actions',
                key: 'actions',
                width: '12%',
                render: (text, record) =>
                    <Space>
                        <ActionCell
                            items={{'Execution': {'label': 'Raw Data (.csv)', 'extension': '.csv', 'file': 'rawData'}}}
                            element_id={record.id}
                            model_name={'Execution'}
                            handleDelete={this.handleDelete}
                        />
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
                                </Row>
                            }
                            bordered
                            rowKey="id"
                            dataSource={this.state.dataSource}
                            columns={columns}
                            loading={this.state.loading}
                            expandedRowRender={record => {
                                return <DetailExecutionTab exec_id={record.id}/>
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