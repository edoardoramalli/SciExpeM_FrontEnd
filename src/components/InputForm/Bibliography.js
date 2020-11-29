import React from "react";
import {Form, Input} from "antd";

class Bibliography extends React.Component{
    render() {
        return(
            <>
                <Form.Item
                    label="Bibliography"
                    name="bibliography"
                    rules={[{required: true, message: 'Please insert bibliography.'}]}
                >
                    <Input.TextArea placeholder={"Insert paper title, authors, publisher etc."} rows={4} style={{width: "35%"}}/>
                </Form.Item
                >
                <Form.Item
                    label="Paper DOI"
                    name="paper_doi"
                    rules={[{required: true, message: 'Please insert paper DOI.'}]}
                >
                    <Input placeholder={"Insert paper DOI"} style={{width: "35%"}}/>
                </Form.Item>
                <Form.Item
                    label="Experiment Reference"
                    name="experiment_reference"
                    rules={[{required: true, message: 'Please insert experiment reference.'}]}>
                    <Input placeholder={"Insert experiment reference"} style={{width: "35%"}}/>
                </Form.Item>
            </>
        )
    }
}

export default Bibliography;