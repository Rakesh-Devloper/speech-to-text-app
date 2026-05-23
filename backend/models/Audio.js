import mongoose from "mongoose";

const AudioSchema = new mongoose.Schema({
    fileNmae : String,
    audioUrl:String,
    transcription:String,
})
export default mongoose.mondels.Audio || monngoose.model("Audio", AudioSchema)