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
    let longest = args.reduce(function (a, b) {
        return a.length > b.length ? a : b
    }, []);

    return longest.map(function (_, i) {
        return args.map(function (array) {
            return array[i]
        })
    });
}

export function mean(arr=[]){
    if(!arr.length){
        return 0;
    }
    return arr.reduce((a,b) => a + b, 0) / arr.length;
}

export function median(values=[]){
    if(!values.length){
        return 0;
    }
    values.sort(function(a,b){
        return a-b;
    });

    var half = Math.floor(values.length / 2);

    if (values.length % 2)
        return values[half];

    return (values[half - 1] + values[half]) / 2.0;
}

export function findVariance (arr = []){
    if(!arr.length){
        return 0;
    }
    const sum = arr.reduce((acc, val) => acc + val);
    const { length: num } = arr;
    const median = sum / num;
    let variance = 0;
    arr.forEach(num => {
        variance += ((num - median) * (num - median));
    });
    variance /= num;
    return variance;
};

export function stdev(arr=[]){
    // Creating the mean with Array.reduce
    if(!arr.length){
        return 0;
    }
    let mean = arr.reduce((acc, curr)=>{
        return acc + curr
    }, 0) / arr.length;

    // Assigning (value - mean) ^ 2 to every array item
    arr = arr.map((k)=>{
        return (k - mean) ** 2
    })

    // Calculating the sum of updated array
    let sum = arr.reduce((acc, curr)=> acc + curr, 0);

    // Calculating the variance
    let variance = sum / arr.length

    // Returning the Standered deviation
    return Math.sqrt(sum / arr.length)
}

export function replaceValueDiz(diz, old_value, new_value) {
    let tmp = {}
    Object.keys(diz).forEach(key => {
        if (diz[key] === old_value) {
            tmp[key] = new_value
        } else {
            tmp[key] = diz[key]
        }
    })
    return tmp
}

export async function checkError(error) {
    let type = '';

    if (error.response.data instanceof ArrayBuffer) {
        type = 'buffer';
    }

    if (error.response.data instanceof Blob) {
        type = 'blob';
    }

    if (error.response.status === 403) {
        message.error("You are not authenticated!", 3);
    } else if (error.response.status === 401) {
        message.error("You don't have the authorization!", 3);
    } else if (error.response.status === 400) {
        let text = error.response.data
        if (type === 'buffer') {
            let enc = new TextDecoder("utf-8");
            text = enc.decode(error.response.data).replaceAll('"', '')
        } else if (type === 'blob') {
            let promise = await error.response.data.text()
            text = promise.replaceAll('"', '')
        }
        message.error("Bad Request. " + text, 3);
    } else {
        message.error(error.response.data, 3);
    }
}
