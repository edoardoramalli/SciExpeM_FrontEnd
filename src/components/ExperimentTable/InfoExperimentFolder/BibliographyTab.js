import React from "react";
import {Descriptions, Spin, Col, Empty} from 'antd';

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
                    <Descriptions.Item label="Description" span={2} key={'Description1'}>
                        {property.description}
                    </Descriptions.Item>
                    <Descriptions.Item label="Title" span={2} key={'Description2'}>
                        {property.title}
                    </Descriptions.Item>
                    <Descriptions.Item label="Author" span={2} key={'Description3'}>
                        {property.author}
                    </Descriptions.Item>
                    <Descriptions.Item label="Journal" key={'Description4'}>
                        {property.journal}
                    </Descriptions.Item>
                    <Descriptions.Item label="Year" key={'Description5'}>
                        {property.year}
                    </Descriptions.Item>
                    <Descriptions.Item label="Volume" key={'Description6'}>
                        {property.volume}
                    </Descriptions.Item>
                    <Descriptions.Item label="Page" key={'Description7'}>
                        {property.page}
                    </Descriptions.Item>
                    <Descriptions.Item label="Paper DOI" key={'Description8'}>
                        {<HyperLink link={property.reference_doi}/>}
                    </Descriptions.Item>
                    <Descriptions.Item label="ID" key={'Description9'}>
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
            fields: ['id', 'description', 'reference_doi', 'title', 'author', 'year', 'volume', 'page', 'journal'],
            query: {experiments__id: this.state.exp_id.toString()},
            model_name: 'FilePaper'
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