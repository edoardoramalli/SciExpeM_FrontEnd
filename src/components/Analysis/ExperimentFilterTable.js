import React from "react";
import {Button, Col, Collapse, Empty, Form, Row, Select, Space, message, Slider, Switch} from "antd";

const {Panel} = Collapse
import BaseTable from "../ExperimentTable/BaseTable";

import Variables from "../Variables"
import {checkError, get_species_options} from "../Tool";
import MinMaxRangeFormItem from "../Shared/MinMaxRangeFormItem";

const axios = require('axios');
import Cookies from "js-cookie";

axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

const Plotly = require('plotly-latest')
import createPlotlyComponent from "react-plotly.js/factory";

const Plot = createPlotlyComponent(Plotly);

const {reactors, experimentTypeToReactor} = Variables

class ExperimentFilterTable extends React.Component {
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

    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            experiments: [],
            fuels: [],
            reactors_options: this.createReactorOptions(),
            species_options: null,
            models_options: null,
            exp_type_options: this.createExperimentTypeOptions(),
            renderPlot: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>,
            x: [],
            y: [],
            z: [[]],
            zmin: 0,
            zmax: 1,
            experimentSelected: [],
            chemModelsSelected: [],
            loadingHeatMap: false,
            loading: false,
            loadingDownloadReport: false,
            species: [],

        }
    }

    async componentDidMount() {
        // axios.get(window.$API_address + 'frontend/api/opensmoke/fuels_names')
        //     .then(res => {
        //         this.setState({fuels: res.data.names, fuels_options: this.createFuelsOptions(res.data.names)});
        //     }).catch(error => {
        //     checkError(error)
        // })

        const fuels_options = await get_species_options()

        this.setState({species_options: fuels_options})


        axios.post(window.$API_address + 'ExperimentManager/API/filterDataBase',
            {fields: ['id', 'name'],
            model_name: 'ChemModel',
            query: {}})
            .then(res => {
                this.setState({models_options: this.createCheModelOptions(res.data)})
            }).catch(error => {
            checkError(error)
        })

        // axios.get(window.$API_address + 'frontend/api/opensmoke/species_names')
        //     .then(res => {
        //         const specie_dict = res.data;
        //         let options = []
        //         Object.entries(specie_dict).forEach(([key, value]) => {
        //             let text = value + ' (ID: ' + key + ')'
        //             options.push(<Select.Option key={text} value={key}>{text}</Select.Option>)
        //         })
        //
        //         this.setState({species: options})
        //     }).catch(error => {
        //     // console.log(error.response);
        // })
    }


    createCheModelOptions(model_list) {
        return model_list.map(item => {
            return (<Select.Option key={item['id']} value={item['id']}>{item['name']}</Select.Option>)
        })
    }

    createExperimentTypeOptions() {
        return Object.keys(experimentTypeToReactor).map((key, index) => {
            return (<Select.Option key={key} value={key}>{key}</Select.Option>)
        })
    }

    createFuelsOptions(fuels) {
        return fuels.map(item => {
            return (<Select.Option key={item} value={item}>{item}</Select.Option>)
        })
    }

    createReactorOptions() {
        return reactors.map((item) => {
            return (<Select.Option value={item.toString()}>{item.toString()}</Select.Option>)
        })
    }

    onFinishFailed = ({values, errorFields}) => {

    };

    onFinishFailedVisualization = ({values, errorFields}) => {

    };

    checkField(dict, name) {
        return dict ? (dict[name] ? dict[name] : undefined) : undefined
    }


    onFinish = values => {

        this.setState({loading: true, experimentSelected: []})
        const params = {
            fields: ['id', 'reactor', 'experiment_type', 'fuels_object', 'status', 'i_can_see_it', 'visible', 'interpreter_name'],
            query: {
                'experiment_type': values.experiment_type,
                'reactor': values.reactor,
                'status': 'verified',
                'fuels_object__id__in': values.fuels && values.fuels.length > 0 ? values.fuels : undefined,
                'executions__chemModel__id__in': values.chemModels && values.chemModels > 0 ? values.chemModels : undefined,
                'executions__experiment__id__isnull': false,
                'executions__execution_end__isnull': false, // solo le simulazioni terminate
                't_inf__gte': this.checkField(values.t_profile, 't_inf'),
                't_sup__lte': this.checkField(values.t_profile, 't_sup'),
                'p_inf__gte': this.checkField(values.p_profile, 'p_inf'),
                'p_sup__lte': this.checkField(values.p_profile, 'p_sup'),
                'phi_inf__gte': this.checkField(values.phi_profile, 'phi_inf'),
                'phi_sup__lte': this.checkField(values.phi_profile, 'phi_sup'),
            },
            model_name: 'Experiment',
        }
        axios.post(window.$API_address + 'ExperimentManager/API/filterDataBase', params)
            .then(res => {
                message.success('Filter successful! Please select the experiments in the following tab.');
                const experiments = res.data
                this.setState({experiments: experiments, loading: false,})
            })
            .catch(error => {
                this.setState({loading: false})
                checkError(error)
            })

    }

    onFinishVisualization = values => {

        let identifier = values['toggle'] === undefined || values['toggle'] === true ? 'fileDOI' : 'id'
        let specie = values['specie'] === undefined ? 0 : values['specie']
        console.log(values)
        this.setState({loadingHeatMap: true})
        axios.post(window.$API_address + 'frontend/API/getHeatMapExecution',
            {
                exp_list: this.state.experimentSelected,
                chemModel_list: this.state.chemModelsSelected,
                identifier: identifier,
                specieName: specie,
            })
            .then(res => {
                this.setState({
                    loadingHeatMap: false,
                    x: res.data.x,
                    y: res.data.y,
                    z: res.data.z,
                })
            })
            .catch(error => {
                this.setState({loadingHeatMap: false})
                checkError(error)
            })

    }

    changeModels(value) {
        this.setState({chemModelsSelected: value})
    }

    experimentSelection(list) {
        this.setState({experimentSelected: list})
    }

    // loadHeatMap() {
    //     this.setState({loadingHeatMap: true})
    //     axios.post(window.$API_address + 'frontend/API/getHeatMapExecution',
    //         {exp_list: this.state.experimentSelected, chemModel_list: this.state.chemModelsSelected})
    //         .then(res => {
    //             this.setState({
    //                 loadingHeatMap: false,
    //                 x: res.data.x,
    //                 y: res.data.y,
    //                 z: res.data.z,
    //             })
    //         })
    //         .catch(error => {
    //             this.setState({loadingHeatMap: false})
    //             checkError(error)
    //         })
    // }

    downloadReport = () => {
        this.setState({loadingDownloadReport: true})
        axios.post(window.$API_address + 'ExperimentManager/API/getReportSimulation',
            {exp_list: this.state.experimentSelected, chemModel_list: this.state.chemModelsSelected}, {
                responseType: 'arraybuffer',
            })
            .then(res => {

                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'report.zip');
                document.body.appendChild(link);
                link.click();
                message.success('File downloaded')
                this.setState({loadingDownloadReport: false})

            })
            .catch(error => {
                checkError(error)
                this.setState({loadingDownloadReport: false})
            })
    }

    sliderChange = (value) => {
        this.setState({zmin: value[0], zmax: value[1]})
    }


    render() {
        const marks = {
            0: '0',
            0.25: '0.25',
            0.5: '0.5',
            0.75: '0.75',
            1: '1'
        };

        return (
            <Collapse style={{width: '100%'}} defaultActiveKey={['1']} destroyInactivePanel={true}>
                <Panel
                    header="Filter Execution Experiment DataBase (All the conditions are in logic AND with each other, if the field is not empty)"
                    key="1">
                    <Form
                        onFinish={this.onFinish}
                        onFinishFailed={this.onFinishFailed}
                        layout="vertical"
                        autoComplete="off"
                    >
                        <Row>
                            <Space size={'large'}>
                                <Col>
                                    <Form.Item
                                        name={'experiment_type'}
                                        label={'Experiment Type:'}
                                        rules={[{required: false}]}
                                    >
                                        <Select placeholder={'Please select an experiment type'}
                                                style={{width: 320}}>
                                            {this.state.exp_type_options}
                                        </Select>
                                    </Form.Item>

                                </Col>
                                <Col>
                                    <Form.Item
                                        name={'reactor'}
                                        label={'Reactor Type:'}
                                        rules={[{required: false}]}
                                    >
                                        <Select placeholder={'Please select a reactor'} style={{width: 200}}>
                                            {this.state.reactors_options}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col>
                                    <Form.Item
                                        name={'fuels'}
                                        label={'Fuels (In logic OR):'}
                                        rules={[{required: false}]}
                                    >
                                        <Select
                                            mode="multiple"
                                            placeholder="Please select fuels"
                                            style={{width: 300}}
                                            allowClear
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            filterSort={(optionA, optionB) => optionA.value > optionB.value}
                                        >
                                            {this.state.species_options}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col>
                                    <Form.Item
                                        name={'chemModels'}
                                        label={'Chem Models (In logic OR):'}
                                        rules={[{required: false}]}
                                    >
                                        <Select
                                            mode="multiple"
                                            placeholder="Please select Chem Models"
                                            style={{width: 450}}
                                            allowClear
                                            showSearch={true}
                                            filterOption={(input, option) => {
                                                return (
                                                    option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                );

                                            }}
                                            onChange={this.changeModels.bind(this)}
                                        >
                                            {this.state.models_options}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Space>
                        </Row>
                        <Row>
                            <Space size={'large'}>
                                <MinMaxRangeFormItem
                                    label={"Temperature Range Profile (Min-Max) [K]"}
                                    require={false}
                                    groupName={'t_profile'}
                                    minName={'t_inf'}
                                    maxName={'t_sup'}
                                    min={250}
                                    max={3500}
                                    step={10}
                                />
                                <MinMaxRangeFormItem
                                    label={"Pressure Range Profile (Min-Max) [bar]"}
                                    require={false}
                                    groupName={'p_profile'}
                                    minName={'p_inf'}
                                    maxName={'p_sup'}
                                    min={0}
                                    max={150}
                                    step={5}
                                />
                                <MinMaxRangeFormItem
                                    label={"Equivalent Ratio Range Profile (Min-Max) [phi = 100 (+inf)]"}
                                    require={false}
                                    groupName={'phi_profile'}
                                    minName={'phi_inf'}
                                    maxName={'phi_sup'}
                                    min={0}
                                    max={150}
                                    step={0.1}
                                />
                            </Space>
                        </Row>
                        <Form.Item>

                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{margin: "10px"}}
                                size={"large"}
                                loading={this.state.loading}
                            >
                                Filter DataBase
                            </Button>

                        </Form.Item>
                    </Form>
                </Panel>
                <Panel header="Result Table" key="2">
                    <BaseTable
                        header={false}
                        experiments={this.state.experiments}
                        loading={this.state.loading}
                        selectHook={this.experimentSelection.bind(this)}
                        excludedColumns={[]}
                    />
                </Panel>
                <Panel header={"Visualization"} key={"3"}>
                    <Space size={'large'} direction={'vertical'}>
                        <Row>
                            <Space>

                                <Form
                                    onFinish={this.onFinishVisualization}
                                    onFinishFailed={this.onFinishFailedVisualization}
                                    layout="vertical"
                                    autoComplete="off"
                                >
                                    <Row>
                                        <Col>
                                            <Form.Item
                                                name={'toggle'}
                                                // label={'Chem Models (In logic OR):'}
                                                rules={[{required: false}]}
                                            >
                                                <Switch checkedChildren="FileDOI" unCheckedChildren="ID"
                                                        defaultChecked/>

                                            </Form.Item>
                                        </Col>

                                        <Col>
                                            <Form.Item
                                                name={'specie'}
                                                // label={'Chem Models (In logic OR):'}
                                                rules={[{required: false}]}
                                            >
                                                <Select
                                                    showSearch
                                                    placeholder={"Select a species"}
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) =>
                                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                    filterSort={(optionA, optionB) => optionA.value > optionB.value}style={{width: 150}}>
                                                    {this.state.species_options}
                                                </Select>
                                            </Form.Item>
                                        </Col>

                                        <Col>
                                            <Form.Item>

                                                <Button
                                                    type="primary"
                                                    htmlType="submit"
                                                    style={{margin: "10px"}}
                                                    size={"large"}
                                                    loading={this.state.loadingHeatMap}
                                                >
                                                    Load/Refresh Heat Map
                                                </Button>

                                            </Form.Item>
                                        </Col>
                                    </Row>


                                </Form>
                                {/*<Button*/}
                                {/*    type="primary"*/}
                                {/*    onClick={this.loadHeatMap.bind(this)}*/}
                                {/*    loading={this.state.loadingHeatMap}*/}
                                {/*>*/}
                                {/*    Load/Refresh Heat Map*/}
                                {/*</Button>*/}

                                <Button
                                    type="primary"
                                    onClick={this.downloadReport.bind(this)}
                                    loading={this.state.loadingDownloadReport}
                                >
                                    Download Report
                                </Button>

                                <Slider
                                    range
                                    marks={marks}
                                    defaultValue={[this.state.zmin, this.state.zmax]}
                                    style={{width: 150}}
                                    min={0}
                                    max={1}
                                    step={0.05}
                                    onChange={this.sliderChange}
                                />
                            </Space>
                        </Row>
                        <Row>
                            <Plot
                                data={[
                                    {
                                        type: 'heatmap',
                                        zmin: this.state.zmin,
                                        zmax: this.state.zmax,
                                        z: this.state.z,
                                        x: this.state.x,
                                        y: this.state.y,
                                        colorscale: this.colorScale,
                                        xgap: 2,
                                        ygap: 2,
                                        hovertemplate: 'Identifier: %{x}<br>Chem Model: %{y}<br>CM Score: %{z}'
                                    },
                                ]}
                                layout={{
                                    title: 'Heat Map Curve Matching Scores',
                                    autosize: true,
                                    width: 1200,
                                    height: 500,
                                    yaxis: {automargin: true},
                                    xaxis: {automargin: true}
                                }}
                            />
                            {/*{this.state.renderPlot}*/}
                        </Row>
                    </Space>

                </Panel>
            </Collapse>
        )
    }
}

export default ExperimentFilterTable;