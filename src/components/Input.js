import React from 'react';
import {
    Form,
    Input,
    InputNumber,
    Icon,
    Button,
    Select,
    Collapse,
    Upload,
    Table,
    Popover,
    Modal,
    Alert,
    Switch,
    message
} from 'antd';
import './Input.css';
import axios from "axios/index";

// import {InitialSpeciesList, CommonPropertiesList} from "./Search"
// import {ExperimentDraw} from "./Db"

import Cookies from 'js-cookie';

// import { Link } from 'react-router-dom';


// import ReactorSelect from "./InputForm/ReactorSelect"

// Local Import
const GenericTable = React.lazy(() => import('./GenericTable'));

const Option = Select.Option;
const Panel = Collapse.Panel;

const FormItem = Form.Item;

let props_uuid = 0;
let species_uuid = 0;


const csrftoken = Cookies.get('csrftoken');
axios.defaults.headers.post['X-CSRFToken'] = csrftoken; // for POST requests






// class ReviewTable extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             loading: true,
//             number_managed: 0,
//             experiments: []
//         }
//     }
//
//     componentDidMount() {
//         this.setState({loading: true});
//         axios.get(window.$API_address + 'frontend/api/experiments/filter', {
//             params: {
//                 experiments: this.props.exp_ids
//             }
//         })
//             .then(res => {
//                 const experiments = res.data;
//                 const experiments_managed = res.data.filter((exp) => exp.run_type_str != null);
//                 this.setState({experiments: experiments, loading: false, number_managed: experiments_managed.length});
//             })
//     }
//
//     render() {
//         const columns = [{
//             title: 'File DOI',
//             dataIndex: 'fileDOI',
//             key: 'fileDOI',
//             sorter: (a, b) => {
//                 return a.fileDOI.localeCompare(b.fileDOI)
//             },
//
//         },
//             //     {
//             //     title: 'Id',
//             //     dataIndex: 'id',
//             //     key: 'id',
//             // },
//             {
//                 title: 'Paper',
//                 dataIndex: 'file_paper.title',
//                 key: 'file_paper.title',
//             }, {
//                 title: 'Reactor',
//                 dataIndex: 'reactor',
//                 key: 'reactor',
//
//             }, {
//                 title: 'Properties',
//                 dataIndex: 'common_properties',
//                 key: 'common_properties',
//                 render: props => <CommonPropertiesList common_properties={props}/>
//             }, {
//                 title: 'Initial species',
//                 dataIndex: 'initial_species',
//                 key: 'initial_species',
//                 render: props => <InitialSpeciesList initial_species={props}/>,
//             }, {
//                 title: 'Detected type',
//                 dataIndex: 'run_type_str',
//                 key: 'run_type_str',
//                 render: type => type === null ? <Tag color="red">No type</Tag> : <Tag color="green">{type}</Tag>
//
//             }];
//
//         return (
//             <div>
//                 <Table columns={columns} dataSource={this.state.experiments} rowKey="id" loading={this.state.loading}
//                        bordered
//                     //expandedRowRender={record => {return <ExperimentDetail experiment={record}/>}}
//                        expandedRowRender={record => {
//                            return <ExperimentDraw experiment={record}/>
//                        }}
//                 />
//             </div>
//         )
//     }
// }


class CommonPropertiesForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataPreviewVisible: false,
            dataFilePreview: null,
            previewType: "",
            species_names: [],
            reviewVisible: false,
            reviewExperiments: [],
            dataInfo: null,
            alertSuccess: false,
            alertFailed: false,
            osPreviewVisible: false,
            osPreviewData: "",
            hovered1: false,
            hovered2: false,
        }
    }

    handleHoverChange1 = visible => {
        this.setState({
            hovered1: visible,
            clicked: false,
        });
    };

    handleHoverChange2 = visible => {
        this.setState({
            hovered2: visible,
            clicked: false,
        });
    };


    remove_prop = (k) => {
        const {form} = this.props;
        const keys = form.getFieldValue('props_keys');

        form.setFieldsValue({
            props_keys: keys.filter(key => key !== k),
        });
    };

    add_prop = () => {
        const {form} = this.props;
        const keys = form.getFieldValue('props_keys');
        const nextKeys = keys.concat(props_uuid);
        props_uuid++;
        form.setFieldsValue({
            props_keys: nextKeys,
        });
    };


    remove_specie = (k) => {
        const {form} = this.props;
        const keys = form.getFieldValue('species_keys');

        form.setFieldsValue({
            species_keys: keys.filter(key => key !== k),
        });
    };

    add_specie = () => {
        const {form} = this.props;
        const keys = form.getFieldValue('species_keys');
        const nextKeys = keys.concat(species_uuid);
        species_uuid++;
        form.setFieldsValue({
            species_keys: nextKeys,
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();

    };

    normFile = (e) => {
        console.log('Upload event:', e);

        let fileList = e.fileList;

        // 1. Limit the number of uploaded files
        // Only to show two recent uploaded files, and old ones will be replaced by the new
        fileList = fileList.slice(-1);

        // 2. Read from response and show file link
        fileList = fileList.map((file) => {
            if (file.response) {
                // Component will show file.url as link
                file.url = file.response.url;
            }
            return file;
        });

        // 3. Filter successfully uploaded files according to response from server
        // fileList = fileList.filter((file) => {
        //     if (file.response) {
        //         return file.response.status === 'success';
        //     }
        //     return false;
        // });

        return fileList
    };

    handleDataPreview = (file) => {
        console.log(file)
        this.setState({dataPreviewVisible: true, dataFilePreview: file, previewType: "data"})
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };

    handleOSDataPreview = (file) => {
        this.setState({dataPreviewVisible: true, dataFilePreview: file, previewType: "os"})
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    };

    onFileDataChange = (info) => {

        if (info.file.status === 'done') {
            message.success(`${info.file.name} data file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} data file upload failed: ${info.file.response}`);
        }
    };


    handleExperimentsOk = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);

                axios.post(window.$API_address + 'frontend/input/submit', {
                    params: {"values": values}
                })
                    .then(res => {

                        // const response = res.data;
                        // const a = response['experiment'];
                        // this.setState({reviewVisible: true, reviewExperiments: [a]})
                        message.success('Experiment added successfully', 3);
                    }).catch(error => {
                    // message.error(error.message + " - " + error.response.message, 3)
                    message.error(error.response.data, 3)

                    // console.log("Start")
                    // console.log(error.response.data);
                    // console.log(error.response.status);
                    // console.log(error.response.headers);
                    // console.log(error.message);
                    // console.log("Finish")
                })
            }
            else{
                message.error("Missing mandatory fields", 3)
            }
        });
    };


    handleCancel = () => this.setState({dataPreviewVisible: false});

    handleReviewCancel = () => {
        this.setState({reviewVisible: false});
        this.props.form.validateFields((err, values) => {
            console.log(values);});
    };

    showModal = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({reviewVisible: true, dataInfo: {values}});
            }
        });
    };



    handlePropertyChanged = (value) => {
        // console.log(file)
        // this.setState({dataPreviewVisible: true, dataFilePreview: file, previewType: "data"})
        //this.setState({
        //     //  previewImage: file.url || file.thumbUrl,
        //     //  previewVisible: true,
        //     //});
    };

    render() {
        const {getFieldDecorator, getFieldValue} = this.props.form;

        getFieldDecorator('props_keys', {initialValue: []});
        getFieldDecorator('species_keys', {initialValue: []});

        //getFieldDecorator('fileList', {initialValue: []});


        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                sm: {span: 20, offset: 0},
            },
        };

        // const formItemLayout = {
        //     labelCol: {span: 2},
        //     wrapperCol: {span: 18},
        // };

        const props_keys = getFieldValue('props_keys');

        const props_units_mapping = {
            'temperature': ['K'],
            'pressure': ['Pa', 'atm', 'bar', 'Torr', 'mbar'],
            'residence time': ['s', 'ms', 'us'],
            'volume': ['cm3'],
            'laminar burning velocity': ['cm/s']
        };

        const property_names = Object.keys(props_units_mapping);

        const propertiesType = props_keys.map((k, index) => {
            const species_options = property_names.map((property_name) => <Option key={property_name}
                                                                                  value={property_name}>{property_name}</Option>);

            return getFieldDecorator(`property[${k}]['name']`, {
                rules: [{
                    required: true,
                    message: "Please insert property name or delete this field.",
                }],
            })(
                <Select
                    placeholder="Select Property"
                    style={{width: 200}}>
                    {species_options}

                </Select>
            );
        });


        const propertiesUnits = props_keys.map((k, index) => {
            const propertyName = getFieldValue('property')[k]['name'];
            let units = [];
            if (propertyName != null) {
                units = props_units_mapping[propertyName]
            }
            const opts = units.map((k) => {
                return (<Option value={k} key={k}>{k}</Option>)
            });

            return getFieldDecorator(`property[${k}]['units']`, {
                initialValue: units.length > 0 ? units[0] : null,
                rules: [{
                    required: true,
                    message: "Please insert property units or delete this field.",
                }],
            })(
                <Select
                    placeholder="Select Unit"
                    style={{width: 120}}
                >
                    {opts}
                </Select>);

        });

        const propsFormItems = props_keys.map((k, index) => {
            return (
                <FormItem
                    {...formItemLayoutWithOutLabel}
                    //label={index === 0 ? 'Passengers' : ''}
                    //required={true}
                    key={k}
                >
                    {getFieldDecorator(`property[${k}]['value']`, {
                        validateTrigger: ['onChange', 'onBlur'],
                        rules: [{
                            required: true,
                            message: "Please insert property value or delete this field.",
                        }],
                    })(
                        //<CommonPropertyInput style={{width: '60%', marginRight: 8}}/>
                        //<Input placeholder="passenger name" style={{ width: '60%', marginRight: 8 }} />

                        <Input addonBefore={propertiesType[index]}
                               addonAfter={propertiesUnits[index]}
                               style={{width: '50%', textAlign: 'center'}}
                               placeholder="Insert Value"/>
                    )}
                    <Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"

                        onClick={() => this.remove_prop(k)}
                    />
                </FormItem>
            );
        });

        const species_keys = getFieldValue('species_keys');

        const species = this.state.species_names;
        const species_units = ["mole fraction"];
        const species_units_phi = ["fuel moles", "oxidizer moles"];

        const speciesType = species_keys.map((k, index) => {
            const species_options = species.map((specie) => <Option key={specie} value={specie}>{specie}</Option>);
            return getFieldDecorator(`species[${k}]['name']`, {
                rules: [{
                    required: true,
                    message: "Please insert specie's name or delete this field.",
                }],
            })(
                <Select style={{width: 150}}
                        showSearch
                        placeholder={"Select a species"}
                        optionFilterProp="children"
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                    {species_options}
                </Select>
            );
        });

        const enable_phi = getFieldValue("enable_phi");

        const speciesUnits = species_keys.map((k, index) => {
            //const speciesName = getFieldValue('species')[k]['name'];
            //let units = [];
            //if (speciesName != null) {
            //    units = species_units_mapping[speciesName]
            //}
            const su = enable_phi ? species_units_phi : species_units
            const opts = su.map((k) => {
                return (<Option value={k} key={k}>{k}</Option>)
            });

            return getFieldDecorator(`species[${k}]['units']`, {
                initialValue: su[0],
                rules: [{
                    required: true,
                    message: "Please insert specie's name or delete this field.",
                }],
            })(
                <Select style={{width: 150}}>
                    {opts}
                </Select>);

        });

        const speciesFormItems = species_keys.map((k, index) => {
            return (
                <FormItem
                    {...formItemLayoutWithOutLabel}
                    //label={index === 0 ? 'Passengers' : ''}
                    required={true}
                    key={k}
                >
                    {getFieldDecorator(`species[${k}]['amount']`, {
                        validateTrigger: ['onChange', 'onBlur'],
                        rules: [{
                            required: true,
                            message: "Please input specie's value or delete this field.",
                        }],
                    })(
                        //<CommonPropertyInput style={{width: '60%', marginRight: 8}}/>
                        //<Input placeholder="passenger name" style={{ width: '60%', marginRight: 8 }} />

                        <Input
                            addonBefore={speciesType[index]}
                            addonAfter={speciesUnits[index]}
                            style={{width: '50%', textAlign: "center"}}
                            placeholder={"Insert Value"}
                        />
                    )}
                    <Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"

                        onClick={() => this.remove_specie(k)}
                    />
                </FormItem>
            );
        });

        // TODO: limit upload size

        const hoverContent =
            <div>
                <p> Each column is composed by an header and the scalar values:<br />
                    The header defines the property name and the unit of measurement, the scalar values the measured quantity.<br />
                    Under each column header the corresponding scalar values of the property.</p>
                <p><b>Column header:</b> property_name [unit]</p>
                <p><b>Property names:</b>
                    <ul>
                        <li><i>temperature </i>[K]</li>
                        <li><i>pressure </i>[Pa | kPa | MPa | Torr | torr | bar | mbar | atm]</li>
                        <li><i>volume </i>[m3 | dm3 | cm3 | mm3 | L]</li>
                        <li><i>time </i>[s | ms | us | ns | min]</li>
                        <li><i>residence time </i>[s | ms | us | ns | min]</li>
                        <li><i>distance </i>[m | dm | cm | mm]</li>
                        <li><i>ignition delay </i>[s | ms | us | ns | min]</li>
                        <li><i>rate coefficient </i>[s-1 | m3 mol-1 s-1 | dm3 mol-1 s-1 | cm3 mol-1 s-1 | m3 molecule-1 s-1 | dm3 molecule-1 s-1 | cm3 molecule-1 s-1 | m6 mol-3 s-1 | dm6 mol-2 s-1 | cm6 mol-2 s-1 | m6 molecule-2 s-1 | dm6 molecule-2 s-1 | cm6 molecule-2 s-1]</li>
                        <li><i>equivalence ratio </i></li>
                        <li><i>length </i>[m | dm | cm | mm]</li>
                        <li><i>density </i>[g m-3 | g dm-3 | g cm-3 | g mm-3 | kg m-3 | kg dm-3 | kg cm-3 | kg mm-3]</li>
                        <li><i>flow rate </i>[g m-2x s-1 | g dm-2 s-1 | g cm-2 s-1 | g mm-2 s-1 | kg m-2 s-1 | kg dm-2 s-1 | kg cm-2 s-1 | kg mm-2 s-1]</li>
                        <li><i>laminar burning velocity </i>[m/s | dm/s | cm/s | mm/s | m s-1 | dm s-1 | cm s-1 | mm s-1]</li>
                        <li><i>initial composition </i></li>
                        <li><i>composition </i>[mole fraction | percent | ppm | ppb]</li>
                        <li><i>concentration </i>[mol/m3 | mol/dm3 | mol/cm3 | mol m-3 | mol dm-3 | mol cm-3 | molecule/m3 | molecule/dm3 | molecule/cm3 | molecule m-3 | molecule dm-3 | molecule cm-3]</li>
                        <li><i>uncertainty </i></li>
                    </ul>
                </p>
            </div>;


        const dataUpload = <FormItem
            {...formItemLayoutWithOutLabel}
        >
            {getFieldDecorator('file_upload', {
                valuePropName: 'fileList',
                getValueFromEvent: this.normFile,
                rules: [{required: true, message: 'Please upload experiment data'},
                    //{
                    //validator: (rule, value, cb) => {cb()},
                    //message: 'Please upload a valid experiment data'
                    //}
                ]
            })(
                <Upload multiple={false} name="data_excel" action={window.$API_address + 'frontend/input/data_excel'}
                        accept={".xlsx"}
                        onPreview={this.handleDataPreview}
                        headers={{"X-CSRFToken": csrftoken}}
                        onChange={this.onFileDataChange}>
                    <Popover
                        style={{ width: 1000 }}
                        content={hoverContent}
                        title="Content Format. Excel file .xlsx with N columns."
                        trigger="hover"
                        visible={this.state.hovered1}
                        onVisibleChange={this.handleHoverChange1}
                    >
                        <Button>
                            <Icon type="upload"/> Click to upload
                        </Button>
                    </Popover>
                </Upload>
            )}
        </FormItem>

        const dataUploadOptional = <FormItem
            {...formItemLayoutWithOutLabel}
        >
            {getFieldDecorator('file_upload_volume_time', {
                valuePropName: 'fileList',
                getValueFromEvent: this.normFile,
                rules: [{required: false, message: 'Please upload volume-time profile data'}]
            })(
                <Upload multiple={false} name="data_excel" action={window.$API_address + 'frontend/input/data_excel'}
                        accept={".xlsx"}
                        onPreview={this.handleDataPreview}
                        headers={{"X-CSRFToken": csrftoken}}
                        onChange={this.onFileDataChange}>
                    <Popover
                        style={{ width: 1000 }}
                        content={hoverContent}
                        title="Content Format. Excel file with N columns."
                        trigger="hover"
                        visible={this.state.hovered2}
                        onVisibleChange={this.handleHoverChange2}
                    >
                        <Button>
                            <Icon type="upload"/> Click to upload
                        </Button>
                    </Popover>
                </Upload>
            )}
        </FormItem>

        const OSUpload = <FormItem
            {...formItemLayoutWithOutLabel}
        >
            {getFieldDecorator('file_upload_os', {
                valuePropName: 'fileList',
                getValueFromEvent: this.normFile,
                rules: [{required: false, message: 'Please upload OpenSMOKE input file'}]
            })(
                <Upload multiple={false} name="input_dic" action={window.$API_address + 'frontend/input/os_input_file'}
                        accept={".dic"}
                        onPreview={this.handleOSDataPreview}
                        headers={{"X-CSRFToken": csrftoken}}
                        onChange={this.onFileDataChange}>
                    <Button>
                        <Icon type="upload"/> Click to upload
                    </Button>
                </Upload>
            )}
        </FormItem>


        const reactorSelect = <FormItem label={"Reactor"}>
            {getFieldDecorator('reactor', {
                rules: [{required: true, message: 'Please insert a reactor.'}],
            })(
                <Select
                    placeholder="Select a reactor"
                    allowClear={true}
                    style={{width: "25%"}}
                >
                    <Option value="shock tube">Shock tube</Option>
                    <Option value="stirred reactor">Perfectly Stirred Reactor</Option>
                    <Option value="flow reactor">Plug Flow Reactor</Option>
                    <Option value="flame">Flame</Option>
                    <Option value="rapid compression machine">Rapid Compression Machine</Option>
                </Select>
            )}
        </FormItem>


        const experimentTypeSelect = <FormItem label={"Experiment Type"}>
            {getFieldDecorator('experiment_type', {
                rules: [{required: true, message: 'Please insert experiment type.'}],
            })(
                <Select
                    placeholder="Select an experiment type"
                    allowClear={true}
                    style={{width: "25%"}}
                >
                    <Option value="ignition delay measurement">Ignition delay measurement</Option>
                    <Option value="laminar burning velocity measurement">Laminar burning velocity measurement</Option>
                    <Option value="outlet concentration measurement">Outlet concentration measurement</Option>
                    <Option value="concentration time profile measurement">Concentration time profile
                        measurement</Option>
                    <Option value="jet stirred reactor measurement">Jet stirred reactor measurement</Option>
                    <Option value="burner stabilized flame speciation measurement">Burner stabilized flame speciation
                        measurement</Option>
                    <Option value="direct rate coefficient measurement">Direct rate coefficient measurement</Option>
                </Select>
            )}
        </FormItem>

        const ignition_definition_type = <FormItem label={"Ignition definition type"}>
            {getFieldDecorator('ignition_definition_type', {
                rules: [{required: false, message: 'Please insert experiment type.'}],
            })(
                <Select
                    placeholder="Select an ignition definition type"
                    allowClear={true}
                    style={{width: "25%"}}
                >
                    <Option value="d/dt max">d/dt max</Option>
                    <Option value="max">max</Option>
                    <Option value="baseline max intercept from d/dt">baseline max intercept from d/dt</Option>
                    <Option value="baseline min intercept from d/dt">baseline min intercept from d/dt</Option>
                    <Option value="concentration">concentration</Option>
                    <Option value="relative concentration">relative concentration</Option>
                </Select>
            )}
        </FormItem>

        const ignition_definition_quantity = <FormItem label={"Ignition definition measured quantity"}>
            {getFieldDecorator('ignition_definition_quantity', {
                rules: [{required: false, message: 'Please insert experiment type.'}],
            })(
                <Select
                    placeholder="Select an ignition measured quantity"
                    allowClear={true}
                    style={{width: "25%"}}
                >
                    <Option value="CH">CH</Option>
                    <Option value="OH">OH</Option>
                    <Option value="CO2">C02</Option>
                </Select>
            )}
        </FormItem>

        const referenceInput = <FormItem label={"Paper reference (Title, Authors etc..)"}>
            {
                getFieldDecorator('paper_reference', {
                    rules: [{required: true, message: 'Please insert a paper reference.'}],
                })(
                    <Input.TextArea style={{width: "50%"}}/>
                )
            }
        </FormItem>

        const experimentReferenceInput = <FormItem label={"Experiment reference"}>
            {
                getFieldDecorator('exp_reference', {
                    rules: [{required: true, message: 'Please insert an experiment reference.'}],
                })(
                    <Input.TextArea style={{width: "50%"}}/>
                )
            }
        </FormItem>


        const fileDOIInput = <FormItem label={"Paper DOI"}>
            {
                getFieldDecorator('fileDOI', {
                    rules: [{required: true, message: 'Please insert a paper DOI.'}],
                })(
                    <Input style={{width: "50%"}}/>
                )
            }
        </FormItem>


        const commentsInput = <FormItem label={"Comments"}>
            {
                getFieldDecorator('comments', {
                    //rules: [{required: true, message: 'Please insert a reactor.'}],
                })(
                    <Input.TextArea style={{width: "50%"}}/>
                )
            }
        </FormItem>

        const layout_switch_phi = {
            labelCol: {span: 2},
            wrapperCol: {span: 12},
        }
        const switchPhi = <FormItem
            {...layout_switch_phi}
            label="Fuels/oxidizers"
        >
            {getFieldDecorator('enable_phi', {valuePropName: 'checked', initialValue: false})(
                <Switch/>
            )}
        </FormItem>


        const equivalence_ratio = <FormItem
            {...layout_switch_phi}
            label="Equiv. ratio">
            {getFieldDecorator('phi', {
                rules: [{
                    required: enable_phi,
                    message: "Please insert the equivalence ratio.",
                }],
            })(
                <InputNumber min={0} step={0.1} disabled={!enable_phi}/>
            )}
        </FormItem>


        // const guidePopover = <Popover content={"test"} title="Title">
        //     <Button type="primary">Hover me</Button>
        // </Popover>

        let preview = null;
        if (this.state.previewType === "data") {
            const data_file_preview_names = this.state.dataFilePreview == null ? null : this.state.dataFilePreview.response.names;
            const data_file_preview_data = this.state.dataFilePreview == null ? null : this.state.dataFilePreview.response.data;
            preview = <GenericTable names={data_file_preview_names} data={data_file_preview_data}/>;
        }
        else if (this.state.previewType === "os"){
            preview = <div dangerouslySetInnerHTML={{ __html: this.state.dataFilePreview.response.data }}
                           style={{whiteSpace: "pre-line"}}/>;
        }


        return (
            <div>
                {this.state.alertSuccess ? (
                    <Alert
                        message="Experiment added successfully"
                        showIcon
                        banner
                    />
                ) : null}
                <Form  layout={"horizontal"}>
                    <Collapse defaultActiveKey={['1', '2', '3', '4', '5', '6', '7', '8']}>
                        <Panel header="General" key="1">
                            {/*<ReactorSelect />*/}
                            {reactorSelect}
                            {experimentTypeSelect}
                            {ignition_definition_type}
                            {ignition_definition_quantity}
                        </Panel>
                        <Panel header="Common properties" key="2">
                            {propsFormItems}
                            <FormItem {...formItemLayoutWithOutLabel}>
                                <Button type="dashed" onClick={this.add_prop} style={{width: '50%'}}>
                                    <Icon type="plus"/> Add property
                                </Button>
                            </FormItem>
                        </Panel>
                        <Panel header="Input species" key="3">
                            {switchPhi}
                            {equivalence_ratio}
                            {speciesFormItems}
                            <FormItem {...formItemLayoutWithOutLabel}>
                                <Button type="dashed" onClick={this.add_specie} style={{width: '50%'}}>
                                    <Icon type="plus"/> Add species
                                </Button>
                            </FormItem>
                        </Panel>
                        <Panel header="Varied experimental conditions and measured results" key="4">
                            {dataUpload}
                        </Panel>

                        <Panel header="Volume-time Profile" key="5">
                            {dataUploadOptional}
                        </Panel>

                        <Panel header="OpenSmoke Input File" key="6">
                            {OSUpload}
                        </Panel>

                        <Panel header="Bibliography data" key="7">
                            {referenceInput}
                            {experimentReferenceInput}
                            {fileDOIInput}
                        </Panel>

                        <Panel header="Additional" key="8">
                            {commentsInput}
                        </Panel>
                    </Collapse>
                    <FormItem {...formItemLayoutWithOutLabel}>
                        <Button type="primary" htmlType="submit" onClick={this.handleExperimentsOk}>Submit</Button>
                    </FormItem>
                </Form>
                <Modal visible={this.state.dataPreviewVisible} footer={null} width={800} onCancel={this.handleCancel}>
                    {preview}
                </Modal>


                {/*<Modal visible={this.state.reviewVisible} width={1000} onCancel={this.handleReviewCancel}*/}
                {/*       footer={[*/}
                {/*           <Button key="back" onClick={this.handleReviewCancel}>Cancel</Button>,*/}
                {/*           <Button key="submit" type="primary" onClick={this.handleExperimentsOk}>Submit</Button>*/}
                {/*       ]}>*/}
                {/*    <FinalReview data={this.state.dataInfo}/>*/}
                {/*    /!*<ReviewTable exp_ids={this.state.reviewExperiments} key={this.state.reviewExperiments.toString()}/>*!/*/}
                {/*</Modal>*/}
            </div>

        );
    }

    componentDidMount() {

        axios.get(window.$API_address + 'frontend/api/opensmoke/species_names', {
            params: {}
        })
            .then(res => {
                const response = res.data;
                this.setState({species_names: response['names']});
            })
    }

}


// class DataForm extends React.Component {
//
//     constructor(props) {
//         super(props);
//         this.state = {
//             dataPreviewVisible: false,
//             dataFilePreview: null,
//             previewType: "",
//             species_names: [],
//             reviewVisible: false,
//             reviewExperiments: []
//         }
//     }
//
//
//     handleSubmit = (e) => {
//         e.preventDefault();
//         this.props.form.validateFields((err, values) => {
//             if (!err) {
//                 console.log('Received values of form: ', values);
//
//                 axios.post(window.$API_address + 'frontendfrontend/input/submit', {
//                     params: {"values": values}
//                 })
//                     .then(res => {
//
//                         const response = res.data;
//                         const a = response['experiment'];
//                         this.setState({reviewVisible: true, reviewExperiments: [a]})
//                     })
//             }
//         });
//     };
//     onFileDataChange = (info) => {
//
//         if (info.file.status === 'done') {
//             message.success(`${info.file.name} data file uploaded successfully`);
//         } else if (info.file.status === 'error') {
//             message.error(`${info.file.name} data file upload failed.`);
//         }
//     };
//
//     onInputDataChange = (info) => {
//
//         if (info.file.status === 'done') {
//             message.success(`${info.file.name} input file uploaded successfully`);
//         } else if (info.file.status === 'error') {
//             console.log(info)
//             message.error(`${info.file.name} input file upload failed: ${info.file.response}`);
//         }
//     };
//
//
//     normFile = (e) => {
//         console.log('Upload event:', e);
//
//         let fileList = e.fileList;
//
//         // 1. Limit the number of uploaded files
//         // Only to show two recent uploaded files, and old ones will be replaced by the new
//         fileList = fileList.slice(-1);
//
//         // 2. Read from response and show file link
//         fileList = fileList.map((file) => {
//             if (file.response) {
//                 // Component will show file.url as link
//                 file.url = file.response.url;
//             }
//             return file;
//         });
//
//         // 3. Filter successfully uploaded files according to response from server
//         // fileList = fileList.filter((file) => {
//         //     if (file.response) {
//         //         return file.response.status === 'success';
//         //     }
//         //     return false;
//         // });
//
//         return fileList
//     };
//
//     handleDataPreview = (file) => {
//         console.log(file)
//         this.setState({dataPreviewVisible: true, dataFilePreview: file, previewType: "data"})
//         //this.setState({
//         //     //  previewImage: file.url || file.thumbUrl,
//         //     //  previewVisible: true,
//         //     //});
//     };
//
//     handleInputPreview = (file) => {
//         console.log(file)
//         this.setState({dataPreviewVisible: true, dataFilePreview: file, previewType: "input"})
//         //this.setState({
//         //     //  previewImage: file.url || file.thumbUrl,
//         //     //  previewVisible: true,
//         //     //});
//     };
//
//     handleExperimentsCancel = () => {
//
//     };
//
//     handleExperimentsOk = () => {
//         this.setState({reviewVisible: false, reviewExperiments: []})
//
//     };
//
//
//     handleCancel = () => this.setState({dataPreviewVisible: false});
//
//     handleReviewCancel = () => this.setState({reviewVisible: false});
//
//     handleFileDataChange = (info) => {
//
//     };
//
//
//     render() {
//         const {getFieldDecorator, getFieldValue} = this.props.form;
//
//         const formItemLayoutWithOutLabel = {
//             wrapperCol: {
//                 sm: {span: 20, offset: 0},
//             },
//         };
//
//         const formItemLayout = {
//             labelCol: {span: 2},
//             wrapperCol: {span: 18},
//         };
//
//
//         // TODO: limit upload size
//
//         const dataUpload = <FormItem
//             {...formItemLayoutWithOutLabel}
//             extra={<a>Format guide</a>}
//         >
//             {getFieldDecorator('file_upload', {
//                 valuePropName: 'fileList',
//                 getValueFromEvent: this.normFile,
//                 rules: [{required: true, message: 'Please upload experiment data'}]
//             })(
//                 <Upload multiple={false} name="data_excel" action={window.$API_address + 'frontendfrontend/input/data_excel'} accept={".xlsx"}
//                         onPreview={this.handleDataPreview}
//                         headers={{"X-CSRFToken": csrftoken}}
//                         onChange={this.onFileDataChange}>
//                     <Button>
//                         <Icon type="upload"/> Click to upload
//                     </Button>
//                 </Upload>
//             )}
//         </FormItem>
//
//         const dataUploadOptional = <FormItem
//             {...formItemLayoutWithOutLabel}
//             extra={<a>Format guide</a>}
//         >
//             {getFieldDecorator('file_upload_volume_time', {
//                 valuePropName: 'fileList',
//                 getValueFromEvent: this.normFile,
//                 rules: [{required: false, message: 'Please upload volume-time profile data'}]
//             })(
//                 <Upload multiple={false} name="data_excel" action={window.$API_address + 'frontendfrontend/input/data_excel'} accept={".xlsx"}
//                         onPreview={this.handleDataPreview}
//                         headers={{"X-CSRFToken": csrftoken}}
//                         onChange={this.onFileDataChange}>
//                     <Button>
//                         <Icon type="upload"/> Click to upload
//                     </Button>
//                 </Upload>
//             )}
//         </FormItem>
//
//
//         const inputFileUpload = <FormItem
//             {...formItemLayoutWithOutLabel}
//             extra={<a>Format guide</a>}
//         >
//             {getFieldDecorator('input_upload', {
//                 valuePropName: 'fileList',
//                 getValueFromEvent: this.normFile,
//                 rules: [{required: true, message: 'Please upload an input file'}]
//             })(
//                 <Upload multiple={false} name="input_dic" action={window.$API_address + 'frontendfrontend/input/input_file'} accept={".dic"}
//                         onPreview={this.handleInputPreview}
//                         headers={{"X-CSRFToken": csrftoken}}
//                         onChange={this.onInputDataChange}>
//                     <Button>
//                         <Icon type="upload"/> Click to upload
//                     </Button>
//                 </Upload>
//             )}
//         </FormItem>
//
//
//         const reactorSelect = <FormItem label={"Reactor"}>
//             {getFieldDecorator('reactor', {
//                 rules: [{required: true, message: 'Please insert a reactor.'}],
//             })(
//                 <Select
//                     placeholder="Select a reactor"
//                     allowClear={true}
//                     style={{width: "15%"}}
//                 >
//                     <Option value="shock tube">Shock tube</Option>
//                     <Option value="stirred reactor">Perfectly Stirred Reactor</Option>
//                     <Option value="flow reactor">Plug Flow Reactor</Option>
//                     <Option value="flame">Flame</Option>
//                 </Select>
//             )}
//         </FormItem>
//
//
//         const referenceInput = <FormItem label={"Paper reference"}>
//             {
//                 getFieldDecorator('reference', {
//                     rules: [{required: true, message: 'Please insert a paper reference.'}],
//                 })(
//                     <Input.TextArea style={{width: "50%"}}/>
//                 )
//             }
//         </FormItem>
//
//         const experimentReferenceInput = <FormItem label={"Experiment reference"}>
//             {
//                 getFieldDecorator('exp_reference', {
//                     rules: [{required: true, message: 'Please insert an experiment reference.'}],
//                 })(
//                     <Input.TextArea style={{width: "50%"}}/>
//                 )
//             }
//         </FormItem>
//
//
//         const fileDOIInput = <FormItem label={"Paper DOI"}>
//             {
//                 getFieldDecorator('fileDOI', {
//                     rules: [{required: true, message: 'Please insert a paper DOI.'}],
//                 })(
//                     <Input style={{width: "50%"}}/>
//                 )
//             }
//         </FormItem>
//
//
//         const commentsInput = <FormItem label={"Comments"}>
//             {
//                 getFieldDecorator('comments', {
//                     //rules: [{required: true, message: 'Please insert a reactor.'}],
//                 })(
//                     <Input.TextArea style={{width: "50%"}}/>
//                 )
//             }
//         </FormItem>
//
//
//         // const guidePopover = <Popover content={"test"} title="Title">
//         //     <Button type="primary">Hover me</Button>
//         // </Popover>
//
//
//         let preview = null;
//         if (this.state.previewType === "data") {
//             const data_file_preview_names = this.state.dataFilePreview == null ? null : this.state.dataFilePreview.response.names;
//             const data_file_preview_data = this.state.dataFilePreview == null ? null : this.state.dataFilePreview.response.data;
//             preview = <GenericTable names={data_file_preview_names} data={data_file_preview_data}/>;
//         } else if (this.state.previewType === "input") {
//             preview = <div>
//                 <pre>{this.state.dataFilePreview.response.data}</pre>
//             </div>
//         }
//
//
//         return (
//             <div>
//                 <Form onSubmit={this.handleSubmit} layout={"horizontal"}>
//                     <Collapse defaultActiveKey={['1', '2', '3', '4', '5', '6']}>
//                         <Panel header="General" key="1">
//                             {reactorSelect}
//                         </Panel>
//
//                         <Panel header="Varied experimental conditions and measured results" key="2">
//                             {dataUpload}
//                         </Panel>
//
//                         <Panel header="Volume-time profile" key="3">
//                             {dataUploadOptional}
//                         </Panel>
//
//                         <Panel header="Experimental setting (input file)" key="4">
//                             {inputFileUpload}
//
//                         </Panel>
//
//                         <Panel header="Bibliography data" key="5">
//                             {referenceInput}
//                             {experimentReferenceInput}
//                             {fileDOIInput}
//                         </Panel>
//
//                         <Panel header="Additional" key="6">
//                             {commentsInput}
//                         </Panel>
//                     </Collapse>
//                     {/*<FormItem {...formItemLayoutWithOutLabel}>*/}
//                     {/*    <Button type="primary" htmlType="submit">Submit</Button>*/}
//                     {/*</FormItem>*/}
//                 </Form>
//                 <Modal visible={this.state.dataPreviewVisible} footer={null} width={800} onCancel={this.handleCancel}>
//                     {preview}
//                 </Modal>
//                 <Modal visible={this.state.reviewVisible} width={1000} onCancel={this.handleReviewCancel}
//                        footer={[
//                            <Button key="back" onClick={this.handleExperimentsCancel}>Cancel</Button>,
//                            <Button key="submit" type="primary" onClick={this.handleExperimentsOk}>
//                                Submit
//                            </Button>,
//                        ]}>
//                     <ReviewTable exp_ids={this.state.reviewExperiments}/>
//                 </Modal>
//             </div>
//
//         );
//     }
//
//     componentDidMount() {
//
//     }
//
// }


const WrappedCommonPropertiesForm = Form.create()(CommonPropertiesForm);
// const WrappedDataForm = Form.create()(DataForm);

// export {WrappedCommonPropertiesForm, WrappedDataForm}
export {WrappedCommonPropertiesForm}