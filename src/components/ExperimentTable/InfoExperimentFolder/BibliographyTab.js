import React from "react";
import {Descriptions, message, Spin, Col, Empty} from 'antd';

const axios = require('axios');
import Cookies from "js-cookie";
axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

import "./styles.less"
import HyperLink from "../../HyperLink";
import {checkError} from "../../Tool"

class BibliographyTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            exp_id: this.props['exp_id'],
            property_list: null
        }
    }

    renderProperties(){
        return (this.state.property_list.map((property) => {
            return(
                <>
                    <Descriptions.Item label="Reference" span={2}>
                        {property.references}
                    </Descriptions.Item>
                    <Descriptions.Item label="Paper DOI" >
                        {<HyperLink link={property.reference_doi}/>}
                    </Descriptions.Item>
                    <Descriptions.Item label="ID" >
                        {property.id}
                    </Descriptions.Item>
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
                <Descriptions bordered column={2} className={"description"}>
                    {this.renderProperties()}
                </Descriptions>
            );
        }
    }


    componentDidMount() {
        this.setState({loading: true});
        const params = {
            fields: ['id', 'references', 'reference_doi'],
            exp_id: this.state.exp_id.toString()
        }
        axios.post(window.$API_address + 'frontend/API/getFilePaper', params)
            .then(res => {
                this.setState(
                    {
                        property_list: JSON.parse(res.data)
                    }
                )
            })
            .catch(error => {
                this.setState({loading: false})
                checkError(error)
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

export default BibliographyTab;