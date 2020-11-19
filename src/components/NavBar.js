import React from "react";
import {Icon, Menu} from "antd";
import axios from "axios";

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
        this.props.updateStateApp(e);
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
                <Menu.Item key="main" disabled><b>SciExpeM</b></Menu.Item>
                <Menu.SubMenu
                    title={
                        <span className="submenu-title-wrapper">
                            <Icon type="upload"/>
                            Insert
                        </span>
                    }>

                    <Menu.Item key="input" disabled>Insert using input file</Menu.Item>

                    <Menu.Item key="input-form">Insert Experiment</Menu.Item>
                </Menu.SubMenu>

                <Menu.Item key="experiments"><Icon type="database"/>Experimental Database</Menu.Item>
                <Menu.Item key="searchandexecute" disabled><Icon type="line-chart"/>Search & Execute</Menu.Item>
                <Menu.Item key="about" disabled><Icon type="info-circle"/>About</Menu.Item>
                <Menu.Item key="logout" style={{"float": "right"}}>
                    <Icon type="logout"/>
                    Log Out - {this.state.username}
                </Menu.Item>

            </Menu>
        )
    }
}

export default NavBar;