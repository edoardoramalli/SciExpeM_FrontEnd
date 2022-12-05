import React from "react";
import {Button, Col, Collapse, Divider, Tabs, message, Row, Select, Slider, Space, Switch} from "antd";
import {SendOutlined} from '@ant-design/icons';

import {checkError} from "../Tool";
import QueryVisualizer from "./QueryVisualizer";
import CustomFilter from "./CustomFilter";
import VisualizeSingleGroupPlot from "./VisualizeSingleGroupPlot";
import VisualizeTwoParityPlot from "./VisualizeTwoParityPlot";
import VisualizeCustomPlots from "./VisualizeCustomPlots";
import TabParallelCoordinates from "./TabParallelCoordinates";
import VisualizeTwoIntervalAnalysis from "./VisualizeTwoIntervalAnalysis";
// import GeneralPanel from "./GeneralPanel";




const {Panel} = Collapse;
const {TabPane} = Tabs;

class Validation extends React.Component {

    constructor() {
        super();


        this.state = {
            mountKey: Math.random(),

            modelA: -1,
            tmp_modelA: -1,
            modelB: -1,
            tmp_modelB: -1,

            models_options: [],
            mapping_modelName: [],
            fuels: [],
            targets: [],
            activeFuel: null,
            activeTarget: null,

            panelList: [],
            counter: 2,

            settings: {
                absolute_threshold: 0.5,
                relative_threshold: 0.2,
                cmin: 0,
                cmax: 1,
                cmin_diff: -0.5,
                cmax_diff: 0.5,
                offset_size: 10,
                common_experiments: true,
            }
        }
    }

    componentDidMount() {
        axios.post(window.$API_address + 'ExperimentManager/API/filterDataBase',
            {fields: ['id', 'name'], model_name: 'ChemModel', query: {}})
            .then(res => {
                const options = res.data

                this.setState({
                    models_options: this.createCheModelOptions(options),
                    mapping_modelName: options,
                })
            }).catch(error => {
            checkError(error)
        })


    }

    getFuels() {
        let tmp = [];
        if (this.state.modelA !== -1) {
            tmp.push(this.state.modelA)
        }
        if (this.state.modelB !== -1) {
            tmp.push(this.state.modelB)
        }
        axios.post(window.$API_address + 'frontend/API/getFuelValidation', {chemModel_list: tmp})
            .then(res => {
                const result = JSON.parse(res.data)
                this.setState({fuels: result, activeFuel: result[0]})
            }).catch(error => {
            checkError(error)
        })
    }

    getTargets(){
        let tmp = [];
        if (this.state.modelA !== -1) {
            tmp.push(this.state.modelA)
        }
        if (this.state.modelB !== -1) {
            tmp.push(this.state.modelB)
        }
        axios.post(window.$API_address + 'frontend/API/getTargetValidation', {chemModel_list: tmp})
            .then(res => {
                const result = JSON.parse(res.data)
                this.setState({targets: result, activeFuel: result[0]})
            }).catch(error => {
            checkError(error)
        })
    }

    createCheModelOptions(model_list) {
        return model_list.map(item => {
            return (<Select.Option key={item['id']} value={item['id']}>{item['name']}</Select.Option>)
        })
    }

    onChangeSliderThresholdAbsolute = (value) => {
        let tmp = this.state.settings
        tmp.absolute_threshold = value
        this.setState({settings: tmp})
    }

    onChangeSliderThresholdRelative = (value) => {
        let tmp = this.state.settings
        tmp.relative_threshold = value
        this.setState({settings: tmp})
    }

    sliderChange = (value) => {
        let tmp = this.state.settings
        tmp.cmin = value[0]
        tmp.cmax = value[1]
        this.setState({settings: tmp})
    }


    sliderChangeDiff = (value) => {
        let tmp = this.state.settings
        tmp.cmin_diff = value[0]
        tmp.cmax_diff = value[1]
        this.setState({settings: tmp})
    }

    changeModelA = (value) => {
        this.setState({tmp_modelA: value})
    }

    changeModelB = (value) => {
        this.setState({tmp_modelB: value})
    }

    send = () => {
        this.setState({
            mountKey: Math.random(),
            modelA: this.state.tmp_modelA,
            modelB: this.state.tmp_modelB
        }, () => {
            this.getFuels()
            this.getTargets()
        })
        message.success('Validation Started!');

        // console.log(this.state.tmp_modelA)
    }

    changeActiveFuel = (value) => {
        this.setState({activeFuel: value})
    }

    changeActiveTarget = (value) => {
        this.setState({activeTarget: value})
    }

    onChangeSliderOffsetSize = (value) =>{
        let tmp = this.state.settings
        tmp.offset_size = value
        this.setState({settings: tmp})
    }

    onChangeSwitch = (value) =>{
        let tmp = this.state.settings
        tmp.common_experiments = value
        this.setState({settings: tmp})
    }



    flatListToObject = (list) =>{
        let tmp = {}
        list.forEach(e =>{tmp[e['id']] = e['name']})
        return tmp
    }

    addPanel = () =>{
        let tmp = this.state.panelList
        // const edo =
        //     <Panel header={"Workspace " + this.state.counter} key={this.state.counter}>
        //         edoardooooo
        //     </Panel>
        const edo = <GeneralPanel counter={this.state.counter} />
        tmp.push(edo)
        this.setState({panelList: tmp, counter: this.state.counter + 1})
    }



    render() {
        const query_general = {execution_column__execution__chemModel__id: '$$$'}
        const {mountKey} = this.state;



        const base_props = {
            settings: this.state.settings,
            modelA: this.state.modelA,
            modelB: this.state.modelB,
            mapping_modelName: this.flatListToObject(this.state.mapping_modelName)
        }

        const opts = {

        }

        return (
            <>
                <Collapse defaultActiveKey={[1, 2]}>
                    {/*<Panel header={"Interval Analysis"} key="2E">*/}
                    {/*    <VisualizeTwoIntervalAnalysis  modelA={24} modelB={undefined} query={{'execution_column__label': 'H2O_x', 'execution_column__execution__experiment__fuels__contains': ['H2'], 'execution_column__execution__chemModel__id': 24} }/>*/}
                    {/*</Panel>*/}

                    <Panel header="Configuration" key={1}>

                        <Row>
                            <Col span={24}>
                                <Collapse defaultActiveKey={['1A']}>
                                    <Panel header="Select Model" key="1A">
                                        <Row>
                                            <Col span={11}>
                                                <Divider>Model A</Divider>
                                                <Row justify="space-around" align="middle">
                                                    <Select
                                                        placeholder="Please select Chem Models"
                                                        onChange={this.changeModelA.bind(this)}
                                                        style={{width: '80%'}}
                                                        allowClear
                                                        showSearch={true}
                                                        filterOption={(input, option) => {
                                                            return (
                                                                option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                            );

                                                        }}
                                                    >
                                                        {this.state.models_options}
                                                    </Select>
                                                </Row>

                                            </Col>
                                            <Col span={2}>

                                            </Col>
                                            <Col span={11}>
                                                <Divider>Model B</Divider>
                                                <Row justify="space-around" align="middle">
                                                    <Select
                                                        style={{width: '80%'}}
                                                        placeholder="Please select Chem Models"
                                                        onChange={this.changeModelB.bind(this)}
                                                        allowClear
                                                        showSearch={true}
                                                        filterOption={(input, option) => {
                                                            return (
                                                                option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                            );

                                                        }}
                                                    >
                                                        {this.state.models_options}
                                                    </Select>
                                                </Row>

                                            </Col>

                                        </Row>
                                        <Row justify="space-around" align="middle" style={{marginTop: 30}}>
                                            <Button onClick={this.send.bind(this)} size={'large'} icon={<SendOutlined />}>Validate</Button>
                                        </Row>
                                    </Panel>
                                    <Panel header="Settings" key="2A">
                                        <Row>
                                            <Col span={11}>
                                                <Divider>
                                                    Min - Max ColorBar
                                                </Divider>
                                                <Slider
                                                    range
                                                    marks={{0: '0', 0.25: '0.25', 0.5: '0.5', 0.75: '0.75', 1: '1'}}
                                                    defaultValue={[this.state.settings.cmin, this.state.settings.cmax]}
                                                    min={0}
                                                    max={1}
                                                    step={0.05}
                                                    onChange={this.sliderChange}
                                                />
                                            </Col>
                                            <Col span={2}>
                                            </Col>
                                            <Col span={11}>
                                                <Divider>Min - Max ColorBar Diff</Divider>
                                                <Slider
                                                    range
                                                    marks={{'-1': -1, '-0.75': -0.75, '-0.5': '-0.5', '-0.25': '-0.25', 0: 0, 0.25: 0.25, 0.5: 0.5, 0.75: 0.75, 1: 1}}
                                                    defaultValue={[this.state.settings.cmin_diff, this.state.settings.cmax_diff]}
                                                    min={-1}
                                                    max={1}
                                                    step={0.05}
                                                    onChange={this.sliderChangeDiff}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={11}>
                                                <Divider>Absolute Threshold</Divider>
                                                <Slider
                                                    min={0}
                                                    max={1}
                                                    step={0.05}
                                                    marks={{0: 0, 0.25: 0.25, 0.5: 0.5, 0.75: 0.75, 1: 1}}
                                                    defaultValue={this.state.settings.absolute_threshold}
                                                    onChange={this.onChangeSliderThresholdAbsolute}
                                                />
                                            </Col>
                                            <Col span={2}>
                                            </Col>

                                            <Col span={11}>
                                                <Divider>Relative Threshold</Divider>
                                                <Slider
                                                    min={0}
                                                    max={1}
                                                    step={0.05}
                                                    marks={{0: 0, 0.25: 0.25, 0.5: 0.5, 0.75: 0.75, 1: 1}}
                                                    defaultValue={this.state.settings.relative_threshold}
                                                    onChange={this.onChangeSliderThresholdRelative}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={11}>
                                                <Divider>Offset Size</Divider>
                                                <Slider
                                                    min={0}
                                                    max={20}
                                                    step={1}
                                                    marks={{0: 0, 5: 5, 10: 10, 15: 15, 20: 20}}
                                                    defaultValue={this.state.settings.offset_size}
                                                    onChange={this.onChangeSliderOffsetSize}
                                                />
                                            </Col>
                                            <Col span={2}>
                                            </Col>
                                            <Col span={11}>
                                                <Divider>Only Common Experiments</Divider>
                                                <Switch
                                                    checkedChildren={'Yes'}
                                                    unCheckedChildren={'No'}
                                                    defaultChecked={this.state.settings.common_experiments}
                                                    onChange={this.onChangeSwitch}
                                                />
                                            </Col>


                                        </Row>
                                    </Panel>
                                </Collapse>
                            </Col>

                        </Row>

                    </Panel>
                    {/*{this.state.panelList}*/}
                    {/*<Row justify="space-around" align="middle" style={{marginTop: 30}}>*/}
                    {/*    <Button type={"dashed"} onClick={this.addPanel}>Add Panel</Button>*/}
                    {/*</Row>*/}

                    <Panel header="General Results" key="2">
                        <QueryVisualizer
                            key={mountKey}
                            query={query_general}
                            additional={
                                <Panel header={"Parallel Coordinates "} key="2E">
                                    <TabParallelCoordinates {...base_props}/>
                                </Panel>
                            }
                            {...base_props}/>
                    </Panel>
                    <Panel header="Fuels" key={"3"}>
                        <Tabs centered type="card" onChange={this.changeActiveFuel}>
                            {
                                this.state.fuels.map((element, i) => {
                                    const query = {execution_column__execution__experiment__fuels: element, ...query_general}
                                    return <TabPane tab={element.toString()} key={element.toString()}>
                                        {/*<QueryVisualizer*/}
                                        {/*    key={mountKey}*/}
                                        {/*    query={query}*/}
                                        {/*    additional={*/}
                                        {/*        <Panel header={"Custom Filter - " + element} key="3D">*/}
                                        {/*            <CustomFilter {...base_props} query={query}/>*/}
                                        {/*        </Panel>*/}
                                        {/*    }*/}
                                        {/*    {...base_props}/>*/}
                                            <Tabs centered type="card" onChange={this.changeActiveTarget}>
                                                {
                                                    this.state.targets.map((target, i) => {
                                                        const query = {execution_column__label: target,
                                                            execution_column__execution__experiment__fuels: element, ...query_general}
                                                        return <TabPane tab={target} key={target}>
                                                            <QueryVisualizer
                                                                key={mountKey}
                                                                query={query}
                                                                target={target}
                                                                additional={
                                                                    <>
                                                                        <Panel header={"Custom Filter - " + target} key="4D">
                                                                            <CustomFilter {...base_props} query={query} target={target}/>
                                                                        </Panel>
                                                                        <Panel header={"Plots"} key="4EE">
                                                                            <VisualizeSingleGroupPlot  {...base_props} query={query} target={target}/>
                                                                        </Panel>
                                                                        <Panel header={"Parity Plots"} key="4F">
                                                                            <VisualizeTwoParityPlot  {...base_props} query={query} target={target}/>
                                                                        </Panel>
                                                                    </>
                                                                }
                                                                {...base_props}/>
                                                        </TabPane>
                                                    })
                                                }
                                            </Tabs>
                                    </TabPane>
                                })
                            }
                        </Tabs>


                    </Panel>
                    <Panel header="Targets" key="4">
                        <Tabs centered type="card" onChange={this.changeActiveTarget}>
                            {
                                this.state.targets.map((target, i) => {
                                    const query = {execution_column__label: target, ...query_general}
                                    return <TabPane tab={target} key={target}>
                                        <QueryVisualizer
                                            key={mountKey}
                                            query={query}
                                            target={target}
                                            additional={
                                                <>
                                                    <Panel header={"Custom Filter - " + target} key="4D">
                                                        <CustomFilter {...base_props} query={query} target={target}/>
                                                    </Panel>
                                                    <Panel header={"Plots"} key="4EE">
                                                        <VisualizeSingleGroupPlot  {...base_props} query={query} target={target}/>
                                                    </Panel>
                                                    <Panel header={"Parity Plots"} key="4F">
                                                        <VisualizeTwoParityPlot  {...base_props} query={query} target={target}/>
                                                    </Panel>
                                                </>
                                            }
                                            {...base_props}/>
                                    </TabPane>
                                })
                            }
                        </Tabs>
                    </Panel>
                    <Panel header="Plots" key="5">
                        <VisualizeCustomPlots targets={this.state.targets} {...base_props} />
                    </Panel>
                </Collapse>
            </>

        )
    }

}

export default Validation;