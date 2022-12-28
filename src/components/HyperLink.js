import React from "react";

class HyperLink extends React.Component{
    constructor(props) {
        super(props);
    }
    goHyperLink(){
        const url = 'https://www.doi.org/' + String(this.props.link);
        window.open(url);
    }
    render() {
        return(
            <span
                style={{cursor:"pointer", color:"blue", textDecoration:"underline"}}
                onClick={this.goHyperLink.bind(this)}
            >{this.props.link} </span>
        )
    }
}

export default HyperLink;