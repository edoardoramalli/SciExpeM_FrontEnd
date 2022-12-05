import React from "react";
import {Descriptions, Spin, Col, Empty} from 'antd';

const axios = require('axios');
import Cookies from "js-cookie";
axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

import "./styles.less"
import {checkError} from "../../Tool"

class CommonPropertyTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            exp_id: this.props['exp_id'],
            property_list: null,
            api: this.props['api']
        }
    }

    renderProperties(property_list){
        return (property_list.map((property) => {
            return(
                <>
                    <Descriptions.Item label={"Name"}>{property.name}</Descriptions.Item>
                    <Descriptions.Item label={"Value"}>{property.value}</Descriptions.Item>
                    <Descriptions.Item label={"Units"}>{property.units}</Descriptions.Item>
                    <Descriptions.Item label={"Source Type"}>{property.source_type}</Descriptions.Item>
                    <Descriptions.Item label={"ID"}>{property.id}</Descriptions.Item>
                </>
                )

        }))
    }


    renderCommonProperties(property_list) {

        if (property_list === null){
            return(

                <Col span={1} offset={11}>
                    <Spin size="large" tip="Loading..."/>
                </Col>
            )

        }
        else if (property_list.length === 0){
            return (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )
        }
        else{
                return (
                    <Descriptions bordered column={5} className={"description"}>
                        {this.renderProperties(property_list)}
                    </Descriptions>
                );
            }
    }

    componentDidMount() {
        this.setState({loading: true});
        const params = {
            fields: ['id', 'name', 'units', 'value', 'source_type'],
            query: {experiment_id: this.state.exp_id},
            model_name: 'CommonProperty',
        }
        axios.post(window.$API_address + 'ExperimentManager/API/filterDataBase', params)
            .then(res => {
                this.setState(
                    {
                        property_list: res.data
                    }
                )
            })
            .catch(error => {
                checkError(error)
            })
    }

    render() {
        return(
            <>
                {this.renderCommonProperties(this.state.property_list)}
            </>

            )

    }

}

export default CommonPropertyTab;