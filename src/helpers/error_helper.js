export function getErrorMessage(data, field){
    if(data.hasOwnProperty(field))
        return data[field][0]

    return null
}
