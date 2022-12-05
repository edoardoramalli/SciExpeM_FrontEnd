import React from "react";
import {Modal, Row, Select, Button, Space, message, Upload, Form, Radio, InputNumber, Cascader} from "antd";
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
// import {checkError} from "../../../Tool";

const { Dragger } = Upload;

const axios = require('axios');
import Cookies from "js-cookie";
import {checkError} from "../../Tool";
import AddColumnModal from "../../ExperimentForm/AddColumnModal"
axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

import Variables from "../../Variables";

const {property_list} = Variables

class UploadBackUp extends React.Component{

    formRef = React.createRef();

    constructor(props) {
        super(props);

        this.state = {
            models_options: null,
            chemModelsSelected: null,
            addBackUpLoading: false,
            file: null,
            property_list: null

        }
    }

    componentDidMount() {
        axios.post(window.$API_address + 'ExperimentManager/API/filterDataBase',
            {fields: ['id', 'name'],
                model_name: 'ChemModel',
                query: {}})
            .then(res => {
                this.setState({models_options: this.createCheModelOptions(res.data)})
            }).catch(error => {
            checkError(error)
        })
        this.setState({property_list: this.createOptions()})
    }

    createCheModelOptions(model_list) {
        return model_list.map(item => {
            return (<Select.Option key={item['id']} value={item['id']}>{item['name']}</Select.Option>)
        })
    }


    getBase64 = file => {
        return new Promise(resolve => {
            let fileInfo;
            let baseURL = "";
            // Make new FileReader
            let reader = new FileReader();

            // Convert the file to base64 text
            reader.readAsDataURL(file);

            // on reader load something...
            reader.onload = () => {
                // Make a fileInfo Object
                baseURL = reader.result;
                resolve(baseURL);
            };
        });
    };

    reset = () =>{
        this.props.closeAddBackUp()
        this.formRef.current.resetFields();
        this.props.refreshTable()
    }

    onFinish = (values) => {

        // if(!this.state.chemModelsSelected){
        //     message.error('Chem Model is not selected')
        //     return
        // }
        // if(this.state.file_name === null){
        //     message.error('No file uploaded')
        //     return
        // }

        const parameter_name = values.parameter[0] === "null" ? null : values.parameter[0]
        const parameter_unit = values.parameter[1] === "null" ? null : values.parameter[1]
        const parameter_value = values.parameter_value === undefined ? null : values.parameter_value

        if((parameter_value === null) && (parameter_name !== null)){
            message.error('Parameter value is empty!')
            return
        }


        let file = this.state.file

        this.getBase64(file)
            .then(result => {

                const params = {
                    'experiment_id': this.props.experiment.id,
                    'chemModel_id': values.chemModel_id,
                    'parameter_name': parameter_name,
                    'parameter_unit': parameter_unit,
                    'parameter_value': parameter_value,
                    'file_byte': result.split(',')[1],
                    'file_name': file.name,
                }

                axios.post(window.$API_address + 'ExperimentManager/API/uploadBackup', params)
                    .then(res => {
                        this.setState({addBackUpLoading: false})
                        this.reset()
                    })
                    .catch(error => {
                        this.setState({addBackUpLoading: false})
                        checkError(error)
                    })


            })
            .catch(err => {
                message.error(err);
            });


    };

    edo = (options) =>{
            const { onSuccess, onError, file, onProgress } = options;
            this.setState({file: file})
            onSuccess()
    }


    createOptions = () => {
        let prop_list = JSON.parse(JSON.stringify(property_list));
        prop_list['null'] =['null']
        let opt = []
        for (let key in prop_list) {
            let children = [];
            for (let item in prop_list[key]) {
                children.push({value: prop_list[key][item], label: prop_list[key][item]})
            }
            opt.push({value: key, label: key, children: children})
        }
        return (<Cascader
            options={opt}
            expandTrigger="hover"
            placeholder="Please select Property"
            // showSearch={this.filter}
        />)
    }

    render() {



        const formItemLayout = {
            labelCol: {
                span: 6,
            },
            wrapperCol: {
                span: 14,
            },
        };

        const normFile = (e) => {
            // console.log('Upload event:', e);
            if (Array.isArray(e)) {
                return e;
            }
            return e?.fileList;
        };






        return(
            <Modal
                title="Add BackUp"
                visible={this.props.addBackUpVisible}
                onCancel={this.props.closeAddBackUp}
                footer={null}
            >
                {/*<Space direction={'vertical'} size={'large'}>*/}
                {/*    <Row>*/}
                {/*        Select Chem Model:*/}
                {/*    </Row>*/}
                {/*    <Row>*/}
                {/*        <Select*/}
                {/*            showSearch*/}
                {/*            placeholder="Please select Chem Model"*/}
                {/*            style={{width: 400}}*/}
                {/*            filterOption={(input, option) =>*/}
                {/*                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0*/}
                {/*            }*/}
                {/*            onChange={this.changeModels.bind(this)}*/}
                {/*        >*/}
                {/*            {this.state.models_options}*/}
                {/*        </Select>*/}
                {/*    </Row>*/}
                {/*    <Space>*/}

                {/*    </Space>*/}
                {/*    <Row>*/}
                {/*        <Dragger {...props} style={{width: 400}} fileList={this.state.fileList}>*/}
                {/*            <p className="ant-upload-drag-icon">*/}
                {/*                <InboxOutlined />*/}
                {/*            </p>*/}
                {/*            <p className="ant-upload-text">Click or drag file to this area to load</p>*/}
                {/*            <p className="ant-upload-hint">*/}
                {/*                Support for a single upload.*/}
                {/*            </p>*/}
                {/*        </Dragger>*/}
                {/*    </Row>*/}

                {/*    <Row>*/}
                {/*        <Button*/}
                {/*            type="primary"*/}
                {/*            shape="round"*/}
                {/*            icon={<UploadOutlined />}*/}
                {/*            onClick={this.uploadBackUp}*/}
                {/*            loading={this.state.addBackUpLoading}*/}
                {/*            style={{width: 400}}*/}
                {/*        >*/}
                {/*            Upload BackUp*/}
                {/*        </Button>*/}
                {/*    </Row>*/}
                {/*</Space>*/}

                <Form
                    name="validate_other"
                    ref={this.formRef}
                    {...formItemLayout}
                    onFinish={this.onFinish}
                    // initialValues={{
                    //     'input-number': 3,
                    //     'checkbox-group': ['A', 'B'],
                    //     rate: 3.5,
                    // }}
                >
                    <Form.Item
                        label="ChemModel: "
                        name="chemModel_id"
                        rules={[{required: true, message: 'Please select ChemModel.'}]}>
                                <Select
                                    showSearch
                                    placeholder="Please select Chem Model"
                                    style={{width: 300}}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {this.state.models_options}
                                </Select>
                    </Form.Item>

                    <Form.Item
                        label="Parameter:  "
                        name="parameter"
                        rules={[{required: true, message: 'Please select parameter.'}]}
                    >
                        {this.state.property_list}
                    </Form.Item>



                    <Form.Item label="Value:  " name="parameter_value" >
                        <InputNumber  />
                    </Form.Item>



                    <Form.Item label="File">
                        <Form.Item
                            name="dragger"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                            rules={[{required: true, message: 'Please upload file.'}]}
                            noStyle>
                            <Upload.Dragger
                                customRequest={this.edo}
                                multiple={false}
                            >
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Click or drag file to this area</p>
                                <p className="ant-upload-hint">Support for a single upload.</p>
                            </Upload.Dragger>
                        </Form.Item>
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            span: 12,
                            offset: 6,
                        }}
                    >
                        <Button type="primary" htmlType="submit" icon={<UploadOutlined />}>
                            Upload BackUp
                        </Button>
                    </Form.Item>
                </Form>

            </Modal>
        )
    }
}

export default UploadBackUp;