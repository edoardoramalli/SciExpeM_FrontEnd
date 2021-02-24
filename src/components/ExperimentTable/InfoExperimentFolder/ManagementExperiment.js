import React from "react";
import {Button, message, Radio, Row, Col, Divider, Select, InputNumber, Typography, Input} from "antd";


import {CheckOutlined} from "@ant-design/icons";
const axios = require('axios');
import Cookies from "js-cookie";


const { Option } = Select;
const { Text } = Typography;

axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

class ManagementExperiment extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            exp_id: this.props['exp_id'],
            exp: this.props,
            list_fuels: []
        }
    }

    updateValues(id, properties){
        const params = {
            'model_name': ['Experiment'],
            'property': [JSON.stringify(properties)],
            'id': [id]
        }
        axios.post(window.$API_address + 'ExperimentManager/API/updateElement', params)
            .then(res => {
                message.success('Fields are not updated! Reload page to see the effects', 3);
            }).catch(error => {
            if (error.response.status === 403){
                message.error("You don't have the authorization!", 3);
            }
            else if (error.response.status === 400){
                message.error("Bad Request. " + error.response.data, 3);
            }
            else{
                message.error(error.response.data, 3);
            }
        })
    }

    verifyExperiment(id, status){
        const params = {
            'id': [id],
            'status': [status]
        }
        axios.post(window.$API_address + 'ExperimentManager/API/verifyExperiment', params)
            .then(res => {
                message.success('Experiment status is updated! Reload page to see the effects', 3);
            }).catch(error => {
            if (error.response.status === 403){
                message.error("You don't have the authorization!", 3);
            }
            else if (error.response.status === 400){
                message.error("Bad Request. " + error.response.data, 3);
            }
            else{
                message.error(error.response.data, 3);
            }
        })
    }

    ok(){
        let params = {
            phi_inf: parseInt(this.state.phi_inf),
            phi_sup: parseInt(this.state.phi_sup),
            t_inf: parseInt(this.state.t_inf),
            t_sup: parseInt(this.state.t_sup),
            p_inf: parseInt(this.state.p_inf),
            p_sup: parseInt(this.state.p_sup),
            fuels: this.state.fuels
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

        this.updateValues(this.state.exp_id.toString(), params)
        this.verifyExperiment(this.state.exp_id.toString(), this.state.status)
    }

    componentDidMount() {
        axios.get(window.$API_address + 'frontend/api/opensmoke/fuels_names')
            .then(res => {
                const names = res.data.names
                
                this.setState({list_fuels: names.map(item =>
                        <Option key={item} value={item}>{item}</Option>
                    )})

                })

        const params = {
            fields: ['t_inf', 't_sup', 'p_inf', 'p_sup', 'phi_inf', 'phi_sup', 'fuels', 'status'],
            id: this.state.exp_id.toString(),
            model_name: 'Experiment'
        }

        axios.post(window.$API_address + 'ExperimentManager/API/requestPropertyList', params)
            .then(res => {
                const result = JSON.parse(res.data)
                let tmp_fuel;
                if (result.fuels === null){
                    tmp_fuel = []
                }
                else{
                    tmp_fuel = result.fuels
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
                if (error.response.status === 403){
                    message.error("You don't have the authorization!", 3);
                    this.setState({loading: false})
                }
                else if (error.response.status === 400){
                    message.error("Bad Request. " + error.response.data, 3);
                    this.setState({loading: false})
                }
                else{
                    message.error(error.response.data, 3);
                    this.setState({loading: false})
                }
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
                >
                    Update Fields and Verify Experiment
                </Button>

            </>
        )
    }
}

export default ManagementExperiment;