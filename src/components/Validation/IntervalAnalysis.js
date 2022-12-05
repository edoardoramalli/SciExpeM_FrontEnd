import React from "react";
import {Table, Tabs, Row, Spin, Empty} from "antd";

import {checkError, replaceValueDiz} from "../Tool";

const Plotly = require('plotly-latest')
import createPlotlyComponent from "react-plotly.js/factory";

const Plot = createPlotlyComponent(Plotly);

import {stdev, mean, median, findVariance} from "../Tool";

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
            title: 'Inter.',
            dataIndex: 'Interval',
            // render: (props, record) => <>[{props[0].toFixed(2)}, {props[1].toFixed(2)}]</>
            render: (props, record) => <>{props[0].toFixed(2)}</>

        }, {
            title: 'A. Exp I.',
            dataIndex: 'Area Exp Inter',
            render: (props, record) => <>{props.toPrecision(2)}</>
        }, {
            title: 'A. Sim I.',
            dataIndex: 'Area Sim Inter',
            render: (props, record) => <>{props.toPrecision(2)}</>
        }, {
            title: 'W. Exp I.',
            dataIndex: 'Weight Exp Inter',
            render: (props, record) => <>{props.toPrecision(2)}</>
        }, {
            title: 'W. Sim I.',
            dataIndex: 'Weight Sim Inter',
            render: (props, record) => <>{props.toPrecision(2)}</>
        }, {
            title: 'Rel.',
            dataIndex: 'Relation',
        }, {
            title: 'Real',
            dataIndex: 'Real',
            render: (props, record) => <>{props.toPrecision(2)}</>
        }, {
            title: 'Value',
            dataIndex: 'Value',
            render: (props, record) => <>{props.toPrecision(2)}</>
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
                        scroll={{ x: true }}
                    />
                </Tabs.TabPane>
            )

        }
        return tmp


    }

    create_plot(x_s, y_s, y_error_s, c_s, x_n, y_n, y_error_n, c_n){
        return <Plot
            data={[
                {
                    type: 'scatter',
                    mode: 'lines+markers',
                    x: x_s,
                    y: y_s,
                    name: 'overstimation',
                    xaxis: 'x',
                    error_y: {
                        type: 'data',
                        array: y_error_s,
                        visible: true
                    },
                    marker: {color: 'red'},

                    // hovertemplate: '(T: %{x}, P: %{y}, Phi: %{z})'
                },
                {
                    type: 'bar',
                    x: x_s,
                    y: c_s,
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
                    x: x_n,
                    y: y_n,
                    error_y: {
                        type: 'data',
                        array: y_error_n,
                        visible: true
                    },
                    xaxis: 'x',
                    yaxis: 'y2',
                    marker: {color: 'green'},

                    // hovertemplate: '(T: %{x}, P: %{y}, Phi: %{z})'
                },
                {
                    type: 'bar',
                    x: x_n,
                    y: c_n,
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
    }

    sum_arr(arr){
        let sum = 0;
        for (let i = 0; i < arr.length; i++) {
            sum += arr[i];
        }
        return sum
    }

    create_final_summary(list_of_summary){
        let bins = {}
        Object.keys(list_of_summary).forEach(exp_id =>{
            list_of_summary[exp_id].forEach(interval =>{
                const interval_value = Number(interval['Interval'][0])
                const rel = interval['Relation']
                const value = Number(interval['Value'])
                if (!bins.hasOwnProperty(interval_value)){
                    bins[interval_value] = {'sovrastima': [], 'sottostima': []}
                }
                if (rel === '+'){
                    if (value !== -1){
                        bins[interval_value]['sovrastima'].push(value)
                    }
                }
                else{
                    if (value !== -1){
                        bins[interval_value]['sottostima'].push(value)
                    }
                }
                // console.log(interval)
            })
            // console.log(exp_id)
        })

        let x = []
        let y_s = []
        let y_n = []
        let c_s = []
        let c_n = []
        let y_error_s = []
        let y_error_n = []


        const bins_sorted = Object.keys(bins).sort(function(a, b){return a-b});


        let new_bin = new Map();

        bins_sorted.forEach(bin =>{
            new_bin.set(Number(bin), bins[bin]);
        })


        new_bin.forEach((value, x_bin) => {
            x.push(Number(x_bin))
            c_s.push(Number(value['sovrastima'].length))
            c_n.push(Number(value['sottostima'].length))
            const y_s_current = Number(mean(value['sovrastima']))
            const y_n_current = Number(mean(value['sottostima']))
            y_s.push(y_s_current !== 0 ? y_s_current : 1)
            y_n.push(y_n_current !== 0 ? y_n_current : 1)
            y_error_s.push(Number(stdev(value['sovrastima'])))
            y_error_n.push(Number(stdev(value['sottostima'])))
        })



        // Object.keys(new_bin).forEach(x_value=>{
        //     x.push(Number(x_value))
        //     c_s.push(Number(new_bin[x_value]['sovrastima'].length))
        //     c_n.push(Number(new_bin[x_value]['sottostima'].length))
        //     const y_s_current = Number(mean(new_bin[x_value]['sovrastima']))
        //     const y_n_current = Number(mean(new_bin[x_value]['sottostima']))
        //     y_s.push(y_s_current !== 0 ? y_s_current : 1)
        //     y_n.push(y_n_current !== 0 ? y_n_current : 1)
        //     y_error_s.push(Number(stdev(new_bin[x_value]['sovrastima'])))
        //     y_error_n.push(Number(stdev(new_bin[x_value]['sottostima'])))
        //
        //
        // })


        return this.create_plot(x, y_s, y_error_s, c_s, x, y_n, y_error_n, c_n)
    }




    createVisualization(key_old, key, value) {
        // console.log(Math.max.apply(Math, value['sovrastima']['y']))
        return <Tabs.TabPane tab={key_old + ' - ' + key} key={key_old + ' - ' + key}>
            <Tabs style={{width: '45vw'}}>
                <Tabs.TabPane tab={'Plot'} key={1}>
                    {/*{console.log(key)}*/}
                    {this.create_final_summary(value)}
                    {/*{this.create_plot()}*/}
                </Tabs.TabPane>
                <Tabs.TabPane tab={'Table'} key={2}>
                    <Tabs style={{width: '45vw'}}>
                        {this.edo(value)}

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