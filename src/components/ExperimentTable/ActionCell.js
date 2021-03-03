import React from "react";

const axios = require('axios');
import {Button, Dropdown, Menu, message, Popconfirm} from "antd";
import {DeleteOutlined, DownloadOutlined} from "@ant-design/icons";
import Cookies from "js-cookie";
import {checkError} from "../../components/Tool"

axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

class ActionCell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingDelete: false,
        }
    }

    handleDelete = (e) => {
        const e_id = this.props.e_id;
        this.setState({loadingDelete: true});
        const params = {
            'element_id': e_id.toString(),
            'model_name': 'Experiment'

        }
        axios.post(window.$API_address + 'ExperimentManager/API/deleteElement', params)
            .then(res => {
                this.props.handleDelete(e_id);
                this.setState({loadingDelete: false})

            }).catch(error => {
            this.setState({loadingDelete: false});
            checkError(error)
        });
    };

    handleClick = (e) => {
        const params = {
            exp_id: this.props.e_id,
            file: e.key,
        }

        let extension;

        if (e.key === 'OpenSMOKEpp') {
            extension = '.dic'
        } else if (e.key === 'ReSpecTh') {
            extension = '.xml'
        } else if (e.key === 'excel') {
            extension = '.xlsx'
        }

        axios.get(window.$API_address + 'frontend/API/getExperimentFile',
            {responseType: 'blob', params: params})
            .then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;

                const file_name = this.props.file_doi + extension
                link.setAttribute('download', file_name);

                document.body.appendChild(link);
                link.click();
                message.success(e.key + ' file downloaded')
            })
            .catch(error => {
                message.error("Error downloading the file. File could be missing, or you don't have the permissions.")
            })
    }

    render() {
        const menu = (
            <Menu onClick={this.handleClick}>
                <Menu.Item key="ReSpecTh">XML Respecth</Menu.Item>
                <Menu.Item key="excel">Excel</Menu.Item>
                <Menu.Item key="OpenSMOKEpp">Opensmoke Input</Menu.Item>
            </Menu>
        );

        return (
            <div>
                <Dropdown overlay={menu}>
                    <Button shape="circle">
                        <DownloadOutlined/>
                    </Button>
                </Dropdown>
                <Popconfirm title="Are you sure delete this experiment?" onConfirm={this.handleDelete} okText="Yes"
                            cancelText="No">
                    <Button shape="circle" loading={this.state.loadingDelete}><DeleteOutlined/>
                    </Button>
                </Popconfirm>
            </div>

        )
    }
}

export default ActionCell;