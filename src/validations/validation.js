function isProductName(x){
    if(!x) return "mandatory title is missing";
    if(typeof x !== "string") return "title should be written in string only";
    return true;
}

module.exports = {isProductName}