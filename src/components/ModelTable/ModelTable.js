import React from "react";
import {checkError} from "../Tool";
import {message, Table, Tree} from "antd";
import ActionCell from "../Shared/ActionCell";

const axios = require('axios');
import Cookies from "js-cookie";
import InnerTableModels from "./InnerTableModels";
axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

class ModelTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            models: [],
            models_association: {},
        }
    }

    componentDidMount() {
        this.setState({loading: true});

        const params = {
            fields: ['id', 'name', 'version'],
            model_name: 'ChemModel',
            query: {}
        }
        axios.post(window.$API_address + 'ExperimentManager/API/filterDataBase', params)
            .then(res => {
                const query_res = res.data
                let models = {}
                query_res.forEach(item => {
                    const version = item['version']
                    delete item.version
                    if (!(version in models)) {
                        models[version] = []
                    }
                    models[version].push(item)
                })

                let result = []
                Object.keys(models).map((key) => {
                    result.push(
                        {version: key, others: models[key]}
                    )
                })

                this.setState(
                    {
                        models: result,
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
                title: 'Version',
                dataIndex: 'version',
                key: 'version',
                sorter: (a, b) => {
                    return a.version.localeCompare(b.version)
                },

            },
        ];

        return (
            <Table
                // title={()=> this.props.header ? header : undefined}
                columns={columns}
                scroll={{y: '100%'}}
                // rowSelection={rowSelection}
                dataSource={this.state.models}
                rowKey="version"
                size='small'
                // loading={this.props.loading}
                bordered
                style={{minHeight: 100}}
                expandRowByClick={true}
                expandedRowRender={record => {return <InnerTableModels models_list={record.others}/>}}
            />


        )
    }

}

export default ModelTable;