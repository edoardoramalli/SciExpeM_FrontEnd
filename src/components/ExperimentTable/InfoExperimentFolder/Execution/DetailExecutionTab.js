import React, {lazy} from "react";
import {Table, Tabs} from "antd";
import {checkError} from "../../../Tool";

const axios = require('axios');
import Cookies from "js-cookie";
axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

const ExecutionPlot = lazy(() => import('./ExecutionPlot'))

class DetailExecutionTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        }
    }

    componentDidMount() {
        const params = {
            execution_id: this.props.exec_id
        }
        axios.post(window.$API_address + 'frontend/API/getExecutionColumn', params)
            .then(res => {
                let columns = []
                Object.entries(res.data[0]).map(([key, value], index) => {
                    columns.push({
                        title: key,
                        dataIndex: key,
                        key: key,
                        sorter: (a, b) => {return a.id > b.id}}
                    )
                })
                this.setState({dataSource: res.data, loading: false, columns: columns})
            })
            .catch(error => {
                checkError(error)
                this.setState({loading: false})
            })
    }

    render() {
        return(
            <Tabs tabPosition={'top'}>
                <Tabs.TabPane tab="Raw Data" key="1">
                    <Table
                        bordered
                        rowKey="id"
                        dataSource={this.state.dataSource}
                        columns={this.state.columns}
                        loading={this.state.loading}
                    />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Plot" key="2">
                    <ExecutionPlot id={this.props.exec_id} api={'frontend/API/getPlotExecution'}/>
                </Tabs.TabPane>
            </Tabs>
        )
    }
}

export default DetailExecutionTab;