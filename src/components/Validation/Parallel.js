import React from "react";

import {Spin, Empty, Row} from "antd";


const Plotly = require('plotly-latest')

import createPlotlyComponent from "react-plotly.js/factory";
import {colorScale} from "../Variables";

const Plot = createPlotlyComponent(Plotly);


class Parallel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dimensions: JSON.parse(JSON.stringify(this.props.support)),
        }

    }

    getMapping(mapping, family, value) {
        if (typeof (value) === 'number') {
            return value
        } else {
            if (mapping[family].hasOwnProperty(value)) {
                return mapping[family][value]
            } else {
                let index;
                if (Object.values(mapping[family]).length > 0) {
                    index = Math.max(...Object.values(mapping[family])) + 1
                } else {
                    index = 0
                }
                let tmp = mapping
                tmp[family][value] = index
                return index

            }
        }
    }


    createDataFrame = (list_of_records, remove_targets) => {
        if (list_of_records.length > 0) {
            let current_mapping = JSON.parse(JSON.stringify(this.props.support))
            let tmp = {}
            Object.keys(this.props.ofInterest).forEach(element => {
                tmp[this.props.ofInterest[element]['name']] = []
            })

            let tmp_mapping = JSON.parse(JSON.stringify(this.props.support))

            list_of_records.forEach(row => {
                if (!remove_targets.includes(row['execution_column__label'])) {
                    Object.keys(this.props.ofInterest).forEach(element => {
                        this.getMapping(tmp_mapping, this.props.ofInterest[element]['name'], row[element])
                    })
                }
            })

            let new_mapping = {}



            Object.keys(tmp_mapping).forEach(key =>{
                const sorted = Object.keys(tmp_mapping[key])
                sorted.sort()
                new_mapping[key] = {}
                for (let i = 0; i < sorted.length; i++){
                    new_mapping[key][sorted[i]] = i
                }
            })

            list_of_records.forEach(row => {
                if (!remove_targets.includes(row['execution_column__label'])) {
                    Object.keys(this.props.ofInterest).forEach(element => {
                        let current = this.getMapping(new_mapping, this.props.ofInterest[element]['name'], row[element])
                        tmp[this.props.ofInterest[element]['name']].push(current)
                    })
                }
            })




            let dim = {}

            Object.keys(this.props.ofInterest).forEach(element => {
                let a = {
                    label: this.props.ofInterest[element]['name'],
                    values: tmp[this.props.ofInterest[element]['name']],
                    ...this.props.ofInterest[element]['props']
                }
                if (this.props.ofInterest[element]['type'] === 'string') {
                    a['tickvals'] = Object.values(new_mapping[this.props.ofInterest[element]['name']])
                    a['ticktext'] = Object.keys(new_mapping[this.props.ofInterest[element]['name']])
                }
                dim[this.props.ofInterest[element]['name']] = a
            })
            return dim
        } else {
            return {}
        }

    }

    getDimension = (dimensions, active) => {
        let tmp = [];
        active.forEach(e => {
            if (dimensions.hasOwnProperty(e)) {
                tmp.push(dimensions[e])
            }
        })
        return tmp
    }


    render() {
        let obj;

        if (this.props.data && Object.keys(this.props.data).length !== 0) {
            let dims = this.createDataFrame(this.props.data, this.props.removed_targets)
            let dims_list = this.getDimension(dims, this.props.active_dimensions)
            obj = <Plot
                data={[
                    {
                        type: 'parcoords',
                        line: {
                            showscale: true,
                            colorscale: colorScale,
                            cmin: 0,
                            cmax: 1,
                            color: dims['score']['values']
                        },
                        dimensions: dims_list

                    },
                ]}
                layout={{
                    // title: 'Heat Map Curve Matching Scores',
                    // autosize: true,
                    width: 1300,
                    height: 600,
                    yaxis: {automargin: true},
                    xaxis: {automargin: true}
                }}
            />
        } else if (this.props.loading) {
            obj = <Row justify="space-around" align="middle"><Spin size="large"/></Row>
        } else {
            obj = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
        }

        return (
            <Row justify="space-around" align="middle">
                {obj}
            </Row>

        )
    }
}

export default Parallel;