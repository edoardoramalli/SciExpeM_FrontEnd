import React from "react";
import {checkError, replaceValueDiz} from "../Tool";
import {Col, Row, Tabs} from "antd";
import IntervalAnalysis from "./IntervalAnalysis";

class VisualizeTwoIntervalAnalysis extends React.Component {
    constructor() {
        super();

        this.state = {
            modelA_result: null,
            modelB_result: null
        }
    }

    processIntervalAnalysis() {
        const queryA = replaceValueDiz(this.props.query, '$$$', this.props.modelA)
        const queryB = replaceValueDiz(this.props.query, '$$$', this.props.modelB)

        const current = this

        this.setState({loading: true})

        Promise.all([
            this.getIntervalAnalysis(queryA, this.props.modelA, this.props.modelB),
            this.getIntervalAnalysis(queryB, this.props.modelB, this.props.modelA)]).then(function (values) {

            const index_model_a = values[0]['chemModel_id'] === current.props.modelA ? 0 : 1

            const modelA_result = values[index_model_a].result
            const modelB_result = values[index_model_a === 1 ? 0 : 1].result

            // console.log(modelA_result)


            current.setState({modelA_result: modelA_result, modelB_result: modelB_result, loading: false})


        });
    }

    getIntervalAnalysis(query, chemModel_id, other_id) {
        if (query !== undefined && chemModel_id !== undefined && chemModel_id !== -1) {
            let models = []
            if (this.props.settings.common_experiments){
                models = [chemModel_id, other_id]
            }
            return axios.post(window.$API_address + 'frontend/API/getIntervalAnalysis',
                {
                    'query': query,
                    'chemModel_id': chemModel_id,
                    'models': models,
                })
                .then(res => {

                    const results_tot = res.data

                    return {'chemModel_id': chemModel_id, 'result': results_tot}
                })
                .catch(error => {
                    checkError(error)
                    return {'chemModel_id': chemModel_id, 'result': {}}

                })
        } else {
            return {'chemModel_id': chemModel_id, 'result': {}}
        }

    }

    componentDidMount() {
        this.processIntervalAnalysis()
    }



    render() {
        return(
            <Row>
                <Col span={11}>
                    <IntervalAnalysis
                        data={this.state.modelA_result}
                        settings={this.props.settings}
                        loading={this.state.loading}
                    />

                </Col>
                <Col span={2}>

                </Col>
                <Col span={11}>
                    <IntervalAnalysis
                        data={this.state.modelB_result}
                        settings={this.props.settings}
                        loading={this.state.loading}
                    />
                </Col>
            </Row>
        )
    }
}

export default VisualizeTwoIntervalAnalysis;