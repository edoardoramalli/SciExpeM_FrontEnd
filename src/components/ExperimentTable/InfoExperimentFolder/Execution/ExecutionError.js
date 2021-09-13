import React from "react";
import {checkError} from "../../../Tool";
import {Alert, Col, Spin, Empty} from "antd";

const axios = require('axios');
import Cookies from "js-cookie";
axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

class ExecutionError extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            renderObject: <Col span={1} offset={11}><Spin size="large" tip="Loading..."/></Col>,
        }
    }

    componentDidMount() {
        const params = {
            model_name: 'Execution',
            element_id: this.props.id,
            property_name: 'execution_error',
        }
        axios.post(window.$API_address + 'ExperimentManager/API/requestProperty', params)
            .then(res => {
                console.log(res.data)

                let object;

                if (res.data !== '') {
                    object = <Alert
                        message={res.data}
                        type="error"
                        showIcon
                    />
                } else {
                    object = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
                }

                this.setState({renderObject: object})


            })
            .catch(error => {
                checkError(error)
            })
    }

    render() {
        return (<>{this.state.renderObject}</>)

    }

}

export default ExecutionError;