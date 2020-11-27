import React from "react";
import axios from "axios";
import {Button, Dropdown, Menu, message, Popconfirm} from "antd";
import {DeleteOutlined, DownloadOutlined} from "@ant-design/icons";

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
        axios.get(window.$API_address + 'frontend/api/experiment/delete/' + e_id.toString())
            .then(res => {
                this.props.handleDelete(e_id);
                this.setState({loadingDelete: false})

            }).catch(error => {
            // console.log(error.response)
            this.setState({loadingDelete: false});
            message.error('Error deleting experiment')
        });
    };

    handleClick = (e) => {
        let exp_id = this.props.e_id;
        let file_doi = this.props.file_doi;
        if (e.key === 'opensmoke') {

            const request_url = window.$API_address + 'frontend/api/experiment/download/input_file/' + exp_id.toString();
            axios.get(request_url, {
                responseType: 'blob',
                timeout: 30000
            })
                .then(res => {
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement('a');
                    link.href = url;

                    const file_name = file_doi + ".dic"
                    link.setAttribute('download', file_name);

                    document.body.appendChild(link);
                    link.click();
                    message.success('Opensmoke input file downloaded')
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                    message.error('Error. The OS input is not available')
                })
        }
        else if (e.key === 'excel') {

            const request_url = window.$API_address + 'frontend/api/experiment/download/excel/' + exp_id.toString();
            axios.get(request_url, {
                responseType: 'blob',
                timeout: 30000
            })
                .then(res => {
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement('a');
                    link.href = url;

                    const file_name = file_doi + ".xlsx"
                    link.setAttribute('download', file_name);

                    document.body.appendChild(link);
                    link.click();
                    message.success('Excel file downloaded')
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                    message.error('Error Downloading file')
                })
        }
        else if (e.key === 'xml'){
            const request_url =
                window.$API_address + 'frontend/api/experiment/download/respecth_file/' + exp_id.toString();
            axios.get(request_url, {
                responseType: 'blob',
                timeout: 30000
            })
                .then(res => {
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement('a');
                    link.href = url;

                    const file_name = file_doi + ".xml"
                    link.setAttribute('download', file_name);

                    document.body.appendChild(link);
                    link.click();
                    message.success('ReSpecTh input file downloaded')
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                    message.error('Error Downloading file')
                })
        }


    };

    render() {
        const menu = (
            <Menu onClick={this.handleClick}>
                <Menu.Item key="xml">XML Respecth</Menu.Item>
                <Menu.Item key="excel">Excel</Menu.Item>
                <Menu.Item key="opensmoke">Opensmoke Input</Menu.Item>
            </Menu>
        );

        return (
            <div>
                <Dropdown overlay={menu}>
                    <Button shape="circle" >
                        <DownloadOutlined />
                    </Button>
                </Dropdown>
                <Popconfirm title="Are you sure delete this experiment?" onConfirm={this.handleDelete} okText="Yes"
                            cancelText="No">
                    <Button shape="circle" loading={this.state.loadingDelete}><DeleteOutlined />
                    </Button>
                </Popconfirm>
            </div>

        )
    }
}

export default ActionCell;