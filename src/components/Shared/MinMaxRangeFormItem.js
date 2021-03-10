import React from "react";
import {Form, Input, InputNumber} from "antd";

class MinMaxRangeFormItem extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            inf: this.props.min
        }

    }

    onChangeInf = value => {
        this.setState({inf: value})
    }

    render() {
        return(
            <Form.Item
                label={this.props.label}
                name={this.props.groupName}
                rules={[{required: this.props.required, message: ''}]}
            >
                <Input.Group compact>
                    <Form.Item
                        name={[this.props.groupName, this.props.minName]}
                        noStyle
                        rules={[{required: this.props.required, message: this.props.minMessage}]}
                    >
                        <InputNumber
                            style={{width: 100, textAlign: 'center'}}
                            min={this.props.min} max={this.props.max} step={this.props.step}
                            onChange={this.onChangeInf}
                            placeholder={'Min'}
                        />
                    </Form.Item>
                    <Input
                        className="site-input-split"
                        style={{
                            width: 30,
                            borderLeft: 0,
                            borderRight: 0,
                            pointerEvents: 'none',
                        }}
                        placeholder="~"
                        disabled
                    />
                    <Form.Item
                        name={[this.props.groupName, this.props.maxName]}
                        noStyle
                        rules={[{required: this.props.required, message: this.props.minMessage}]}
                    >
                        <InputNumber
                            className="site-input-right"
                            style={{
                                width: 100,
                                textAlign: 'center',
                            }}
                            placeholder={'Max'}
                            min={this.state.inf} max={this.props.max} step={this.props.step}
                        />
                    </Form.Item>
                </Input.Group>
            </Form.Item>

        )
    }
}

export default MinMaxRangeFormItem;