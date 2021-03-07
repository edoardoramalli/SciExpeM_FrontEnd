import React from "react";
import {
    Form,
    Button,
    Input,
    Collapse,
    Space,
    message,
    Select,
    Cascader,
    Row,
    Col,
    Modal,
    Typography,
    Alert,
    InputNumber
} from "antd"
import {
    UploadOutlined, DatabaseOutlined, HomeOutlined,
    LogoutOutlined, MinusOutlined, PlusOutlined, MinusCircleOutlined
} from '@ant-design/icons';
import AddColumnModal from "./ExperimentForm/AddColumnModal";
import Variables from "./Variables";

const axios = require('axios');

const {confirm} = Modal;



class Tmp extends React.Component {




    constructor(props) {
        super(props);
        this.state = {
            visible: {},
            columnResult: {}
        }


    }

    cancelModal(index){
        let new_dict = {}
        for (let key in this.state.columnResult){
            if (key !== index.toString()){
                new_dict[key] = this.state.columnResult[key]
            }
        }
        this.setState({columnResult: new_dict});
    }

    handleModal(value){
        console.log(value)
        this.hideModal(value['index'])
        let new_dict = this.state.columnResult;
        new_dict[value['index']] = value['data_column']
        this.setState({columnResult: new_dict});
    }

    showModal(index){
        console.log("EDoawd", this.state.columnResult)
        let new_dict = this.state.visible;
        new_dict[index] = true
        this.setState({visible: new_dict});
    };

    hideModal = (index) => {
        let new_dict = this.state.visible;
        new_dict[index] = false
        this.setState({visible: new_dict});
    };

    onFinish(){

    }

    onFinishFailed(){

    }


    render() {

        return (
            <>
                <Form
                    onFinish={this.onFinish}
                    onFinishFailed={this.onFinishFailed}
                    layout="vertical"
                    autoComplete="off"
                    // ref={this.formRef}
                >


                <Form.List name="data_columns" ref={this.formRef}>
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(field => (
                                <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">

                                    <Button block onClick={()=>this.showModal(field.key)} style={{width: 500}}>
                                        Data Column {field.key}
                                    </Button>
                                    <AddColumnModal
                                        dg_id={'dg1'}
                                        index={field.key}
                                        modalVisible={this.state.visible[field.key]}
                                        hideModel={()=>this.hideModal(field.key)}
                                        handleModal={this.handleModal.bind(this)}
                                    />
                                    <MinusCircleOutlined
                                        onClick={() => {
                                            remove(field.name)
                                            this.cancelModal(field.key)
                                        }} />
                                </Space>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} style={{width: 500}}>
                                    Add field
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
                </Form>
            </>
        )
    }
}

export default Tmp;