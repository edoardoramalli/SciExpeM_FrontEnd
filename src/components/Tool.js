import {message} from "antd";

export function extractData(dataString) {
    const a = dataString.trim().split("\n")
    let result = []
    if (a.length > 0) {
        for (let i in a) {
            result.push(parseFloat(a[i]))
        }
    }
    for (let i in result) {
        if (result[i] === false || Number.isNaN(result[i])) {
            result = []
        }
    }
    return result
}

export function zip(list_of_lists) {
    // let args = [].slice.call(arguments);
    let args = list_of_lists.slice()
    let longest = args.reduce(function(a,b){
        return a.length>b.length ? a : b
    }, []);

    return longest.map(function(_,i){
        return args.map(function(array){return array[i]})
    });
}

export function checkError(error){
    if (error.response.status === 403){
        message.error("You are not authenticated!", 3);
    }
    else if (error.response.status === 401){
        message.error("You don't have the authorization!", 3);
    }
    else if (error.response.status === 400){
        message.error("Bad Request. " + error.response.data, 3);
    }
    else{
        message.error(error.response.data, 3);
    }
}
