require("dotenv").config()
const express=require("express")
const {connection}=require("./Configs/db")
const {router}=require("./Routes/trainRoutes")
const cors=require("cors")
const app=express()
app.use(cors())
app.use(express.json())

app.use("/train",router)
app.listen(process.env.PORT||8080,async(req,res)=>{
    try{
        await connection 
        console.log('connected to DB',process.env.PORT)
    }
    catch(err){
        console.log(err) 
    }
})
