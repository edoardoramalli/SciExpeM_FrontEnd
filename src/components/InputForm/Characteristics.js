import React from "react";
import {Col, Form, Input, Select, Slider} from "antd";
import axios from "axios";

class Characteristics extends React.Component{
    constructor() {
        super();
        this.state = {
            list_fuels: null
        }
    }
    componentDidMount() {
        axios.get(window.$API_address + 'frontend/api/opensmoke/fuels_names')
            .then(res => {
                const names = res.data.names

                this.setState({
                    list_fuels: names.map(item =>
                        <Option key={item} value={item}>{item}</Option>
                    )
                })

            })
    }
    render() {
        const marks_temperature = {
            0: {
                style: {
                    color: '#00AAFF',
                },
                label: <strong>0 K</strong>,
            },
            250: '250 K',
            500: '500 K',
            750: '750 K',
            1000: '1000 K',
            1250: '1250 K',
            1500: {
                style: {
                    color: '#f50',
                },
                label: <strong>1500 K</strong>,
            },
        };

        const marks_pressure = {
            0: {
                style: {
                    color: '#00AAFF',
                },
                label: <strong>0 Bar</strong>,
            },
            250: '250 Bar',
            500: '500 Bar',
            750: '750 Bar',
            1000: '1000 Bar',
            1250: '1250 Bar',
            1500: {
                style: {
                    color: '#f50',
                },
                label: <strong>1500 Bar</strong>,
            },
        };


        const marks_equivalent = {
            0: {
                style: {
                    color: '#00AAFF',
                },
                label: <strong>0</strong>,
            },
            5: '5',
            10: '10',
            15: '15',
            20: '20',
            100: {
                style: {
                    color: '#f50',
                },
                label: <strong>+ INF</strong>,
            },
        };
        return(
            <>
                <Form.Item
                    label="Temperature Profile"
                    name="t_profile"
                    rules={[{required: true, message: 'Please insert temperature profile.'}]}
                >
                    <Slider
                        range
                        marks={marks_temperature}
                        step={10}
                        defaultValue={[this.state.t_inf, this.state.t_sup]}
                        min={0}
                        max={1500}
                        onChange={this.changeTemperature}
                        style={{width: "35%"}}
                    />
                </Form.Item
                >
                <Form.Item
                    label="Pressure Profile"
                    name="p_profile"
                    rules={[{required: true, message: 'Please insert pressure profile.'}]}
                >
                    <Slider
                        range
                        marks={marks_pressure}
                        step={10}
                        defaultValue={[this.state.p_inf, this.state.p_sup]}
                        min={0}
                        max={1500}
                        span={9}
                        onChange={this.changePressure}
                        style={{width: "35%"}}
                    />
                </Form.Item>
                <Form.Item
                    label="Equivalent Ratio"
                    name="phi"
                    rules={[{required: true, message: 'Please insert equicalent ratio.'}]}>
                    <Slider
                        range
                        marks={marks_equivalent}
                        step={0.5}
                        defaultValue={[this.state.phi_inf, this.state.phi_sup]}
                        min={0}
                        max={100}
                        span={9}
                        onChange={this.changePhi}
                        style={{width: "35%"}}
                    />
                </Form.Item>
                <Form.Item
                    label="Fuels"
                    name="fuels"
                    rules={[{required: true, message: 'Please insert fuels.'}]}>
                    <Select
                        mode="tags"
                        placeholder="Please select fuels"
                        style={{width: "35%"}}
                    >
                        {this.state.list_fuels}
                    </Select>
                </Form.Item>
            </>
        )
    }
}

export default Characteristics;