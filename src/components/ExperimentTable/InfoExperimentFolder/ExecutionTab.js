import React, {lazy} from "react";
import {checkError} from "../../Tool";

const axios = require('axios');
import Cookies from "js-cookie";
axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

import {Button, Table, Tabs, Row, Col, Modal} from "antd";

const DetailExecutionTab = lazy(() => import('./DetailExecutionTab'))
const ExecutionPlot = lazy(() => import('./ExecutionPlot'))

import {PlusOutlined} from '@ant-design/icons';
import AddExecution from "./AddExecution";
import ActionCell from "../../Shared/ActionCell";


class ExecutionTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            loading: true,
            addExecutionVisible: false,
        }
    }

    componentDidMount() {
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



    closeAddExecution(){
        this.setState({addExecutionVisible: false})
    }

    parseTime(timeString){return timeString ? <>{new Date(timeString).toUTCString()}</> : <></>}

    handleDelete = (e_id) => {this.setState({dataSource: this.state.dataSource.filter(item => item.id !== e_id)});};

    render() {
        const columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
                sorter: (a, b) => {
                    return a.id > b.id
                },
            },
            {
                title: 'ChemModel',
                dataIndex: ['chemModel', 'name'],
                key: 'chemModel',
                sorter: (a, b) => {
                    return a.id > b.id
                },

            },
            {
                title: 'Execution Start Time',
                dataIndex: 'execution_start',
                key: 'execution_start',
                sorter: (a, b) => {
                    return a.id > b.id
                },
                render: (props, record) => <>{this.parseTime(record.execution_start)}</>

            },
            {
                title: 'Execution End Time',
                dataIndex: 'execution_end',
                key: 'execution_end',
                sorter: (a, b) => {
                    return a.id > b.id
                },
                render: (props, record) => <>{this.parseTime(record.execution_end)}</>
            },
            {
                title: 'Username',
                dataIndex: 'username',
                key: 'username',
                sorter: (a, b) => {
                    return a.id > b.id
                },
            },
            {
                title: 'Action',
                dataIndex: 'actions',
                key: 'actions',
                width: '50px',
                render: (text, record) =>
                    <ActionCell
                        items={{'Execution': {'label': 'Raw Data (.csv)', 'extension': '.csv', 'file': 'rawData'}}}
                        element_id={record.id}
                        model_name={'Execution'}
                        handleDelete={this.handleDelete}
                    />
            },
        ];
        return(
            <Tabs tabPosition={'left'}>
                <Tabs.TabPane tab="List" key="1">
                    <AddExecution
                        addExecutionVisible={this.state.addExecutionVisible}
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
                                    icon={<PlusOutlined />}
                                    disabled={!(this.props.experiment.status === 'verified')}
                                    onClick={()=>{this.setState({addExecutionVisible: true})}}
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
        )
    }
}

export default ExecutionTab;