import React from "react";
import {Table, Tabs, Row, Spin, Empty} from "antd";

import {checkError, replaceValueDiz} from "../Tool";

const Plotly = require('plotly-latest')
import createPlotlyComponent from "react-plotly.js/factory";

const Plot = createPlotlyComponent(Plotly);

class IntervalAnalysis extends React.Component {

    constructor() {
        super();

        this.state = {
            modelA_result: null,
            modelB_result: null
        }
    }

    edo(details) {
        let columns = [{
            title: 'Interval',
            dataIndex: 'Interval',
            render: (props, record) => <>[{props[0].toFixed(2)}, {props[1].toFixed(2)}]</>
        }, {
            title: 'Area Exp Inter',
            dataIndex: 'Area Exp Inter',
        }, {
            title: 'Area Sim Inter',
            dataIndex: 'Area Sim Inter',
        }, {
            title: 'Weight Exp Inter',
            dataIndex: 'Weight Exp Inter',
        }, {
            title: 'Weight Sim Inter',
            dataIndex: 'Weight Sim Inter',
        }, {
            title: 'Relation',
            dataIndex: 'Relation',
        }, {
            title: 'Real',
            dataIndex: 'Real',
        }, {
            title: 'Value',
            dataIndex: 'Value',
        },]

        let tmp = []


        for (const [key, value] of Object.entries(details)) {

            tmp.push(
                <Tabs.TabPane tab={key} key={key}>
                    <Table
                        columns={columns}
                        dataSource={value}
                        rowKey="id"
                        size='small'
                        bordered
                        pagination={false}
                    />
                </Tabs.TabPane>
            )

        }
        return tmp


    }




    createVisualization(key_old, key, value) {
        // console.log(Math.max.apply(Math, value['sovrastima']['y']))
        return <Tabs.TabPane tab={key_old + ' - ' + key} key={key_old + ' - ' + key}>
            <Tabs style={{width: '45vw'}}>
                <Tabs.TabPane tab={'Plot'} key={1}>
                    <Plot
                        data={[
                            {
                                type: 'scatter',
                                mode: 'lines+markers',
                                x: value['sovrastima']['x'],
                                y: value['sovrastima']['y'],
                                name: 'overstimation',
                                xaxis: 'x',
                                error_y: {
                                    type: 'data',
                                    array: value['sovrastima']['error_y'],
                                    visible: true
                                },
                                marker: {color: 'red'},

                                // hovertemplate: '(T: %{x}, P: %{y}, Phi: %{z})'
                            },
                            {
                                type: 'bar',
                                x: value['sovrastima']['x'],
                                y: value['sovrastima']['count'],
                                color: 'orange',
                                yaxis: 'y3',
                                xaxis: 'x',
                                opacity: 0.5,
                                name: 'frequency'
                            },
                            {
                                type: 'scatter',
                                mode: 'lines+markers',
                                name: 'understimation',
                                x: value['sottostima']['x'],
                                y: value['sottostima']['y'],
                                error_y: {
                                    type: 'data',
                                    array: value['sottostima']['error_y'],
                                    visible: true
                                },
                                xaxis: 'x',
                                yaxis: 'y2',
                                marker: {color: 'green'},

                                // hovertemplate: '(T: %{x}, P: %{y}, Phi: %{z})'
                            },
                            {
                                type: 'bar',
                                x: value['sottostima']['x'],
                                y: value['sottostima']['count'],
                                yaxis: 'y4',
                                xaxis: 'x',
                                opacity: 0.5,
                                name: 'frequency'
                            },
                        ]}
                        layout={{
                            showlegend: false,
                            autosize: false,
                            width: 650,
                            grid: {
                                rows: 2,
                                columns: 1,
                                subplots: [['xy'], ['xy2']],
                                roworder: 'top to bottom'
                            },
                            yaxis: {
                                title: 'overstimation',
                                color: 'red',
                                // range: [1.5, 5]
                            },
                            yaxis2: {
                                autorange: 'reversed',
                                title: 'understimation',
                                color: 'green',
                            },
                            yaxis3: {
                                title: 'Frequency',
                                overlaying: 'y',
                                side: 'right',
                                color: 'orange',
                            },
                            yaxis4: {
                                title: 'Frequency',
                                autorange: 'reversed',
                                overlaying: 'y2',
                                side: 'right',
                            },
                        }}
                    />
                </Tabs.TabPane>
                <Tabs.TabPane tab={'Table'} key={2}>
                    <Tabs style={{width: '45vw'}}>
                        {this.edo(value['details'])}

                    </Tabs>


                </Tabs.TabPane>
            </Tabs>
        </Tabs.TabPane>
    }


    render() {

        let obj;

        if (this.props.data && Object.keys(this.props.data).length) {
            let tmp = []

            for (const [key_old, results] of Object.entries(this.props.data)) {
                for (const [key, value] of Object.entries(results)) {
                    tmp.push(this.createVisualization(key_old, key, value))
                }
            }
            obj = <Tabs>{tmp}</Tabs>
        } else if (this.props.loading) {
            obj = <Row justify="space-around" align="middle"><Spin size="large"/></Row>
        } else {
            obj = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
        }

        return (
            <>
                {obj}
            </>

        )
    }

}

export default IntervalAnalysis;