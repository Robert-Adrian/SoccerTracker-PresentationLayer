export const isNullOrEmpty = (array) => {
    if(typeof array == undefined || array == null || array.length === 0 || array[0] == undefined)
        return true;
    return false;
}