import React from "react";

const axios = require('axios');
import Cookies from "js-cookie";
import {checkError, replaceValueDiz} from "../Tool";

const Plotly = require('plotly-latest')

import createPlotlyComponent from "react-plotly.js/factory";
import {Row, Col} from "antd";
import World from "./World";

const Plot = createPlotlyComponent(Plotly);

axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

class VisualizeTwoWorlds extends React.Component {

    constructor() {
        super();

        this.state = {
            modelA_result: {},
            modelB_result: {},
            loading: false,
        }
    }

    componentDidMount() {
        this.processWorld()
    }

    processWorld() {
        const queryA = replaceValueDiz(this.props.query, '$$$', this.props.modelA)
        const queryB = replaceValueDiz(this.props.query, '$$$', this.props.modelB)

        const current = this

        this.setState({loading: true})

        Promise.all([
            this.getWorld(queryA, this.props.subject, this.props.modelA),
            this.getWorld(queryB, this.props.subject, this.props.modelB)]).then(function (values) {

            const index_model_a = values[0]['chemModel_id'] === current.props.modelA ? 0 : 1

            const modelA_result = values[index_model_a].result
            const modelB_result = values[index_model_a === 1 ? 0 : 1].result

            current.setState({modelA_result: modelA_result, modelB_result: modelB_result, loading: false})


        });
    }

    getWorld = (query, subject, chemModel_id) => {

        if (query !== undefined && chemModel_id !== undefined && chemModel_id !== -1) {
            return axios.post(window.$API_address + 'frontend/API/getWorld', {'query': query, 'subject':  subject})
                .then(res => {
                    return {'chemModel_id': chemModel_id, 'result': JSON.parse(res.data)}
                })
                .catch(error => {
                    checkError(error)
                    return {'chemModel_id': chemModel_id, 'result': {}}
                })
        } else {
            return {'chemModel_id': chemModel_id, 'result': {}}
        }

    }


    render() {
        return(
            <Row>
                <Col span={11}>
                    <World
                        data={this.state.modelA_result}
                        settings={this.props.settings}
                        loading={this.state.loading}
                    />

                </Col>
                <Col span={2}>

                </Col>
                <Col span={11}>
                    <World
                        data={this.state.modelB_result}
                        settings={this.props.settings}
                        loading={this.state.loading}
                    />
                </Col>
            </Row>
        )
    }

}

export default VisualizeTwoWorlds;