import React from "react";
import {Button, message, Radio, Row, Col, Divider, Select, InputNumber, Typography, Input} from "antd";


import {CheckOutlined} from "@ant-design/icons";

const axios = require('axios');
import Cookies from "js-cookie";
axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');


import {checkError, get_species_options} from "../../Tool"



class ManagementExperiment extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            exp_id: this.props['exp_id'],
            exp: this.props,
            list_fuels: [],
            loading: false,
        }
    }

    updateValues(id, properties){
        const params = {
            'model_name': 'Experiment',
            'property_dict': JSON.stringify(properties),
            'element_id': id
        }
        axios.post(window.$API_address + 'ExperimentManager/API/updateElement', params)
            .then(res => {
                message.success('Fields are updated! Reload page to see the effects', 3);
                this.verifyExperiment(this.state.exp_id.toString(), this.state.status)

            }).catch(error => {
                checkError(error)
                this.verifyExperiment(this.state.exp_id.toString(), this.state.status)
        })
    }

    verifyExperiment(id, status){
        const params = {
            'status': status,
            'exp_id': id,
        }
        axios.post(window.$API_address + 'ExperimentManager/API/verifyExperiment', params)
            .then(res => {
                message.success('Experiment status is updated! Reload page to see the effects', 3);
                this.setState({loading: false})
            }).catch(error => {
            checkError(error)
            this.setState({loading: false})

        })

    }

    ok(){
        let params = {
            phi_inf: parseFloat(this.state.phi_inf),
            phi_sup: parseFloat(this.state.phi_sup),
            t_inf: parseFloat(this.state.t_inf),
            t_sup: parseFloat(this.state.t_sup),
            p_inf: parseFloat(this.state.p_inf),
            p_sup: parseFloat(this.state.p_sup),
            fuels_object: this.state.fuels
        }
        if (this.state.status === 'verified') {
            let dict = params
            for (let key in dict) {
                if (dict[key] === '0.000' || dict[key] === []) {
                    message.error("'" + key + "' Field is not set.", 3);
                    return
                }
            }
        }

        for (let key in params) {
            if (params[key] === '0.000' || params[key] === []) {
                params[key] = null
            }
        }
        this.setState({loading: true}, () =>{
            this.updateValues(this.state.exp_id.toString(), params)
        })


    }

    async componentDidMount() {
        const fuels_options = await get_species_options()

        this.setState({list_fuels: fuels_options})

        const params = {
            fields: ['t_inf', 't_sup', 'p_inf', 'p_sup', 'phi_inf', 'phi_sup', 'fuels_object', 'status'],
            element_id: this.state.exp_id.toString(),
            model_name: 'Experiment'
        }

        axios.post(window.$API_address + 'ExperimentManager/API/requestPropertyList', params)
            .then(res => {
                const result = JSON.parse(res.data)
                let tmp_fuel;
                if (result.fuels_object === null){
                    tmp_fuel = []
                }
                else{
                    tmp_fuel = result.fuels_object.map(i => i.id)
                }
                this.setState({
                    fuels: tmp_fuel,
                    phi_inf: result.phi_inf,
                    phi_sup: result.phi_sup,
                    t_inf: result.t_inf,
                    t_sup: result.t_sup,
                    p_inf: result.p_inf,
                    p_sup: result.p_sup,
                    status: result.status
                })
            })
            .catch(error => {
                checkError(error)
            })
    }

    onChangeTinf = value =>{
        this.setState({
            t_inf: value
        })
    }

    onChangeTsup = value =>{
        this.setState({
            t_sup: value
        })
    }

    onChangePinf = value =>{
        this.setState({
            p_inf: value
        })
    }

    onChangePsup = value =>{
        this.setState({
            p_sup: value
        })
    }

    onChangePhiinf = value =>{
        this.setState({
            phi_inf: value
        })
    }

    onChangePhisup = value =>{
        this.setState({
            phi_sup: value
        })
    }

    changeFuels = value => {
        this.setState({
            fuels: value
        });
    };

    onChangeRadioState = e =>{
        this.setState({
            status: e.target.value
        })
    }

    render() {


        const font = {fontSize: 20}

        return(
            <>

                <Divider orientation="left">Temperature Range (Min - Max) [Kelvin]</Divider>
                <Row gutter={0}>
                    <Col className="gutter-row" span={10} offset={1}>
                       <InputNumber
                           style={{width: 100, textAlign: 'center'}}
                           placeholder={'Min'}
                           min={250} max={3000} step={10}
                           value={this.state.t_inf} onChange={this.onChangeTinf}
                       />
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
                        <InputNumber
                            min={this.state.t_inf}  max={3000} step={10}
                            value={this.state.t_sup} onChange={this.onChangeTsup}
                            className="site-input-right"
                            style={{
                                width: 100,
                                textAlign: 'center',
                            }}
                            placeholder={'Max'}
                        />
                    </Col>
                </Row>
                <Divider orientation="left">Pressure Range (Min - Max) [Bar]</Divider>
                <Row gutter={0}>
                    <Col className="gutter-row" span={10} offset={1}>
                        <InputNumber
                            style={{width: 100, textAlign: 'center'}}
                            placeholder={'Min'}
                            min={0} max={150} step={5}
                            value={this.state.p_inf} onChange={this.onChangePinf}
                        />
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
                        <InputNumber
                            min={this.state.p_inf}  max={150} step={5}
                            value={this.state.p_sup} onChange={this.onChangePsup}
                            className="site-input-right"
                            style={{
                                width: 100,
                                textAlign: 'center',
                            }}
                            placeholder={'Max'}
                        />
                    </Col>
                </Row>
                <Divider orientation="left">Equivalence Ratio Range (Min - Max) [Phi = 100 = +&infin;]</Divider>
                <Row gutter={0}>
                   <Col className="gutter-row" span={10} offset={1}>
                    <InputNumber
                        style={{width: 100, textAlign: 'center'}}
                        placeholder={'Min'}
                        min={0} max={100} step={0.1}
                        value={this.state.phi_inf} onChange={this.onChangePhiinf}
                    />
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
                    <InputNumber
                        min={this.state.phi_inf}  max={100} step={0.1}
                        value={this.state.phi_sup} onChange={this.onChangePhisup}
                        className="site-input-right"
                        style={{
                            width: 100,
                            textAlign: 'center',
                        }}
                        placeholder={'Max'}
                    />
                </Col>
                </Row>
                <Divider orientation="left">Fuels</Divider>
                <Row gutter={0}>
                    <Col className="gutter-row" span={10} offset={1}>
                        <Select
                            mode="multiple"
                            placeholder="Please select fuels"
                            style={{ width: '100%' }}
                            value={this.state.fuels}
                            onChange={this.changeFuels}
                            allowClear
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) => optionA.value > optionB.value}

                        >
                            {this.state.list_fuels}
                        </Select>
                    </Col>
                </Row>
                <Divider orientation="left">Experiment State</Divider>
                <Row gutter={0}>
                    <Col className="gutter-row" span={10} offset={1}>

                        <Radio.Group
                            onChange={this.onChangeRadioState}
                            optionType="button"
                            buttonStyle="solid"
                            value={this.state.status}
                        >
                            <Radio.Button value='verified'>Verified</Radio.Button>
                            <Radio.Button value='unverified'>Unverified</Radio.Button>
                            <Radio.Button value='invalid'>Invalid</Radio.Button>

                        </Radio.Group>
                    </Col>
                </Row>

                <Divider orientation="left">Confirm</Divider>
                <Button
                    icon={<CheckOutlined />}
                    onClick={this.ok.bind(this)}
                    loading={this.state.loading}
                >
                    Update Fields and State
                </Button>

            </>
        )
    }
}

export default ManagementExperiment;