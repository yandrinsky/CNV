function uniqueId(){
    let id = String(Math.random())
    id.replace(".", "");
    return id;
}

export default uniqueId;