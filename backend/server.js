const express = require("express")
const cors = require("cors")
const multer = require("multer")
const app =express()

app.use(cors())
app.use(express.json())


const storage = multer.diskStorage({
    destination:(req, file, cb) =>{
        cb(null, "uploads/")
    },
    filename:(req, file, cb)=>{
        cb(null, Date.now() + "-" + file.originalname)
    },
})

const upload = multer({storage})

app.post("/upload", upload.single("audio"), (req, res) => {
    res.json({
        message:"File uploaded successfully",
        file: req.file,
    })
})





const port = 5000;


app.get("/", (req, res)=>{
    res.send("BAckend server is running")
})


app.listen(port, ()=>{
    console.log(`Server is running on ${port}`)
})