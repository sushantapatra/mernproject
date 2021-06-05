const mongoose =require("mongoose")

mongoose.connect("mongodb://localhost:27017/youtubeRegistration",{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false
}).then(()=>{
    console.log("connection successfully...");
}).catch((e)=>{
    console.log(`No connectuin, error:${e}`)
})