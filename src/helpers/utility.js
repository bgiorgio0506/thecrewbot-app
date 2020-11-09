const fs = require('fs',);
const path = require('path',);

exports.findIndexInObjArr = (arr, key, item,) => {
    return arr.map((e,) => { return e[key]; },).indexOf(item,);
};


exports.filterArray = (arr,) => {
    return arr.filter((item, index,) => {
        return arr.indexOf(item,) >= index;
    },);
};


exports.filterObjArr = (arr,) => {
    return arr.filter((value, index,) => {
        index = index - 1;
        if (index == -1) return value; // first in the arr
        if (value.id != arr[index].id) {
            return value;
        }
    },);
};

exports.isEmpty = (arr,) => {
    if ( (arr === undefined) || (arr === null) || (arr.length === 0)) return true;
    else return false;
};


exports.writeFile = (fileName, content,) => {
    return new Promise((resolve, reject,) => {
        fs.mkdir(path.join(process.env.APPDATA, 'thecrewbot-app\\Temp Folder\\',), { recursive : true, }, (err,) => {
            if (err) return reject(err,);
            fs.writeFile(path.join(process.env.APPDATA, 'thecrewbot-app\\Temp Folder\\'+fileName,), content, 'utf8', (err,) => {
                if (err) return reject(err,);
                return resolve(true,);
            },);
        },);
    },);
};
