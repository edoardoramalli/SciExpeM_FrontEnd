import React from "react";
import axios from "axios";

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
                console.log(response)
                if (file === null){
                    file = "No file."
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
            <div>{this.state.file}</div>
        )
    }

}

export default ExperimentFile;