import React from "react";
import {Button, Form, Space} from "antd";
import AddColumnModal from "./AddColumnModal";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";

class DataColumns extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: {},
            columnResult: {},
            columnName: {},
        }
    }

    cancelModal= (index) => {
        let new_dict = {}
        for (let key in this.state.columnResult){
            if (key !== index.toString()){
                new_dict[key] = this.state.columnResult[key]
            }
        }
        this.setState({columnResult: new_dict})
        this.props.handleDataColumns(new_dict)
    }

    handleModal(value){
        this.hideModal(value['index'])
        let new_dict = this.state.columnResult;
        new_dict[value['index']] = value['data_column']
        this.setState({columnResult: new_dict}, ()=>{
            this.props.handleDataColumns(this.state.columnResult)
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

    getColumnName(columnName, name){
        if (name in columnName){
            return columnName[name]
        }
        else{
            let new_dict = columnName
            new_dict[name] = name
            this.setState({columnName: new_dict})
            return name
        }
    }

    setColumnName(index, name){
        let new_dict = this.state.columnName
        new_dict[index] = name
        this.setState({columnName: new_dict})
    }

    render() {
        return(
            <Form.List name="experimental_data">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(field => (

                            <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">

                                <Button block onClick={()=>this.showModal(field.key)} style={{width: 500}}>
                                    Data Column {this.getColumnName(this.state.columnName, field.key)}
                                </Button>
                                <AddColumnModal
                                    dataGroupAssociation={this.props.dataGroupAssociation}
                                    setColumnName={this.setColumnName.bind(this)}
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
                                Add Data Column
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
        )
    }
}

export default DataColumns;