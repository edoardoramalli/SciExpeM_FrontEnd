import React from "react";
import {Button, Modal} from "antd";
import {QuestionCircleOutlined} from "@ant-design/icons";

import { text } from './helpText';

class HelpGuide extends React.Component{
    constructor() {
        super();
        this.state = {
            modalVisible: false
        }
    }
    showModal (){
        this.setState({modalVisible: true})
    }
    handleCancel = () => this.setState({modalVisible: false});
    render() {
        return(
            <>
                <Button
                    shape="circle"
                    icon={<QuestionCircleOutlined />}
                    onClick={this.showModal.bind(this)}
                >

                </Button>
                <Modal visible={this.state.modalVisible} footer={null} width={800}
                       onCancel={this.handleCancel}>
                    {text}
                </Modal>
            </>
        )
    }
}

export default HelpGuide;