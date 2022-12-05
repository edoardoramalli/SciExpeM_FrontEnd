import React from "react";

import {Alert, Col, Empty, Spin, Tabs, Row, Button, Form, Select, Radio, Input, InputNumber, message} from "antd";

const axios = require('axios');
import Cookies from "js-cookie";
axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

import {checkError} from "../../../Tool";

const Plotly = require('plotly-latest')
import createPlotlyComponent from "react-plotly.js/factory";
import {PlayCircleOutlined} from "@ant-design/icons";
const Plot = createPlotlyComponent(Plotly);

class ROPA extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            baseConfig: {width: 1000, height: 500, showlegend: false, autosize: true},
            renderObject: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>,
            options: [],
            loading: false,
            inf_disable: true,
            sup_disable: true
        }
    }

    prepareROPA(diz){
        let result = {}
        Object.keys(diz['ROPA']).map(e =>{
            let x = []
            let y = []
            let text = []
            let x_p = []
            let x_n = []
            let marker_color = []
            for (let index = 0; index < diz['ROPA'][e]['coefficients'].length; index++) {
                const coeff = diz['ROPA'][e]['coefficients'][index]
                const r_name = diz['reactions_map'][diz['ROPA'][e]['reaction_index'][index]]
                if (coeff !== 0){
                    x.push(coeff)
                    // cosi le ordina in valore assoluto
                    if (!y.includes(r_name)){
                        y.push(r_name)
                    }
                    else{
                        y.push(r_name + ' ')
                    }
                    text.push(r_name + ' (' + coeff.toPrecision(3) + ')')
                    if (coeff >= 0){
                        marker_color.push('green')
                        x_p.push(coeff)
                    }
                    else{
                        marker_color.push('red')
                        x_n.push(coeff * -1)
                    }

                }
            }
            const x_a = x.map((e) => Math.abs(e))
            const x_a_max = Math.max(...x_a)

            let final_x = [];

            for (let index = 0; index < x.length; index++){
                let new_x
                new_x = x[index] / x_a_max
                if (new_x > -0.05 && new_x < 0.05){
                    new_x = 0.05 * Math.sign(new_x)
                    if (Math.sign(new_x) === 1){
                        marker_color[index] = '#95de64'
                    }
                    else{
                        marker_color[index] = '#ffa39e'
                    }
                }
                final_x.push(new_x)

            }

            result[e] = {'x': final_x, 'y': y, 'marker_color': marker_color, 'text': text}
        })
        return result
    }

    renderCase(diz){
        let tmp = []

        Object.keys(diz).map(e =>{
            const c_x = diz[e]['x'].reverse()
            const c_y = diz[e]['y'].reverse()
            const c_c = diz[e]['marker_color'].reverse()
            const c_t = diz[e]['text'].reverse()
            tmp.push(
                <Tabs.TabPane tab={"Case " + e} key={e}>
                    <Plot
                        data={
                            [
                                {
                                    type: 'bar',
                                    orientation: 'h',
                                    x: c_x,
                                    y: c_y,
                                    marker: {color: c_c},
                                    text: c_t,
                                    textposition: 'auto',
                                    hoverinfo: 'none'
                                }
                            ]
                        }
                        // layout={this.extend(this.state.baseConfig, info[key_y][key_x])}
                        layout={{
                            yaxis: {'visible': true, 'showticklabels': false},
                            xaxis: {
                                range: [-1.2, 1.2],
                                visible: true,
                                showticklabels: false
                            },
                            width: 1200,
                            height: 500,
                            showlegend: false,
                            autosize: true

                        }}
                    />
                </Tabs.TabPane>)
        })
        return <Tabs>{tmp}</Tabs>
    }

    componentDidMount() {
        const params = {
            query: {executions__id: this.props.id.toString()},
            model_name: 'ChemModel',
            fields: ['mapping_id_name_supported_species']
            }

        axios.post(window.$API_address + 'ExperimentManager/API/filterDataBase', params)
            .then(res => {
                const result = res.data[0]['mapping_id_name_supported_species']
                let tmp = []
                Object.entries(result).forEach(([key, value]) => {
                    let text = value + ' (ID: ' + key + ')'
                    tmp.push(<Select.Option key={text} value={key}>{text}</Select.Option>)})
                this.setState({options:tmp})

                // if(Object.keys(result['info']).length === 0){
                //     this.setState({renderObjectPlot: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>})
                // }
                // else {
                //     const tabs = this.renderTabs(result['info'], result['data'])
                //     this.setState({renderObject: <Tabs defaultActiveKey="1">{tabs}</Tabs>})
                // }
            })
            .catch(error => {
                checkError(error)
            })
    }


    computeRopa = values =>{

        this.setState({renderObject: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>, loading: true})

        // const inf = values.value.inf ? values.value: null
        // const sup = values.value.sup ? values.value: null


        const params = {
            'execution_id': this.props.id.toString(),
            'specie_id': values.specie_id,
            'ROPA_type': values.ROPA_type,
            'local_value': values.inf ,
            'lower_bound': values.inf,
            'upper_bound': values.sup
        }


        axios.post(window.$API_address + 'OpenSmoke/API/getROPA', params)
            .then(res => {
                const result = res.data
                if(Object.keys(result['ROPA']).length === 0){
                    this.setState({renderObject: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>, loading: false})
                }
                else {
                    const vis_data = this.prepareROPA(result)
                    this.setState({renderObject: this.renderCase(vis_data), loading: false})
                }
            })
            .catch(error => {
                this.setState({
                    renderObject:
                        <Alert message="Error with ROPA?" type="warning" />, loading: false
                })
                checkError(error)
            })

        message.success('ROPA request sent!');

    }

    onFinishFailed = () =>{

    }

    radioChange = e =>{
        const value = e.target.value
        if (value === 1){
            this.setState({inf_disable: true, sup_disable: true})
        }
        else if (value === 0){
            this.setState({inf_disable: false, sup_disable: true})
        }
        else if (value === 2){
            this.setState({inf_disable: false, sup_disable: false})
        }
    }


    render() {
        return (
            <Col>
                <Row>
                    <Form
                        onFinish={this.computeRopa}
                        onFinishFailed={this.onFinishFailed}
                        layout="inline"
                        autoComplete="off"
                        ref={this.formRef}
                    >
                        <Col>
                            <Form.Item
                                // label="Specie"
                                name="specie_id"
                                rules={[{required: true, message: 'Please select specie.'}]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Select a specie"
                                    style={{width: 250}}
                                >
                                    {this.state.options}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col>
                            <Form.Item
                                // label="Specie"
                                name="ROPA_type"
                                rules={[{required: true, message: 'Please select ROPA type.'}]}
                            >
                                <Radio.Group onChange={this.radioChange}>
                                    <Radio value={1}>Global</Radio>
                                    <Radio value={0}>Local</Radio>
                                    <Radio value={2}>Region</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>

                        <Col>
                                <Input.Group compact>
                                    <Form.Item
                                        name='inf'
                                        noStyle
                                        rules={[{required: !this.state.inf_disable, message: ''}]}
                                    >
                                        <InputNumber
                                            style={{width: 100, textAlign: 'center'}}
                                            min={0} max={3500} step={1}
                                            // onChange={this.onChangeTinf}
                                            placeholder={'Insert Value'}
                                            disabled={this.state.inf_disable}
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
                                        name='sup'
                                        noStyle
                                        rules={[{required: !this.state.sup_disable, message: ''}]}
                                    >
                                        <InputNumber
                                            className="site-input-right"
                                            style={{
                                                width: 100,
                                                textAlign: 'center',
                                            }}
                                            placeholder={'sup'}
                                            min={0} max={3500} step={1}
                                            disabled={this.state.sup_disable}
                                        />
                                    </Form.Item>
                                </Input.Group>
                        </Col>

                        <Col>
                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{marginLeft: "10px"}}
                                // shape="circle"
                                // size="large"
                                loading={this.state.loading}
                                icon={<PlayCircleOutlined />}
                                disabled={!this.props.ropa}
                            >
                                Compute
                            </Button>
                        </Col>
                    </Form>
                </Row>
                <Row justify="space-around" align="middle">
                    {this.state.renderObject}
                </Row>

            </Col>
        )
    }

}

export default ROPA;