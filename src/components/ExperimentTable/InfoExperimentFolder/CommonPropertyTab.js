import React from "react";
import {Descriptions, message, Spin, Col, Empty} from 'antd';
import axios from "axios";

import "./styles.less"

class CommonPropertyTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            exp_id: this.props['exp_id'],
            property_list: null,
            api: this.props['api']
        }
    }

    renderProperties(){
        return (this.state.property_list.map((property) => {
            return(
                <>
                    <Descriptions.Item label={"Name"}>{property.name}</Descriptions.Item>
                    <Descriptions.Item label={"Value"}>{property.value}</Descriptions.Item>
                    <Descriptions.Item label={"Units"}>{property.units}</Descriptions.Item>
                    <Descriptions.Item label={"ID"}>{property.id}</Descriptions.Item>
                </>
                )

        }))
    }


    renderCommonProperties() {

        if (this.state.property_list === null){
            return(
                <>
                    <Col span={1} offset={11}>
                        <Spin size="large" tip="Loading..."/>
                    </Col>
                </>
            )

        }
        else if (this.state.property_list.length === 0){
            return (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )
        }
        else{
                return (
                    <Descriptions bordered column={4} className={"description"}>
                        {this.renderProperties()}
                    </Descriptions>
                );
            }
    }






    componentDidMount() {
        this.setState({loading: true});
        const params = {
            name: this.props['name'],
            fields: ['id', 'name', 'units', 'value'],
            experiment: this.state.exp_id.toString()
        }
        axios.post(window.$API_address + 'frontend/api/getPropertyList', params)
            .then(res => {
                this.setState(
                    {
                        property_list: JSON.parse(res.data)
                    }
                )
            })
            .catch(error => {
                if (error.response.status === 403){
                    message.error("You don't have the authorization!", 3);
                    this.setState({loading: false})
                }
                else if (error.response.status === 400){
                    message.error("Bad Request. " + error.response.data, 3);
                    this.setState({loading: false})
                }
                else{
                    message.error(error.response.data, 3);
                    this.setState({loading: false})
                }
            })
    }

    render() {
        return(
            <>
                {this.renderCommonProperties()}
            </>

            )

    }

}

export default CommonPropertyTab;