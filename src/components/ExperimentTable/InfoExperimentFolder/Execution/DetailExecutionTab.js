import React, {lazy} from "react";
import {Empty, Table, Tabs, Spin} from "antd";
import {checkError} from "../../../Tool";

const axios = require('axios');
import Cookies from "js-cookie";

axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

// const ExecutionPlot = lazy(() => import('./ExecutionPlot'))
// const ExecutionError = lazy(() => import('./ExecutionError'))
import ExecutionPlot from "./ExecutionPlot";
import ExecutionError from "./ExecutionError";
import ROPA from "./ROPA";

class DetailExecutionTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            list_table: null,
        }
    }

    createTable(diz_value) {
        let columns = []
        Object.entries(diz_value[0]).map(([key, value], index) => {
            columns.push({
                    title: key,
                    dataIndex: key,
                    key: key,
                    sorter: (a, b) => {
                        return a.id > b.id
                    }
                }
            )
        })

        console.log('ciaoooo')

        return <Table
            bordered
            rowKey="id"
            dataSource={diz_value}
            scroll={{x: true}}
            columns={columns}
            // loading={this.state.loading}
            pagination={false}
            style={{width: '85vw'}}
        />

    }

    componentDidMount() {
        const params = {
            execution_id: this.props.exec_id,
        }
        axios.post(window.$API_address + 'frontend/API/getExecutionColumn', params)
            .then(res => {
                // let columns = []
                // Object.entries(res.data[0]).map(([key, value], index) => {
                //     columns.push({
                //             title: key,
                //             dataIndex: key,
                //             key: key,
                //             sorter: (a, b) => {
                //                 return a.id > b.id
                //             }
                //         }
                //     )
                // })
                // this.setState({dataSource: res.data, loading: false, columns: columns})
                // console.log('edoooooooo')
                // console.log(res.data)
                // let result = []
                // Object.entries(res.data).map(([key, value], index) => {
                //     console.log(key, value)
                //     result.push(<Tabs.TabPane tab={key} key={key}>{this.createTable(value)}</Tabs.TabPane>)
                // })

                // result.push(<>{this.createTable(res.data)}</>)
                // console.log(result)
                this.setState({list_table: this.createTable(res.data), loading: false})
            })
            .catch(error => {
                checkError(error)
                this.setState({loading: false})
            })
    }

    render() {
        return (
            <Tabs tabPosition={'top'}>
                <Tabs.TabPane tab="Raw Data" key="1">
                    {/*<Table*/}
                    {/*    bordered*/}
                    {/*    rowKey="id"*/}
                    {/*    dataSource={this.state.dataSource}*/}
                    {/*    scroll={{x: true}}*/}
                    {/*    columns={this.state.columns}*/}
                    {/*    loading={this.state.loading}*/}
                    {/*    pagination={false}*/}
                    {/*    style={{width: '85vw'}}*/}
                    {/*/>*/}
                    {this.state.loading ?
                        <Spin size="large"/> :
                        this.state.list_table ? this.state.list_table : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>

                    }

                </Tabs.TabPane>
                <Tabs.TabPane tab="Plot" key="2">
                    <ExecutionPlot id={this.props.exec_id} api={'frontend/API/getPlotExecution'}/>
                </Tabs.TabPane>
                <Tabs.TabPane tab="ROPA" key="3">
                    <ROPA id={this.props.exec_id} ropa={this.props.ropa}/>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Error" key="4">
                    <ExecutionError id={this.props.exec_id}/>
                </Tabs.TabPane>
            </Tabs>
        )
    }
}

export default DetailExecutionTab;