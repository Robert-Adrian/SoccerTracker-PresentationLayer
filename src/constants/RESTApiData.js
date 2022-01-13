export const getDefaultHeader = (token) => {
    return {
        // 'Access-Control-Allow-Origin' : '*',
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
    }
}