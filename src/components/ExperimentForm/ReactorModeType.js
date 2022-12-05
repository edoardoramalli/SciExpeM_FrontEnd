import React from "react";
import {Form, Select} from "antd";

import Variables from "../Variables";

const {reactor_modes} = Variables

class ReactorModeType extends React.Component{
    constructor(props) {
        super(props);
    }



    render() {
        return(
            <Form.Item
                label="Reactor Mode"
                name="reactor_modes"
                rules={[{required: this.props.reactor_value === 'flame', message: 'Please insert reactor modes.'}]}
            >
                <Select
                    placeholder="Select a reactor mode"
                    // mode="multiple"
                    allowClear={true}
                    style={{width: "35%"}}
                    disabled={this.props.reactor_value !== 'flame'}
                >
                    {reactor_modes.map((item) => {
                        return (
                            <Select.Option value={item} style={{"textTransform": "capitalize"}}>{item}</Select.Option>
                        )
                    })}
                </Select>
            </Form.Item>
        )
    }
}

export default ReactorModeType;