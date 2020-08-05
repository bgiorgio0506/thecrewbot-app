exports.findIndexInObjArr = (arr, key, item)=>{
    return arr.map((e)=>{ return e[key]; }).indexOf(item);
 
 }