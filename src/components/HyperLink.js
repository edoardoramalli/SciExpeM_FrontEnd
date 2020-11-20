import React from "react";

class HyperLink extends React.Component{
    constructor(props) {
        super(props);
        this.state ={
            link: this.props.link
        }
    }
    goHyperLink(){
        const url = 'https://www.doi.org/' + String(this.state.link);
        window.open(url);
    }
    render() {
        return(
            <span
                style={{cursor:"pointer", color:"blue", textDecoration:"underline"}}
                onClick={this.goHyperLink.bind(this)}
            >{this.state.link} </span>
        )
    }
}

export default HyperLink;