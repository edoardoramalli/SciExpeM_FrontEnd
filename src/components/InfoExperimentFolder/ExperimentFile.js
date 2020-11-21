import React from "react";
import axios from "axios";
import prettifyXml from "prettify-xml";

class ExperimentFile extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            exp_id: this.props.exp_id,
            type: this.props.type,
            file: ""
        }
    }
    componentDidMount() {

        axios.post(window.$API_address + 'frontend/api/get_experiment_file/' + this.state.exp_id.toString(),
            {params: {"type": this.state.type}})
            .then(res => {
                const response = res.data;
                let file = response.file;
                if (file === null){
                    file = "No file."
                }
                else{
                    if (this.state.type === "ReSpecTh"){
                        const options = {indent: 2, newline: '\n'}
                        file = prettifyXml(file, options);
                    }

                }
                this.setState({
                    file: file
                });
            }).catch(error => {
            console.log(error.response);
        })
    }
    render() {

        return(
            <div dangerouslySetInnerHTML={{__html: this.state.file}} style={{whiteSpace: "pre-line"}}/>
            )

    }

}

export default ExperimentFile;