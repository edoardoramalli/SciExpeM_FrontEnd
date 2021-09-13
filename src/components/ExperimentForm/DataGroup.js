import React from "react";
import {Button, Collapse, Row, Space, Table, Tabs, Select} from "antd";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";


class DataGroup extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataGroupObjectList: {},
        }
    }
    remove(name){
        let listObject = this.state.dataGroupObjectList
        delete listObject[name]
        this.setState({dataGroupObjectList: listObject})
        let association = this.props.dataGroupAssociation
        delete association[name]
        this.props.onChangeDataGroupAssociation(association)
    }

    onChange(name, value){
        let association = this.props.dataGroupAssociation
        association[name] = value
        this.props.onChangeDataGroupAssociation(association)
    }

    add(){
        let listObject = this.state.dataGroupObjectList
        const currentKey = 'dg' + this.props.getDataGroup().toString()
        let association = this.props.dataGroupAssociation
        association[currentKey] = null
        this.props.onChangeDataGroupAssociation(association)
        listObject[currentKey] =
            <Row key={currentKey}>
                <Space>
                    <>Data Group {currentKey}</>
                    <Select
                        placeholder={"Select Type of Data Group"}
                        onChange={this.onChange.bind(this, currentKey)}
                        style={{width: 350}}
                    >
                        <Select.Option value={'experimental_data'}>Experimental Data</Select.Option>
                        <Select.Option value={'initial_condition'}>Initial Condition</Select.Option>
                    </Select>
                    <MinusCircleOutlined onClick={this.remove.bind(this, currentKey)} />
                </Space>
            </Row>
        this.setState({dataGroupObjectList: listObject})
    }

    render() {
        return (
            <Space direction='vertical'>
                {Object.values(this.state.dataGroupObjectList)}
                <Button type="dashed" onClick={this.add.bind(this)} block icon={<PlusOutlined />} style={{width: 460}}>
                    Add Data Group
                </Button>
            </Space>

        )
    }
}

export default DataGroup;