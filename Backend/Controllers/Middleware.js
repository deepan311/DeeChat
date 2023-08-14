const jwt = require("jsonwebtoken")

exports.verifyToken=(req,res,next)=>{
    
   const {token}= req.headers

   if(!token){
    return res.status(400).send("NO token illada venna")
   }


   jwt.verify(token,process.env.KEY,(err,data)=>{
    if(err){
      return  res.status(400).send(err)
    }else{
        req.data=data
        next()
    }
   })



}