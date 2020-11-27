import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import XMLViewer from 'react-xml-viewer'

const csrftoken = Cookies.get('csrftoken');
axios.defaults.headers.post['X-CSRFToken'] = csrftoken;

class ExperimentFile extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            exp_id: this.props.exp_id,
            type: this.props.type,
            file: "",
            render: null
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
                        this.setState({render: <XMLViewer xml={file} />})
                    }
                    else if (this.state.type === "OS"){
                        this.setState(
                            {render: <div
                                    dangerouslySetInnerHTML={{__html: file}}
                                    style={{whiteSpace: "pre-line"}}/>})
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

        return(<>{this.state.render}</>)

    }

}

export default ExperimentFile;