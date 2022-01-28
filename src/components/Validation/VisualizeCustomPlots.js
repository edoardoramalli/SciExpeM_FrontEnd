import React from "react";
import {Button, Col, Row, Modal, Form, InputNumber, Select} from "antd";
import VisualizeSingleGroupPlot from "./VisualizeSingleGroupPlot";
import {PlusOutlined} from '@ant-design/icons';


class VisualizeCustomPlots extends React.Component {
    formRef = React.createRef();

    constructor() {
        super();
        this.state = {
            elements: [],
            modalVisible: false,
        }
    }

    handleOk = () => {
        this.setState({modalVisible: false})
    }

    handleCancel = () => {
        this.setState({modalVisible: false})
    }

    addPlot = () => {
        this.setState({modalVisible: true})
    }

    onFinish = (values) => {

        let tmp = this.state.elements

        tmp.push(<Col><VisualizeSingleGroupPlot query={{execution__experiment__id: values.exp_id}}
                                                target={values.target} {...this.props}/></Col>)


        this.setState({
            elements: tmp,
            modalVisible: false
        }, () => {
            this.formRef.current.resetFields();
        })

    }

    onFinishFailed = () => {

    }

    render() {
        return (
            <>
                <Modal title="Add Plot"
                       visible={this.state.modalVisible}
                       onOk={this.handleOk}
                       onCancel={this.handleCancel}
                       footer={null}
                >
                    <Form
                        name="basic"
                        layout="vertical"
                        autoComplete="off"
                        onFinish={this.onFinish}
                        onFinishFailed={this.onFinishFailed}
                        ref={this.formRef}
                    >
                        <Form.Item
                            label="Experiment ID"
                            name="exp_id"
                            rules={[{required: true, message: 'Please select experiment ID.'}]}
                        >
                            <InputNumber min={1} max={10000}/>
                            {/*{this.state.propertyObject}*/}
                        </Form.Item>
                        <Form.Item
                            label="Target"
                            name="target"
                            rules={[{required: true, message: 'Please select target.'}]}
                        >
                            <Select
                                showSearch
                                style={{width: 200}}
                                placeholder="Search to Select"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                filterSort={(optionA, optionB) =>
                                    optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                }
                            >
                                {this.props.targets.map(t => {
                                    return <Select.Option value={t}>{t}</Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Add Plot
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
                <Row justify="space-around" align="middle">
                    <Button onClick={this.addPlot} size={'large'} icon={<PlusOutlined />}>Add Plot</Button>
                </Row>
                <Row>{this.state.elements}</Row>
            </>

        )
    }
}

export default VisualizeCustomPlots;