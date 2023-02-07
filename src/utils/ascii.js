// ascii排序
function asciiSort(obj) {
    var arr = [];
    var num = 0;
    for (var i in obj) {
        arr[num] = i;
        num++;
    }
    var sortArr = arr.sort();
    var sortObj = {};
    for (var i in sortArr) {
        sortObj[sortArr[i]] = obj[sortArr[i]];
    }
    let str = '&'
    for (var i in sortObj) {
        str = str + i + '=' + sortObj[i] + '&'
    }
    // console.log(sortObj, 'wan');
    const b = str.slice(0, str.length - 1)
        // console.log(b);
    return b;
}

export default asciiSort