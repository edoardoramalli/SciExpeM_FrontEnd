import React from "react";
import {Form, Input, InputNumber, Select, Slider} from "antd";
import axios from "axios";


class Characteristics extends React.Component {
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

    onChangeTinf = value => {
        this.setState({
            t_inf: value
        })
    }

    onChangePinf = value =>{
        this.setState({
            p_inf: value
        })
    }


    onChangePhiinf = value =>{
        this.setState({
            phi_inf: value
        })
    }


    render() {
        return (
            <>
                <Form.Item
                    label="Temperature Range Profile (Min-Max) [K]"
                    name="t_profile"
                    rules={[{required: true, message: ''}]}
                >
                    <Input.Group compact>
                        <Form.Item
                            name={['t_profile', 't_inf']}
                            noStyle
                            rules={[{required: true, message: 'Please insert temperature min profile'}]}
                        >
                            <InputNumber
                                style={{width: 100, textAlign: 'center'}}
                                min={250} max={3500} step={10}
                                onChange={this.onChangeTinf}
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
                            name={['t_profile', 't_sup']}
                            noStyle
                            rules={[{required: true, message: 'Please insert temperature max profile'}]}
                        >
                            <InputNumber
                                className="site-input-right"
                                style={{
                                    width: 100,
                                    textAlign: 'center',
                                }}
                                placeholder={'Max'}
                                min={this.state.t_inf} max={3500} step={10}
                            />
                        </Form.Item>
                    </Input.Group>
                </Form.Item>


                <Form.Item
                    label="Pressure Range Profile (Min-Max) [bar]"
                    name="p_profile"
                    rules={[{required: true, message: ''}]}
                >
                    <Input.Group compact>
                        <Form.Item
                            name={['p_profile', 'p_inf']}
                            noStyle
                            rules={[{required: true, message: 'Please insert pressure min profile'}]}
                        >
                            <InputNumber
                                style={{width: 100, textAlign: 'center'}}
                                min={0} max={150} step={5}
                                onChange={this.onChangePinf}
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
                            name={['p_profile', 'p_sup']}
                            noStyle
                            rules={[{required: true, message: 'Please insert pressure max profile'}]}
                        >
                            <InputNumber
                                className="site-input-right"
                                style={{
                                    width: 100,
                                    textAlign: 'center',
                                }}
                                placeholder={'Max'}
                                min={this.state.p_inf} max={150} step={5}
                            />
                        </Form.Item>
                    </Input.Group>
                </Form.Item>


                <Form.Item
                    label="Equivalent Ratio Range Profile (Min-Max) [phi = 100 (+inf)]"
                    name="phi_profile"
                    rules={[{required: true, message: ''}]}
                >
                    <Input.Group compact>
                        <Form.Item
                            name={['phi_profile', 'phi_inf']}
                            noStyle
                            rules={[{required: true, message: 'Please insert equivalent ratio min profile'}]}
                        >
                            <InputNumber
                                style={{width: 100, textAlign: 'center'}}
                                min={0} max={150} step={0.1}
                                onChange={this.onChangePhiinf}
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
                            name={['phi_profile', 'phi_sup']}
                            noStyle
                            rules={[{required: true, message: 'Please insert equivalent ratio max profile'}]}
                        >
                            <InputNumber
                                className="site-input-right"
                                style={{
                                    width: 100,
                                    textAlign: 'center',
                                }}
                                placeholder={'Max'}
                                min={this.state.phi_inf} max={150} step={0.1}
                            />
                        </Form.Item>
                    </Input.Group>
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