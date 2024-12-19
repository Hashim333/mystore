const mongoose=require("mongoose")

const connectDb=()=>mongoose.connect("mongodb://127.0.0.1:27017/sampleDB")

.then(()=>console.log("Database Connected"))

.catch(err=>console.log(err))
module.exports=connectDb