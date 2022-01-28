import React from "react";

const Plotly = require('plotly-latest')

import {Button, Col, Collapse, Divider, Tabs, message, Row, Select, Slider, Space, Switch, Table} from "antd";


import {checkError, replaceValueDiz} from "../Tool";
import GroupPlot from "./GroupPlot";



class VisualizeTwoGroupPlot extends React.Component {
    constructor() {
        super();
        this.state = {
            list_modelA: [],
            list_modelB: [],
            loading: false,
        }
    }

    componentDidMount() {
        this.processValidationPlots()
    }

    processValidationPlots() {

        const current = this
        
        this.setState({loading: true})

        let newQuery = {}
        let queryA = {}
        let queryB = {}

        if (this.props.query !== undefined){

            Object.keys(this.props.query).forEach( e =>{
                if (e.startsWith('execution_column__')){
                    newQuery[e.replace('execution_column__', '')] = this.props.query[e]
                }
                else{
                    newQuery[e] = this.props.query[e]
                }
            })

            queryA = replaceValueDiz(newQuery, '$$$', this.props.modelA)
            queryB = replaceValueDiz(newQuery, '$$$', this.props.modelB)
        }
        else{
            queryA = {}
            queryB = {}
        }


        Promise.all([
            this.getValidationPlot(queryA, this.props.target, this.props.modelA),
            this.getValidationPlot(queryB, this.props.target, this.props.modelB)]).then(function (values) {

            const index_model_a = values[0]['chemModel_id'] === current.props.modelA ? 0 : 1

            const modelA_result = values[index_model_a].result
            const modelB_result = values[index_model_a === 1 ? 0 : 1].result


            current.setState({
                list_modelA: modelA_result,
                list_modelB: modelB_result,
                loading: false
            })

        });
    }


    getValidationPlot = (query, target, chemModel_id) => {

        if (target !== undefined && chemModel_id !== undefined && chemModel_id !== -1) {
            return axios.post(window.$API_address + 'frontend/API/getPlotsValidation', {
                'query': query,
                'target': target,
            })
                .then(res => {
                    return {'chemModel_id': chemModel_id, 'result': JSON.parse(res.data)}
                })
                .catch(error => {
                    checkError(error)
                    return {'chemModel_id': chemModel_id, 'result': []}
                })
        } else {
            return {'chemModel_id': chemModel_id, 'result': []}
        }

    }

    render() {
        return (
            <Row>
                <Col span={11}>
                    <GroupPlot list_plot={this.state.list_modelA} loading={this.state.loading}/>
                </Col>
                <Col span={2}>
                </Col>
                <Col span={11}>
                    <GroupPlot list_plot={this.state.list_modelB} loading={this.state.loading}/>
                </Col>
            </Row>
        )
    }
}

export default VisualizeTwoGroupPlot;