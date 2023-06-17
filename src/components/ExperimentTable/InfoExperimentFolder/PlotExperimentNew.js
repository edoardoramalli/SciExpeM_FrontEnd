import React from "react";
import {Tabs, Alert, message} from "antd";

const axios = require('axios');
import Cookies from "js-cookie";
axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

const Plotly = require('plotly-latest')

import createPlotlyComponent from "react-plotly.js/factory";
const Plot = createPlotlyComponent(Plotly);
import {checkError} from "../../Tool"

import {preferred_unit} from '../../Variables'



class PlotExperimentNew extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            plotList: [],
            baseConfig: {width: 1000, height: 480, showlegend: true, autosize: true,
                // xaxis: {
                //     autorange: true,
                //     linecolor: "lightgrey",
                //     linewidth: 2,
                //     mirror: true
                // },
                legend: {
                    x: 1.1,
                    y: 1,
                    font: {
                        family: 'sans-serif',
                        size: 12,
                        color: '#000'
                    },
                    bgcolor: 'rgba(226,226,226,0.3)',
                    bordercolor: '#FFFFFF',
                    borderwidth: 2
                },
            },
            addConfig: {},
            renderObject: null,
            tabs: null,
            baseConfigPlot: {mode: "markers", marker: {'size': 10}, type: "scatter"},
        }
    }

    extend(obj, src) {
        Object.keys(src).forEach(function(key) { obj[key] = src[key]; });
        return obj;
    }

    renderTabs = (info, data) => {
        return (Object.entries(info).map(([key, value], index) => {

            return(
                <Tabs.TabPane tab={key} key={index}>
                    <Plot
                        data={data[key]}
                        layout={{...this.state.baseConfig, ...value}}
                    />
                </Tabs.TabPane>
            )
        }))

    }

    // get_uncertainty_kind(u){
    //     if (u === 'absolute'){
    //         return 'data'
    //     }
    //     else if (u === 'relative'){
    //         return 'percent'
    //     }
    //     else{
    //         console.log('efewfewfewf')
    //     }
    // }

    prepare_axis (ax){
        const ax_name = ax['name']
        const ax_unit = ax['units']
        let ax_data = []
        let factor = 1.0
        if (!Object.keys(preferred_unit).includes(ax_name)){
            message.error('Property missing. Contact Edo!')
        }
        if (preferred_unit[ax_name] !== ax_unit){
            if (ax_name === 'distance'){
                if (ax_unit === 'm'){
                    factor = 100 // to cm
                }
                else if (ax_unit === 'mm'){
                    factor = 0.1 // to cm
                }
                else{
                    message.error('Unit missing. Contact Edo!')
                    console.log('1', ax_name, ax_unit)
                }
            }
            else if (ax_name === 'ignition delay'){
                if (ax_unit === 'ms'){
                    factor = 1000 // to us
                }
                else if (ax_unit === 's'){
                    factor = 1000000 // to us
                }
                else{
                    message.error('Unit missing. Contact Edo!')
                    console.log('2', ax_name, ax_unit)
                }
            }
            else{
                message.error('Unit missing. Contact Edo!')
                console.log('3', ax_name, ax_unit)

            }
        }
        else{
            factor = 1.0
        }

        if (ax['transformation'] === 'inv'){
            ax['data'].forEach(element =>ax_data.push(1000/element));
        }
        else{
            ax_data = ax['data'].map((e, i) => { return e * factor; })
        }

        let name = ax_name

        if (ax_name === 'composition'){
            let species_names = []
            ax['species_object'].forEach(specie => species_names.push(specie['preferredKey']))
            name = species_names.join('+')
        }

        let error_data = undefined
        let error_kind = undefined

        if (ax['uncertainty_reference'] !== null){
            error_data = ax['uncertainty_reference']['data']
            error_kind = 'data'
            if (ax['uncertainty_reference']['uncertainty_kind'] === 'relative'){
                error_data = error_data.map((e, i) => { return e * ax_data[i]; })
            }

        }

        return {'data': ax_data, 'name': name, 'error_data': error_data, 'error_kind': error_kind}
    }

    prepare_pair (pair) {
        const new_x = this.prepare_axis(pair['x'])
        const new_y = this.prepare_axis(pair['y'])

        return {
            'x': new_x['data'],
            'y': new_y['data'],
            'name': new_y['name'],
            type: "scatter",
            mode: "markers",
            marker: {size: 10},
            'error_y': {
                array: new_y['error_data'],
                type: new_y['error_kind'],
            },
            'error_x': {
                array: new_x['error_data'],
                type: new_x['error_kind'],
            }

        }
        // return <Plot
        //     data={[{...this.state.baseConfigPlot, ...val}]}
        //     layout={{...this.state.baseConfig}}
        // />
    }

    create_dgs(pairs){
        let dgs = {}
        pairs.forEach(pair =>{
            if (!Object.keys(dgs).includes(pair['x']['name'])){
                dgs[pair['x']['name']] = {}
            }
            if (!Object.keys(dgs[pair['x']['name']]).includes(pair['y']['name'])){
                dgs[pair['x']['name']][pair['y']['name']] =
                    {'pairs': [],
                        'x_transformation': pair['x']['transformation'],
                        'y_transformation': pair['y']['transformation'],
                        'x_unit': preferred_unit[pair['x']['name']],
                        'y_unit': preferred_unit[pair['y']['name']],
                    }
            }
        })

        return dgs

    }

    get_type_plot(type){
        if (type === 'lin'){
            return 'linear'
        }
        else if (type === 'log10'){
            return 'log'
        }
        else if (type === 'inv'){
            return 'linear'
        }
    }

    create_tab_from_dg(dg, x_label, y_label){

        const key = x_label + ' Vs ' + y_label

        return  <Tabs.TabPane tab={key} key={key}>
            <Plot
                data={dg['pairs']}
                layout={{...this.state.baseConfig, ...{
                        xaxis: {title: {text: x_label + ' [' + dg['x_unit'] + '] ' + '(' + dg['x_transformation'] + ')'}, type: this.get_type_plot(dg['x_transformation'])},
                        yaxis: {title: {text: y_label + ' [' + dg['y_unit'] + '] ' + '(' + dg['y_transformation'] + ')'}, type: this.get_type_plot(dg['y_transformation'])},
                    }
                    }}
            />
        </Tabs.TabPane>
    }

    componentDidMount() {
        this.setState({loading: true});
        const params = {exp_id: this.props.exp_id.toString()}
        axios.post(window.$API_address + 'frontend/API/getPlotExperimentNew', params)
            .then(res => {
                const result = res.data

                let dgs = this.create_dgs(result)

                result.forEach(pair =>{
                    dgs[pair['x']['name']][pair['y']['name']]['pairs'].push(this.prepare_pair(pair))
                })

                let tabs = []

                Object.keys(dgs).forEach(x_axis => Object.keys(dgs[x_axis]).forEach(dg => tabs.push(this.create_tab_from_dg(dgs[x_axis][dg], x_axis, dg))))

                // const plot = this.createDG(result[0])
                this.setState({
                    renderObject: <Tabs>
                        {tabs}
                    </Tabs>
                })
            })
            .catch(error => {
                this.setState({
                    renderObject:
                        <Alert message="Experiment Plot is not supported yet." type="warning" />
                })
                checkError(error)
            })
    }

    render() {
        return(this.state.renderObject)
    }

}

export default PlotExperimentNew;