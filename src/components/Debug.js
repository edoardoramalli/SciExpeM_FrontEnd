import React from "react";
import {Tabs} from "antd";

const axios = require('axios');
import Cookies from "js-cookie";
import PlotExperiment from "./ExperimentTable/InfoExperimentFolder/PlotExperiment";
import PlotExperimentNew from "./ExperimentTable/InfoExperimentFolder/PlotExperimentNew"

axios.defaults.headers.post['X-CSRFToken'] = Cookies.get('csrftoken');

class Debug extends React.Component {

    render() {
        return (
           <>
               <PlotExperimentNew exp_id={3153}/>
               <PlotExperiment exp_id={3153}/>

           </>
        )
    }

}

export default Debug;