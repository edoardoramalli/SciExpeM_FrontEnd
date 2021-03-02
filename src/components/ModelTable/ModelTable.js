import React from "react";
import {checkError} from "../Tool";
import {Button, Input, Table} from "antd";
const axios = require('axios');

class ModelTable extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            models: [],
        }
    }

    componentDidMount() {
        this.setState({loading: true});

        const params = {
            fields: ['id', 'name']
        }
        axios.post(window.$API_address + 'frontend/API/getModelList', params)
            .then(res => {
                const models = JSON.parse(res.data)
                this.setState(
                    {
                        models: models,
                        loading: false,
                    }
                )
            })
            .catch(error => {
                this.setState({loading: false})
                checkError(error)
            })
    }

    render() {

        const columns = [
            {
                title: 'Model Name',
                dataIndex: 'name',
                key: 'name',
                width: '20%',
                sorter: (a, b) => {
                    return a.name.localeCompare(b.name)
                },

            },
            {
                title: 'Id',
                dataIndex: 'id',
                key: 'id',
                width: '7%',
                sorter: (a, b) => {
                    return a.id > b.id
                },
            }
            ]
        return(
            <Table
                scroll={{y: '100%'}}
                columns={columns}
                dataSource={this.state.models}
                rowKey="id"
                loading={this.state.loading}
                bordered
            />
        )
    }

}

export default ModelTable;