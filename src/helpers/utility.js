exports.findIndexInObjArr = (arr, key, item)=>{
    return arr.map((e)=>{ return e[key]; }).indexOf(item);
 }

 
exports.filterArray = (arr)=>{
    return arr.filter((item, index)=>{
      return arr.indexOf(item) >= index;
    });
  }


exports.filterObjArr = (arr) => {
    return arr.filter((value, index, array) => {
        index = index - 1
        if (index == -1) return value // first in the arr
        if (value.id != arr[index].id) {
            return value
        }
    })
}