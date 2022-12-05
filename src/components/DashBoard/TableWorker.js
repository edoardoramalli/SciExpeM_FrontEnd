import React from "react";
import {checkError} from "../Tool";
import {Table, Tabs, Typography, Row, Col, Button, Progress, Menu, Popconfirm, Space, Dropdown} from "antd";
import ActionCell from "../Shared/ActionCell";

const axios = require('axios');
import Cookies from "js-cookie";
import TabExperiment from "../ExperimentTable/InfoExperimentFolder/TabExperiment";
import {RetweetOutlined, SettingOutlined} from "@ant-design/icons";
import {table_columns, parseTime} from "../Variables";

axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

class TableWorker extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            record: [],
        }
    }

    refreshTable = () => {
        this.setState({loading: true})
        const params = {model_name: 'WorkManager',
            query: {},
            fields: ['last_contact', 'computer', 'free_cores', 'num_cores', 'max_jobs', 'active_jobs']}
        axios.post(window.$API_address + 'ExperimentManager/API/filterDataBase', params)
            .then(res => {
                this.setState({record: res.data, loading: false})
            })
            .catch(error => {
                this.setState({loading: false})
                checkError(error)
            })
    }

    componentDidMount() {
        this.refreshTable()
    }


    render() {
        const columns = [
            {...table_columns['execution__computer'], defaultSortOrder: 'descend'},
            {
                title: 'Last Contact',
                dataIndex: 'last_contact',
                width: '25%',
                render: (props, record) => <>{parseTime(record.last_contact)}</>,
                sorter: (a, b) => new Date(a.last_contact) - new Date(b.last_contact),
            },
            {
                title: 'Cores',
                dataIndex: 'num_cores',
                width: '30%',
                render: (props, record) => {
                    return <Progress trailColor={'#95de64'} strokeColor={'red'} percent={(record.num_cores - record.free_cores) * 100 / record.num_cores} format={()=><>{record.num_cores - record.free_cores}/{record.num_cores}</>} />},
            },
            {
                title: 'Jobs',
                dataIndex: 'max_jobs',
                width: '25%',
                render: (props, record) => {
                    return <Progress trailColor={'#95de64'} strokeColor={'red'} percent={(record.active_jobs) * 100 / record.max_jobs} format={()=><>{record.active_jobs}/{record.max_jobs}</>}/>}
            }
        ];


        return (
            <>
                <Table
                    dataSource={this.state.record}
                    loading={this.state.loading}
                    columns={columns}
                    size='small'
                    pagination={false}
                    rowKey="id"
                    title={() => <Row>
                        <Col span={22}><Typography.Title level={5}>Number of
                            Workers: {this.state.record.length}</Typography.Title></Col>
                        <Col span={1}>
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
                    </Row>}
                    bordered
                    // expandRowByClick={true}
                    // expandedRowRender={record => {
                    //     return <><h2>Error:</h2>{record.execution_error}</>
                    // }}
                    summary={pageData => {
                        let total_n_cores = 0;
                        let total_free_cores = 0;
                        let total_active_jobs = 0;
                        let total_max_jobs = 0;

                        pageData.forEach((e) => {
                            total_n_cores += e.num_cores;
                            total_free_cores += e.free_cores;
                            total_active_jobs += e.active_jobs;
                            total_max_jobs += e.max_jobs;
                        });

                        return (
                            <Table.Summary fixed>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell>Total</Table.Summary.Cell>
                                    <Table.Summary.Cell></Table.Summary.Cell>
                                    <Table.Summary.Cell>
                                        {total_n_cores - total_free_cores} / {total_n_cores}
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell>
                                        {total_active_jobs} / {total_max_jobs}
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>

                            </Table.Summary>
                        );
                    }}
                />
            </>
        )
    }

}

export default TableWorker;