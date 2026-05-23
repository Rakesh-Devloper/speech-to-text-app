const express = require("express")
const cors = require("cors")
const multer = require("multer")
const mongoose = require("mongoose")
<<<<<<< HEAD
const fs = require("fs")
const OpenAI = require("openai")
const dotenv = require("dotenv")

=======
const dotenv = require("dotenv")
>>>>>>> be01f3123430ae524cdf7d479c658a7cef741447
const app =express()

app.use(cors())
app.use(express.json())
dotenv.config()
<<<<<<< HEAD
const clinet = new OpenAI({
    apikey:process.env.OPENAI_API_KEY,
})
=======
>>>>>>> be01f3123430ae524cdf7d479c658a7cef741447
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
<<<<<<< HEAD
app.post("/upload", upload.single("audio"), async (req, res) => {
    try{
        const transcription = await client.audio.transcriptions.create({
            file:fs.createReadStream(req.file.path),
            model:"whisper-1",
        })
        res.json({
            message:"File upladed successfully",
            transcription:transcription.text
        })
    }catch (error) {
        console.log(error)

        res.status(500).json({
            error : "Transcription failed"
        })
    }
})
    
//mongodb connection...
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("MongoDb conneted Successfully")
})
.catch((error)=>{
    console.log(error)
})
=======
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
>>>>>>> be01f3123430ae524cdf7d479c658a7cef741447


const port = 5000;
//test route..//

app.get("/", (req, res)=>{
    res.send("BAckend server is running")
})


app.listen(port, ()=>{
    console.log(`Server is running on ${port}`)
})