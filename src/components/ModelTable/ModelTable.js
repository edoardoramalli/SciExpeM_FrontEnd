import React from "react";
import {checkError} from "../Tool";
import {message, Tree} from "antd";
import ActionCell from "../Shared/ActionCell";

const axios = require('axios');
import Cookies from "js-cookie";
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
            fields: ['id', 'name', 'version']
        }
        axios.post(window.$API_address + 'frontend/API/getModelList', params)
            .then(res => {
                const models = JSON.parse(res.data)
                console.log(models)
                let versions = {}
                let models_association = {}
                models.forEach(item => {
                    if (!(item['version'] in versions)) {
                        versions[item['version']] = []
                    }
                    versions[item['version']].push(
                        {
                            title: item['name'] + ' [ID: ' + item['id'] + '] (Click to Download)' ,
                            key: item['id'],
                            isLeaf: true
                        }
                    )
                    models_association[item['id']] = item['name']
                })
                let result = []
                Object.keys(versions).map((key) => {
                    result.push(
                        {title: key, key: 'version_' + key, children: versions[key], selectable: false}
                    )
                })
                console.log(result)
                this.setState(
                    {
                        models: result,
                        models_association: models_association,
                        loading: false,
                    }
                )
            })
            .catch(error => {
                this.setState({loading: false})
                checkError(error)
            })
    }

    onSelect = (key) =>{
        const model_name = 'ChemModel'
        const params = {
            'element_id': key.toString(),
            'model_name': model_name,
            'file': 'model',
        }
        axios.get(window.$API_address + 'frontend/API/getFile',
            {responseType: 'blob', params: params})
            .then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                const file_name = model_name + '_' + this.state.models_association[key] + '.zip'
                link.setAttribute('download', file_name);
                document.body.appendChild(link);
                link.click();
                message.success('File downloaded')
            })
            .catch(error => {
                message.error("Error downloading the file. File could be missing, or you don't have the permissions.")
            })
    }

    render() {

        return (
            <Tree.DirectoryTree
                multiple
                defaultExpandAll
                onSelect={this.onSelect}
                // onExpand={onExpand}
                treeData={this.state.models}
            />
        )
    }

}

export default ModelTable;