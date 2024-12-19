const express=require("express");
const router=express.Router();
const User=require('../Model/userModel');


router.get('/find',async(req,res)=>{
    try{
        const users=await User.find({},'email password banned');
        res.json(users);
    }catch(error){
        res.status(500).json({error:'Failedto fetch user data'});
    }
})

module.exports=router;