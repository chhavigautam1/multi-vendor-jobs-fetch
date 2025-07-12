const express=require('express')

module.exports=(req,res)=>{
    const result={
        vendor:"sync",
        success:true,
        data:{
            message:'Sync vendor processed your request',
            recievedPayload:req.body
        }
    }

    res.json(result)
}