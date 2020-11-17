import React from "react";
import axios from "axios";

function formatLightState(){
    axios.get(window.$API_address + 'frontend/api/get_username', {
        params: {}
    })
        .then(res => {
            const response = res.data;
            console.log(response['username']);
            return response['username'] ;
        })

}


export default formatLightState;