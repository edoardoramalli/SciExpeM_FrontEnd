import React from "react";
import {Menu} from "antd";
import axios from "axios";
import {UploadOutlined, DatabaseOutlined, HomeOutlined, LogoutOutlined} from '@ant-design/icons';

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
                defaultSelectedKeys={[this.state.current]}
                onClick={this.handleMenuClick}
                style={{lineHeight: '64px'}}
            >
                <Menu.Item key="home"><HomeOutlined />Home</Menu.Item>
                <Menu.Item key="experiments"><DatabaseOutlined />Experimental Database</Menu.Item>
                {/*<Menu.Item key="main" disabled><b>SciExpeM</b></Menu.Item>*/}
                <Menu.SubMenu
                    title={
                        <span className="submenu-title-wrapper">
                            <UploadOutlined />
                            Insert
                        </span>
                    }>

                    <Menu.Item key="input" >Insert ReSpecTh File</Menu.Item>

                    <Menu.Item key="input-form">Insert Experiment</Menu.Item>
                </Menu.SubMenu>


                {/*<Menu.Item key="searchandexecute" disabled><LineChartOutlined />Search & Execute</Menu.Item>*/}
                {/*<Menu.Item key="about" disabled><InfoCircleOutlined />About</Menu.Item>*/}
                <Menu.Item key="logout" style={{"float": "right"}}>
                    <LogoutOutlined />
                    Log Out - {this.state.username}
                </Menu.Item>

            </Menu>
        )
    }
}

export default NavBar;