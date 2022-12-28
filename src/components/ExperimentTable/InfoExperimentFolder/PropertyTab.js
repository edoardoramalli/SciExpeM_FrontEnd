import React from "react";
import {Descriptions, Spin, Col, Empty} from 'antd';

const axios = require('axios');
import Cookies from "js-cookie";

axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

import {checkError} from "../../Tool"

class PropertyTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            exp_id: this.props['exp_id'],
            property_list: null,
            api: this.props['api'],
        }
    }

    renderProperties(property_list) {

        return (property_list.map((property_item) => {

            return Object.keys(this.props.items).map((i)=>{
                let text;
                if (i === 'specie') {
                    text = property_item.specie.preferredKey + ' (ID: ' + property_item.specie.id + ')'
                } else {
                    text = property_item[i]
                }
                return <Descriptions.Item label={this.props.items[i]}>{text}</Descriptions.Item>
            })

        }))
    }


    renderListProperties(property_list) {

        if (property_list === null) {
            return (
                <Col span={1} offset={11}>
                    <Spin size="large" tip="Loading..."/>
                </Col>
            )
        } else if (property_list.length === 0) {
            return (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
            )
        } else {
            return (
                <Descriptions bordered column={Object.keys(this.props.items).length} labelStyle={{fontWeight: 900}}>
                    {this.renderProperties(property_list)}
                </Descriptions>
            );
        }
    }

    componentDidMount() {
        this.setState({loading: true});
        const params = {
            fields: Object.keys(this.props.items),
            query: {experiment_id: this.state.exp_id},
            model_name: this.props.name,
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
        return (
            <>
                {this.renderListProperties(this.state.property_list)}
            </>

        )

    }

}

export default PropertyTab;