import {message} from "antd";


export function HelloTester() {

}

export function checkError(error){
    if (error.response.status === 403){
        message.error("You don't have the authorization!", 3);
    }
    else if (error.response.status === 400){
        message.error("Bad Request. " + error.response.data, 3);
    }
    else{
        message.error(error.response.data, 3);
    }
}
