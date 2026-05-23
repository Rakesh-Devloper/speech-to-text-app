const express = require("express")
const cors = require("cors")
const multer = require("multer")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const app =express()

app.use(cors())
app.use(express.json())
dotenv.config()
//storage multer...//
const storage = multer.diskStorage({
    destination:(req, file, cb) =>{
        cb(null, "uploads/")
    },
    filename:(req, file, cb)=>{
        cb(null, Date.now() + "-" + file.originalname)
    },
})

const upload = multer({storage})
///upload rote..///
app.post("/upload", upload.single("audio"), (req, res) => {
    res.json({
        message:"File uploaded successfully",
        file: req.file,
    })
})
//mongodb connection...
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("MongoDb conneted Successfully")
})
.catch((error)=>{
    console.log(error)
})


const port = 5000;
//test route..//

app.get("/", (req, res)=>{
    res.send("BAckend server is running")
})


app.listen(port, ()=>{
    console.log(`Server is running on ${port}`)
})