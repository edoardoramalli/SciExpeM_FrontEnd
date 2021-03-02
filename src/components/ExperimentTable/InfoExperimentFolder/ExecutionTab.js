import React, {lazy} from "react";
import {checkError} from "../../Tool";
const axios = require('axios');
import {Table, Tabs} from "antd";

const DetailExecutionTab = lazy(() => import('./DetailExecutionTab'))
const ExecutionPlot = lazy(() => import('./ExecutionPlot'))


class ExecutionTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: []
        }
    }

    componentDidMount() {
        let params = {
            fields: ['id', 'chemModel', 'execution_start', 'execution_end', 'username'],
            exp_id: this.props.exp_id.toString()
        }
        axios.post(window.$API_address + 'frontend/API/getExecutionList', params)
            .then(res => {
                this.setState({dataSource: JSON.parse(res.data)})
            })
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
                render: (props, record) => <>{new Date(record.execution_start).toUTCString()}</>
            },
            {
                title: 'Execution End Time',
                dataIndex: 'execution_end',
                key: 'execution_end',
                sorter: (a, b) => {
                    return a.id > b.id
                },
                render: (props, record) => <>{new Date(record.execution_end).toUTCString()}</>
            },
            {
                title: 'Username',
                dataIndex: 'username',
                key: 'username',
                sorter: (a, b) => {
                    return a.id > b.id
                },
            },
        ];
        return(
            <Tabs tabPosition={'left'}>
                <Tabs.TabPane tab="List" key="1">
                    <Table
                        title={() => <div style={{textAlign: 'center',
                            fontWeight: 'bold', fontSize: 15}}>Execution List</div>}
                        bordered
                        rowKey="id"
                        dataSource={this.state.dataSource}
                        columns={columns}
                        expandedRowRender={record => {
                            return <DetailExecutionTab exec_id={record.id}/>
                        }}
                    />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Plot" key="2">
                    <ExecutionPlot id={this.props.exp_id} api={'frontend/API/getAllPlotExecution'}/>
                </Tabs.TabPane>
            </Tabs>
        )
    }
}

export default ExecutionTab;