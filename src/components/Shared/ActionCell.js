import React from "react";
import {Button, Dropdown, Menu, message, Popconfirm, Select, Space} from "antd";
import {DeleteOutlined, DownloadOutlined} from "@ant-design/icons";
import {checkError} from "../Tool";

const axios = require('axios');
import Cookies from "js-cookie";
axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');


class ActionCell extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            loadingDelete: false,
            menu: this.renderDropDown(),
        }
    }

    handleDelete = (e) => {
        this.setState({loadingDelete: true});
        const params = {
            'element_id': this.props.element_id,
            'model_name': this.props.model_name

        }
        axios.post(window.$API_address + 'ExperimentManager/API/deleteElement', params)
            .then(res => {
                this.props.handleDelete(this.props.element_id);
                this.setState({loadingDelete: false})
            }).catch(error => {
            this.setState({loadingDelete: false});
            checkError(error)
        });
    };

    handleClick(e){
        const params = {
            'element_id': this.props.element_id,
            'model_name': this.props.model_name,
            file: this.props.items[e.key]['file'],
        }

        axios.get(window.$API_address + 'frontend/API/getFile',
            {responseType: 'blob', params: params})
            .then(res => {
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                const file_name = this.props.model_name + '_' + this.props.element_id + '_'
                    + this.props.items[e.key]['file'] + this.props.items[e.key]['extension']
                link.setAttribute('download', file_name);
                document.body.appendChild(link);
                link.click();
                message.success('File downloaded')
            })
            .catch(error => {
                message.error("Error downloading the file. File could be missing, or you don't have the permissions.")
            })
    }

    renderDropDown(){
        return(
            <Menu onClick={this.handleClick.bind(this)}>
                {this.menuItem()}
            </Menu>
        )
    }

    menuItem(){
        return Object.keys(this.props.items).map((key, index) => {
            return(<Menu.Item key={key}>{this.props.items[key]['label']}</Menu.Item>)})
    }


    render() {
        return(
            <Space>
                <Dropdown overlay={this.state.menu}>
                    <Button shape="circle">
                        <DownloadOutlined/>
                    </Button>
                </Dropdown>
                <Popconfirm title="Are you sure delete?" onConfirm={this.handleDelete} okText="Yes" cancelText="No">
                    <Button shape="circle" loading={this.state.loadingDelete}><DeleteOutlined/></Button>
                </Popconfirm>
            </Space>
        )
    }
}

export default ActionCell;
