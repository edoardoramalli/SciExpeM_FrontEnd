import React from "react";
import {Button, Form, Space} from "antd";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import AddProfileModal from "./AddProfileModal";

class ProfileColumns extends React.Component{
    formRef = React.createRef();
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
        this.setState({columnResult: new_dict}, ()=>{
            this.props.handleProfileColumns(this.state.columnResult)
        });
    }

    handleModal(value){
        this.hideModal(value['index'])
        let new_dict = this.state.columnResult;
        new_dict[value['index']] = value['data_column']
        this.setState({columnResult: new_dict}, ()=>{
            this.props.handleProfileColumns(this.state.columnResult)
        });
    }

    showModal(index){
        let new_dict = this.state.visible;
        new_dict[index] = true
        this.setState({visible: new_dict});
    };

    hideModal = (index) => {
        let new_dict = this.state.visible;
        new_dict[index] = false
        this.setState({visible: new_dict});
    };
    render() {
        return(
            <Form.List name="profile_data" ref={this.formRef}>
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(field => (
                            <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">

                                <Button block onClick={()=>this.showModal(field.key)} style={{width: 500}}>
                                    Profile {field.key}
                                </Button>
                                <AddProfileModal
                                    getDataGroup={this.props.getDataGroup}
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
                                Add Profile
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
        )
    }
}

export default ProfileColumns;