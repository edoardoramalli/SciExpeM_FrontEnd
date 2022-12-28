import React from "react";
import {checkError} from "../Tool";
import {Layout, Card, Row, Col, Space} from "antd";
import ActionCell from "../Shared/ActionCell";

const {Header, Content, Footer, Sider} = Layout;

import {FormOutlined, FileAddOutlined, FileExcelOutlined, ExperimentOutlined, FileOutlined, DeploymentUnitOutlined} from '@ant-design/icons';

const axios = require('axios');
import Cookies from "js-cookie";


axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

class Homepage extends React.Component {

    render() {
        const gridStyle = {
            width: '33.3333333%',
            textAlign: 'center',
            cursor: 'pointer',
        };

        const headStyle = {
            fontSize: 25,
            fontWeight: 900,
            textAlign: "center",
            fontVariant: 'small-caps'
        }

        return (
            <Content>
                <Card title="Insert" headStyle={headStyle}>
                    <Card.Grid style={gridStyle} onClick={() => this.props.updateStateUpDirect('experimentInputForm')}>
                        <FormOutlined style={{fontSize: "20px"}}/> <br/>Experiment (Form)
                    </Card.Grid>
                    <Card.Grid style={gridStyle} onClick={() => this.props.updateStateUpDirect('experimentInputFile')}>
                        <FileExcelOutlined style={{fontSize: "20px"}}/> <br/>Experiment (ReSpecTh XML)
                    </Card.Grid>
                    <Card.Grid style={gridStyle} onClick={() => this.props.updateStateUpDirect('experiments')}>
                        <FileAddOutlined style={{fontSize: "20px"}}/> <br/>Experiment (JSON)
                    </Card.Grid>
                    <Card.Grid style={gridStyle} onClick={() => this.props.updateStateUpDirect('chemModelInputForm')}>
                        <FileAddOutlined style={{fontSize: "20px"}}/> <br/>Kinetic Model (Form)
                    </Card.Grid>
                    <Card.Grid style={gridStyle} onClick={() => this.props.updateStateUpDirect('species')}>
                        <FileAddOutlined style={{fontSize: "20px"}}/> <br/>Specie (Form)
                    </Card.Grid>
                </Card>
                <Card title="Visualize" headStyle={headStyle}>
                    <Card.Grid style={gridStyle} onClick={() => this.props.updateStateUpDirect('experiments')}>
                        <ExperimentOutlined style={{fontSize: "20px"}}/> <br/>Experiments
                    </Card.Grid>
                    <Card.Grid style={gridStyle} onClick={() => this.props.updateStateUpDirect('models')}>
                        <FileOutlined style={{fontSize: "20px"}}/> <br/>Kinetic Models
                    </Card.Grid>
                    <Card.Grid style={gridStyle} onClick={() => this.props.updateStateUpDirect('species')}>
                        <DeploymentUnitOutlined style={{fontSize: "20px"}}/> <br/>Specie
                    </Card.Grid>
                </Card>
            </Content>
        )
    }

}

export default Homepage;