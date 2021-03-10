import React from "react";
import {checkError} from "../Tool";
import {Table} from "antd";
import ActionCell from "../Shared/ActionCell";

const axios = require('axios');
import Cookies from "js-cookie";
axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

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

    handleDelete = (e_id) => {this.setState({models: this.state.models.filter(item => item.id !== e_id)});};

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
            },
            {
                title: 'Action',
                dataIndex: 'actions',
                key: 'actions',
                width: '50px',
                render: (text, record) =>
                    <ActionCell
                        items={{'ChemModel': {'label': 'Model (.zip)', 'extension': '.zip', 'file': 'model'}}}
                        element_id={record.id}
                        model_name={'ChemModel'}
                        handleDelete={this.handleDelete}
                    />
            },
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