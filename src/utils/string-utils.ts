export function doNotExits(param: any) {
    if (param == undefined || param == null) return true
    const tmp = param.toString().trim()
    if (tmp == "") return true
    else return false
}

export function formatMoney(number: number, min = 0, max = 2, returnIfFalse = number) {
    let num_check = parseFloat(number.toString());
    if (isNaN(num_check)) return returnIfFalse;
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: min,
        maximumFractionDigits: max,
    }).format(number);
};
