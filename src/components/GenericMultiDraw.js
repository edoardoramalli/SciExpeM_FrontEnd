import React from "react";

import Plotly from "plotly.js-cartesian-dist";
import createPlotlyComponent from "react-plotly.js/factory";
import {Select, Tabs} from "antd";

const Plot = createPlotlyComponent(Plotly);

class GenericMultiDraw extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            group_size: 1
        }
    }

    handleGroupSizeChange = (value) => {
        const group_size = value === 'all' ? this.props.response.curves.length : value;

        this.setState({
            group_size: group_size
        });
    };

    render() {

        const curves = this.props.response.curves;

        if (curves == null) {
            return null;
        }

        const groupby = <Select defaultValue="1" style={{width: 120}} onChange={this.handleGroupSizeChange}>
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="1">1</Select.Option>
            <Select.Option value="2">2</Select.Option>
            <Select.Option value="3">3</Select.Option>
        </Select>

        const type = this.props.response.logY ? 'log' : 'linear';


        const titles = this.props.response.curves.map((curve => curve[0]['name']));

        const group_size = this.state.group_size;

        const sub_groups_titles = [];
        while (titles.length > 0)
            sub_groups_titles.push(titles.splice(0, group_size));


        const curves_copy = this.props.response.curves.slice(0);
        const sub_groups = [];
        while (curves_copy.length > 0)
            sub_groups.push(curves_copy.splice(0, group_size));


        const plots = sub_groups.map((group) => <Plot
            data={group.flat()}
            useResizeHandler={true}
            //style={{width: "100%", height: "100%"}}
            layout={{
                showlegend: true,
                yaxis: {type: type, title: this.props.response.y_axis},
                xaxis: {title: this.props.response.x_axis},
                title: this.props.experiment,
                autosize: true
            }}
            config={{displaylogo: false, showLink: false, modeBarButtonsToRemove: ['sendDataToCloud']}}
        />);


        const component_groups = plots.map((plot, index) =>
            <Tabs.TabPane  key={sub_groups_titles[index].join(",")} tab={sub_groups_titles[index].join(" - ")}>{plot}</Tabs.TabPane>
        );

        return (
            <div>
                <Tabs type="card" size="small" tabBarExtraContent={groupby}>
                    {component_groups}
                </Tabs>
            </div>
        );
    }
}

export default GenericMultiDraw;