import React from "react";
import {Menu, Switch} from "antd";

const axios = require('axios');
import {
    UploadOutlined, DatabaseOutlined, HomeOutlined, LineChartOutlined, DeploymentUnitOutlined,
    LogoutOutlined, ExperimentOutlined, FileOutlined, DashboardOutlined, CheckOutlined, BlockOutlined
} from '@ant-design/icons';

class NavBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: 'user.name'
        }
    }

    handleMenuClick = (e) => {
        if (e.key === "logout") {
            window.location.href = "/accounts/logout";
        } else if (e.key === 'home') {
            window.location.href = "https://sciexpem.polimi.it";
        } else if (e.key === 'switch'){
            return
        } else {
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
        return (
            <Menu
                // theme="dark"
                mode="horizontal"
                selectedKeys={[this.props.current]}
                onClick={this.handleMenuClick}

                style={{width: '100vw', position: 'absolute', top: 0, left: 0}}
            >
                <Menu.Item key="home"><HomeOutlined/> Home</Menu.Item>
                <Menu.Item key="homepage"><BlockOutlined/> Control</Menu.Item>
                <Menu.SubMenu
                    title={
                        <span className="submenu-title-wrapper">
                            <DatabaseOutlined/> DataBase
                        </span>
                    }>

                    <Menu.Item key="experiments"><ExperimentOutlined/> Experiments</Menu.Item>
                    <Menu.Item key="models"><FileOutlined/> Models</Menu.Item>
                    <Menu.Item key="species"><DeploymentUnitOutlined/> Species</Menu.Item>
                </Menu.SubMenu>
                <Menu.SubMenu
                    title={
                        <span className="submenu-title-wrapper">
                            <UploadOutlined/> Insert
                        </span>
                    }>

                    <Menu.Item key="experimentInputFile">Insert ReSpecTh File</Menu.Item>

                    <Menu.Item key="experimentInputForm">Insert Experiment</Menu.Item>

                    <Menu.Item key="chemModelInputForm">Insert ChemModel</Menu.Item>
                </Menu.SubMenu>

                <Menu.Item key="analysis"><LineChartOutlined/> Analysis</Menu.Item>

                <Menu.Item key="validation"><CheckOutlined/> Validation</Menu.Item>

                <Menu.Item key="dashboard"><DashboardOutlined/> Dashboard</Menu.Item>

                <Menu.Item key={"switch"} style={{marginLeft: 'auto'}}>
                    <Switch
                        checkedChildren={"Light"}
                        unCheckedChildren={"Dark"}
                        onChange={this.props.switchTheme}
                        checked={this.props.theme === 'normal'}
                    />
                </Menu.Item>


                <Menu.Item key="logout">
                    <LogoutOutlined/> Log Out - {this.state.username}
                </Menu.Item>

            </Menu>
        )
    }
}

export default NavBar;