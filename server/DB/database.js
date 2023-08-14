const mongoose = require("mongoose")


// mongoose.set("strictQuery",true)

const DB=mongoose.connect(process.env.DB_URL)


module.exports=DB