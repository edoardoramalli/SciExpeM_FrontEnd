import React from "react";

import {Spin, Empty, Row} from "antd";


const Plotly = require('plotly-latest')

import createPlotlyComponent from "react-plotly.js/factory";

const Plot = createPlotlyComponent(Plotly);


class World extends React.Component {

    colorScale = [
        [0, "rgb(165,0,38)"],
        [0.1, "rgb(215,48,39)"],
        [0.2, "rgb(244,109,67)"],
        [0.3, "rgb(253,174,97)"],
        [0.4, "rgb(254,224,139)"],
        [0.5, "rgb(255,255,191)"],
        [0.6, "rgb(217,239,139)"],
        [0.7, "rgb(166,217,106)"],
        [0.8, "rgb(102,189,99)"],
        [0.9, "rgb(26,152,80)"],
        [1, "rgb(0,104,55)"]]

    render() {
        let obj;

        if (this.props.data && this.props.data.x) {
            obj = <Plot
                data={[
                    {
                        type: 'scatter3d',
                        mode: 'markers',
                        name: '',
                        z: this.props.data.z,
                        x: this.props.data.x,
                        y: this.props.data.y,
                        colorscale: this.colorScale,
                        customdata: this.props.data.s,
                        marker: {
                            size: this.props.data.s.map(i => this.props.settings.offset_size + i),
                            color: this.props.data.c,
                            colorscale: this.colorScale,
                            opacity: 0.5,
                            showscale: true,
                            cmax: this.props.settings.cmax,
                            cmin: this.props.settings.cmin,
                        },
                        hovertemplate: '(T: %{x}, P: %{y}, Phi: %{z}) <br> ' +
                            '#: %{customdata} - CM: %{marker.color:.3f}'
                    },
                ]}
                layout={{
                    // autosize: true,
                    width: '100px',
                    margin: {l: 0, r: 0, b: 0, t: 0, pad: 0},
                    scene: {
                        xaxis: {title: 'Temperature [K]'},
                        yaxis: {title: 'Pressure [bar]'},
                        zaxis: {title: 'Phi'}
                    }
                }}
            />
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

export default World;