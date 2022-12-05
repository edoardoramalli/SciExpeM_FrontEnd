import React from "react";

import {Select, Button, Tabs, Table} from 'antd';


const Plotly = require('plotly-latest')
import createPlotlyComponent from "react-plotly.js/factory";
import {checkError} from "../Tool";

const Plot = createPlotlyComponent(Plotly);

import {colorScale} from "../Variables"
import VisualizeTwoWorlds from "./VisualizeTwoWorlds";
import VisualizeTwoParallelPlot from "./VisualizeTwoParallelPlot";

class TabParallelCoordinates extends React.Component {

    constructor() {
        super();

        let tmp_support = {}

        const ofInterest = {
            'execution_column__execution__experiment__fuels':  {'name': 'fuels', 'type': 'string', 'props': {}, },

            'execution_column__execution__experiment__t_inf': {'name': 't_inf', 'type': 'number', 'props': {}},
            'execution_column__execution__experiment__t_sup': {'name': 't_sup', 'type': 'number', 'props': {}},
            'execution_column__execution__experiment__p_inf': {'name': 'p_inf', 'type': 'number', 'props': {}},
            'execution_column__execution__experiment__p_sup': {'name': 'p_sup', 'type': 'number', 'props': {}},
            'execution_column__execution__experiment__phi_inf': {'name': 'phi_inf', 'type': 'number', 'props': {}},
            'execution_column__execution__experiment__phi_sup': {'name': 'phi_sup', 'type': 'number', 'props': {}},

            'execution_column__execution__experiment__reactor': {'name': 'reactor', 'type': 'string', 'props': {}},
            'execution_column__execution__experiment__reactor_modes': {'name': 'reactor_modes', 'type': 'string', 'props': {}, 'order': 'ascending'},
            'execution_column__label': {'name': 'target', 'type': 'string', 'props': {}, 'order': 'ascending'},

            'd0L2': {'name': 'd0L2', 'type': 'number', 'props': {range: [0, 1],}},
            'd1L2': {'name': 'd1L2', 'type': 'number', 'props': {range: [0, 1],}},
            'd0Pe': {'name': 'd0Pe', 'type': 'number', 'props': {range: [0, 1],}},
            'd1Pe': {'name': 'd1Pe', 'type': 'number', 'props': {range: [0, 1],}},
            'shift': {'name': 'shift', 'type': 'number', 'props': {range: [0, 1],}},
            'score': {'name': 'score', 'type': 'number', 'props': {range: [0, 1],}},
        }

        Object.keys(ofInterest).forEach(element => {
            tmp_support[ofInterest[element]['name']] = {}
        })


        this.state = {
            support: tmp_support,
            ofInterest: ofInterest,
        }


    }

    // getMapping(family, value) {
    //     if (typeof (value) === 'number') {
    //         return value
    //     } else {
    //         if (this.state.mapping[family].hasOwnProperty(value)) {
    //             // console.log(family, value, this.state.mapping[family][value])
    //             return this.state.mapping[family][value]
    //         } else {
    //             let index;
    //             if (Object.values(this.state.mapping[family]).length > 0) {
    //                 index = Math.max(...Object.values(this.state.mapping[family])) + 1
    //             } else {
    //                 index = 0
    //             }
    //             let tmp = this.state.mapping
    //             tmp[family][value] = index
    //             this.setState({mapping: tmp})
    //             return index
    //
    //         }
    //     }
    // }

    // createDataFrame = (list_of_records, remove_targets, first) => {
    //     let tmp = {}
    //     Object.keys(this.ofInterest).forEach(element => {
    //         tmp[this.ofInterest[element]['name']] = []
    //     })
    //
    //     list_of_records.forEach(row => {
    //         if (!remove_targets.includes(row['execution_column__label'])) {
    //             Object.keys(this.ofInterest).forEach(element => {
    //                 let current = this.getMapping(this.ofInterest[element]['name'], row[element])
    //                 tmp[this.ofInterest[element]['name']].push(current)
    //             })
    //         }
    //     })
    //
    //     let dim = {}
    //
    //     Object.keys(this.ofInterest).forEach(element => {
    //         let a = {
    //             label: this.ofInterest[element]['name'],
    //             values: tmp[this.ofInterest[element]['name']],
    //             ...this.ofInterest[element]['props']
    //         }
    //         if (this.ofInterest[element]['type'] === 'string') {
    //             a['tickvals'] = Object.values(this.state.mapping[this.ofInterest[element]['name']])
    //             a['ticktext'] = Object.keys(this.state.mapping[this.ofInterest[element]['name']])
    //         }
    //         dim[this.ofInterest[element]['name']] = a
    //     })
    //
    //     this.setState({
    //         dimensions: dim,
    //     })
    //
    //     if (first){
    //         this.setState({
    //             original_data: list_of_records,
    //             active_targets: Object.keys(this.state.mapping['target']),
    //             targets: Object.keys(this.state.mapping['target']),})
    //     }
    //
    //
    // }

    componentDidMount() {

        // axios.post(window.$API_address + 'frontend/API/getDataFrameExecution',
        //     {
        //         chemModel_id: 4,
        //         attributes: ['score', 'd0L2', 'd1L2', 'd0Pe', 'd1Pe', 'shift',
        //             'execution_column__label',
        //             'execution_column__execution__experiment__id',
        //             'execution_column__execution__experiment__fuels',
        //             'execution_column__execution__experiment__reactor',
        //             'execution_column__execution__experiment__file_paper__year',
        //             'execution_column__execution__experiment__t_inf', 'execution_column__execution__experiment__t_sup',
        //             'execution_column__execution__experiment__p_inf', 'execution_column__execution__experiment__p_sup',
        //             'execution_column__execution__experiment__phi_inf', 'execution_column__execution__experiment__phi_sup']
        //     })
        //     .then(res => {
        //         this.setState({original_data: res.data})
        //         this.createDataFrame(res.data, [], true)
        //
        //     }).catch(error => {
        //     console.log(error)
        //     checkError(error)
        // })
    }

    // getAllIndexes(arr, val) {
    //     let indexes = [], i;
    //     for (i = 0; i < arr.length; i++)
    //         if (arr[i] === val)
    //             indexes.push(i);
    //     return indexes;
    // }
    //
    // handleSelect = (e) => {
    //     this.setState({active: e})
    // }
    //
    // flatten(arr) {
    //     return Array.prototype.concat.apply([], arr);
    // }

    // filterTarget = (dimensions, keep_targets) => {
    //     const target_object = dimensions['target']
    //     const keep_target_indexes = keep_targets.map((t) => {
    //         if (Object.keys(this.state.mapping['target']).includes(t)) {
    //             return this.state.mapping['target'][t]
    //         }
    //     })
    //     const good_indexes = this.flatten(keep_target_indexes.map(index => this.getAllIndexes(target_object['values'], index)))
    //     let dim = dimensions
    //     Object.keys(dim).forEach(key => {
    //         dim[key]['values'] = good_indexes.map(i => dim[key]['values'][i]);
    //         if (key === 'target') {
    //             dim[key]['ticktext'] = keep_targets
    //             dim[key]['tickvals'] = keep_targets.map(e => this.state.mapping['target'][e])
    //         }
    //     })
    //     console.log(dim)
    //     console.log(dimensions)
    //     return dim
    // }

    // handleSelectTarget = (e) => {
    //
    //     const removed = this.state.targets.map((t) => {
    //         if (!e.includes(t)){
    //             return t
    //         }
    //     })
    //
    //
    //     this.setState({active_targets: e, mapping: JSON.parse(JSON.stringify(this.support))}, () =>{
    //         this.createDataFrame(this.state.original_data, removed, false)
    //     })
    //
    //
    //     // const current_dim = this.filterTarget(this.state.original_dimensions, e)
    //     // this.setState({dimensions: current_dim, active_targets: e})
    // }

    render() {

        // this.props.query ? this.sendUpdate(this.state.subject) : null

        const common_props = {
            settings: this.props.settings,
            modelA: this.props.modelA,
            modelB: this.props.modelB,
            mapping_modelName: this.props.mapping_modelName,
            support: JSON.parse(JSON.stringify(this.state.support)),
            ofInterest: this.state.ofInterest
        }

        return (
            // <>
            //     <Select
            //         mode="multiple"
            //         allowClear
            //         style={{width: '40%'}}
            //         placeholder="Please select"
            //         defaultValue={Object.keys(this.ofInterest).map(e => this.ofInterest[e]['name'])}
            //         onChange={this.handleSelect}
            //     >
            //         {Object.keys(this.ofInterest).map(e => <Select.Option
            //             key={this.ofInterest[e]['name']}>{this.ofInterest[e]['name']}</Select.Option>)}
            //     </Select>
            //     <Select
            //         mode="multiple"
            //         allowClear
            //         style={{width: '40%'}}
            //         placeholder="Please select"
            //         value={this.state.active_targets}
            //
            //         onChange={this.handleSelectTarget}
            //     >
            //         {this.state.targets.map(e => <Select.Option key={e}>{e}</Select.Option>)}
            //     </Select>

            <VisualizeTwoParallelPlot {...common_props} />

        )
    }

}

export default TabParallelCoordinates;