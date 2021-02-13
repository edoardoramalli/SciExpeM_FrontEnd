import React from "react";
import {Form, Select} from "antd";

class ExperimentType extends React.Component{
    constructor(props) {
        super(props);
    }

    onChange = e => {
        this.props.handleReactorType(e)
    }

    render() {
        return(
            <Form.Item
                label="Reactor Type"
                name="reactor_type"
                rules={[{required: true, message: 'Please insert reactor type.'}]}
            >
                <Select
                    placeholder="Select a reactor type"
                    allowClear={true}
                    style={{width: "35%"}}
                    disabled={this.props.reactor_inactive}
                    value={this.props.reactor_value} // se cambio tipo di esperimento non torna il placeholder ma cambia lo stesso il valore
                    onChange={this.onChange}
                >
                    {this.props.reactor_list}
                </Select>
            </Form.Item>
        )
    }
}

export default ExperimentType;