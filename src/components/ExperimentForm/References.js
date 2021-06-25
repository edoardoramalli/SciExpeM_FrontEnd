import React from "react";
import {Form, Input, Button} from "antd";
import {checkError} from "../Tool";

const axios = require('axios');
import Cookies from "js-cookie";

axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

class References extends React.Component {
    constructor() {
        super();
        this.state = {
            doi: '',
            loading: false,
        }
    }

    clickAutoComplete = () => {
        this.setState({loading: true})
        axios.get('https://opencitations.net/index/api/v1/metadata/' + this.state.doi)
            .then(res => {
                const metadata = res.data[0]
                let txt = ''
                if (metadata.author)
                    txt += metadata.author + ' - '
                if (metadata.source_title)
                    txt += metadata.source_title
                if (metadata.year)
                    txt += ', ' + metadata.year.toString()
                if (metadata.volume)
                    txt += ', (' + metadata.volume + ')'
                if (metadata.page)
                    txt += ', ' + metadata.page

                this.props.setField({
                    title: metadata.title,
                    year: metadata.year,
                    author: metadata.author,
                    volume: metadata.volume,
                    page: metadata.page,
                    journal: metadata.source_title,
                    description: txt
                })
                this.setState({loading: false})

            })
            .catch(error => {
                this.setState({loading: false})
                checkError(error)
            })

    }

    render() {
        return (
            <>

                <Form.Item
                    label="Paper DOI (Without 'https://doi.org/')"
                    name="reference_doi"
                    rules={[{required: true, message: 'Please insert paper DOI.'}]}
                >
                    <Input
                        placeholder={"Insert paper DOI"}
                        style={{width: "35%"}}
                        onChange={(e) => {
                            this.props.setField({reference_doi: e.target.value})
                            this.setState({doi: e.target.value})
                        }}
                    />
                    <Button onClick={this.clickAutoComplete} loading={this.state.loading}>Autocomplete</Button>
                </Form.Item>


                <Form.Item
                    label="Author(s)"
                    name="author"
                    rules={[{required: false, message: 'Please insert author(s).'}]}
                >
                    <Input.TextArea
                        placeholder={"Please insert author(s). Last name, first name. Use semi column to separated authors. E.g. Rossi, Mario; Lebron, James"}
                        rows={5}
                        style={{width: "35%"}}
                    />
                </Form.Item>
                <Form.Item
                    label="Title"
                    name="title"
                    rules={[{required: false, message: 'Please insert title.'}]}
                >
                    <Input.TextArea
                        placeholder={"Please insert title."} rows={5} style={{width: "35%"}}
                    />
                </Form.Item>
                <Form.Item
                    label="Journal"
                    name="journal"
                    rules={[{required: false, message: 'Please insert journal.'}]}
                >
                    <Input
                        placeholder={"Please insert journal name."}
                        style={{width: "35%"}}
                    />
                </Form.Item>
                <Form.Item
                    label="Volume"
                    name="volume"
                    rules={[{required: false, message: 'Please insert volume.'}]}
                >
                    <Input
                        placeholder={"Please insert volume."}
                        style={{width: "35%"}}
                    />
                </Form.Item>

                <Form.Item
                    label="Page"
                    name="page"
                    rules={[{required: false, message: 'Please insert page.'}]}
                >
                    <Input
                        placeholder={"Please insert page. Use dash for page interval. E.g. 10-15"}
                        style={{width: "35%"}}
                    />
                </Form.Item>

                <Form.Item
                    label="Year"
                    name="year"
                    rules={[{required: false, message: 'Please insert year.'}]}
                >
                    <Input
                        placeholder={"Please insert year."}
                        style={{width: "35%"}}
                    />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{required: true, message: 'Please insert description.'}]}
                >
                    <Input.TextArea
                        placeholder={"Please insert description. Author(s), Journal, year, (volume), page."} rows={5}
                        style={{width: "35%"}}

                    />
                </Form.Item>


                <Form.Item
                    label="Comment"
                    name="comment"
                    rules={[{required: false, message: ''}]}>
                    <Input.TextArea
                        rows={5}
                        showCount
                        maxLength={280}
                        placeholder={"Insert an optional comment about this upload"}
                        style={{width: "35%"}}/>
                </Form.Item>
            </>
        )
    }
}

export default References;