import React from "react";
import {Button, message, Radio, Row, Col, Divider, Select, InputNumber, Typography} from "antd";


import {CheckOutlined} from "@ant-design/icons";
import axios from "axios";


const { Option } = Select;
const { Text } = Typography;

class ManagementExperiment extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            exp: this.props,
            list_fuels: [],
            phi_inf: null,
            phi_sup: null,
            t_inf: null,
            t_sup: null,
            p_inf: null,
            p_sup: null,
            fuels: [],

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
            phi_inf: this.state.phi_inf,
            phi_sup: this.state.phi_sup,
            t_inf: this.state.t_inf,
            t_sup: this.state.t_sup,
            p_inf: this.state.p_inf,
            p_sup: this.state.p_sup,
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

        this.updateValues(this.state.exp.props.id.toString(), params)
        this.verifyExperiment(this.state.exp.props.id.toString(), this.state.status)
    }

    componentDidMount() {
        axios.get(window.$API_address + 'frontend/api/opensmoke/fuels_names')
            .then(res => {
                const names = res.data.names
                
                this.setState({list_fuels: names.map(item =>
                        <Option key={item} value={item}>{item}</Option>
                    )})

                })
        let tmp_fuel;
        if (this.state.exp.props.fuels === null){
            tmp_fuel = []
        }
        else{
            tmp_fuel = this.state.exp.props.fuels
        }
        this.setState({
            fuels: tmp_fuel,
            phi_inf: this.state.exp.props.phi_inf,
            phi_sup: this.state.exp.props.phi_sup,
            t_inf: this.state.exp.props.t_inf,
            t_sup: this.state.exp.props.t_sup,
            p_inf: this.state.exp.props.p_inf,
            p_sup: this.state.exp.props.p_sup,
            status: this.state.exp.props.status
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

                <Divider orientation="left">Temperature Range</Divider>
                <Row gutter={0}>
                    <Col className="gutter-row" span={10} offset={1}>
                       <Text style={font}>&#123;  </Text>
                       <InputNumber
                           min={250} max={3000} step={10}
                           defaultValue={this.state.t_inf} onChange={this.onChangeTinf}
                       />
                        <Text style={font}>   -   </Text>
                        <InputNumber
                            min={this.state.t_inf}  max={3000} step={10}
                            defaultValue={this.state.t_sup} onChange={this.onChangeTsup}
                        />
                        <Text style={font}>    &#125;    Kelvin</Text>
                    </Col>
                </Row>
                <Divider orientation="left">Pressure Range</Divider>
                <Row gutter={0}>
                    <Col className="gutter-row" span={10} offset={1}>
                        <Text style={font}>&#123;  </Text>
                        <InputNumber
                            min={0} max={150} step={5}
                            defaultValue={this.state.p_inf} onChange={this.onChangePinf}
                        />
                        <Text style={font}>   -   </Text>
                        <InputNumber
                            min={this.state.p_inf}  max={150} step={5}
                            defaultValue={this.state.p_sup} onChange={this.onChangePsup}
                        />
                        <Text style={font}>    &#125;    Bar</Text>
                    </Col>
                </Row>
                <Divider orientation="left">Equivalence Ratio Range</Divider>
                <Row gutter={0}>
                   <Col className="gutter-row" span={10} offset={1}>
                    <Text style={font}>&#123;  </Text>
                    <InputNumber
                        min={0} max={100} step={0.1}
                        defaultValue={this.state.phi_inf} onChange={this.onChangePhiinf}
                    />
                    <Text style={font}>   -   </Text>
                    <InputNumber
                        min={this.state.phi_inf}  max={100} step={0.1}
                        defaultValue={this.state.phi_sup} onChange={this.onChangePhisup}
                    />
                    <Text style={font}>    &#125;   </Text> <Text>(Phi = 100 ==> +inf)</Text>
                </Col>
                </Row>
                <Divider orientation="left">Fuels</Divider>
                <Row gutter={0}>
                    <Col className="gutter-row" span={10} offset={1}>
                        <Select
                            mode="tags"
                            placeholder="Please select fuels"
                            style={{ width: '100%' }}
                            value={this.state.fuels}
                            onChange={this.changeFuels}
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