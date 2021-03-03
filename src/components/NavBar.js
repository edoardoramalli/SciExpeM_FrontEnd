import React from "react";
import {Menu} from "antd";
const axios = require('axios');
import {UploadOutlined, DatabaseOutlined, HomeOutlined,
    LogoutOutlined, ExperimentOutlined, FileOutlined} from '@ant-design/icons';

class NavBar extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            username: 'user.name'
        }
    }

    handleMenuClick = (e) => {
        if (e.key === "logout"){
            window.location.href="/accounts/logout";
        }
        else if (e.key === 'home'){
            window.location.href="/";
        }
        else{
            this.props.updateStateApp(e);
        }
    };

    componentDidMount() {
        axios.get(window.$API_address + 'frontend/api/get_username')
            .then(res => {
                const response = res.data;
                this.setState({username: response['username']});
            })
    }

    render() {
        return(
            <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={[this.props.current]}
                onClick={this.handleMenuClick}
                style={{lineHeight: '64px'}}
            >
                <Menu.Item key="home"><HomeOutlined />Home</Menu.Item>
                <Menu.SubMenu
                    title={
                        <span className="submenu-title-wrapper">
                            <DatabaseOutlined />
                            DataBase
                        </span>
                    }>

                    <Menu.Item key="experiments"><ExperimentOutlined />Experiments</Menu.Item>

                    <Menu.Item key="models"><FileOutlined />Models</Menu.Item>
                </Menu.SubMenu>
                <Menu.SubMenu
                    title={
                        <span className="submenu-title-wrapper">
                            <UploadOutlined />
                            Insert
                        </span>
                    }>

                    <Menu.Item key="experimentInputFile" >Insert ReSpecTh File</Menu.Item>

                    <Menu.Item key="experimentInputForm">Insert Experiment</Menu.Item>

                    <Menu.Item key="chemModelInputForm">Insert ChemModel</Menu.Item>
                </Menu.SubMenu>

                <Menu.Item key="logout" style={{"float": "right"}}>
                    <LogoutOutlined />
                    Log Out - {this.state.username}
                </Menu.Item>

            </Menu>
        )
    }
}

export default NavBar;