import React from "react";
import {Form, Input} from "antd";

class References extends React.Component{
    render() {
        return(
            <>
                <Form.Item
                    label="References"
                    name="references"
                    rules={[{required: true, message: 'Please insert references.'}]}
                >
                    <Input.TextArea placeholder={"Insert paper title, authors, publisher etc."} rows={5} style={{width: "35%"}}/>
                </Form.Item
                >
                <Form.Item
                    label="Paper DOI (Without 'https://doi.org/')"
                    name="reference_doi"
                    rules={[{required: true, message: 'Please insert paper DOI.'}]}
                >
                    <Input placeholder={"Insert paper DOI"} style={{width: "35%"}}/>
                </Form.Item>
                {/*<Form.Item*/}
                {/*    label="Experiment DOI (Without 'https://doi.org/')"*/}
                {/*    name="fileDOI"*/}
                {/*    rules={[{required: true, message: 'Please insert experiment DOI.'}]}>*/}
                {/*    <Input placeholder={"Insert experiment reference"} style={{width: "35%"}}/>*/}
                {/*</Form.Item>*/}
                <Form.Item
                    label="Comment"
                    name="comment"
                    rules={[{required: false, message: ''}]}>
                    <Input.TextArea
                        rows={5}
                        showCount
                        maxLength={280}
                        placeholder={"Insert an optional comment"}
                        style={{width: "35%"}}/>
                </Form.Item>
            </>
        )
    }
}

export default References;