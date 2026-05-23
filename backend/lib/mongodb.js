<<<<<<< HEAD
// import mongoose from "mongoose";
// const MONGO_URI = process.env.MONGO_URI


// async function connectDB(){
//     if(mongoose.connections[0].readyState){
//         return

//     }
        

// await mongoose.connect(MONGO_URI)
// }

// export default connectDB
=======
import mongoose from "mongoose";
const MONGO_URI = process.env.MONGO_URI


async function connectDB(){
    if(mongoose.connections[0].readyState){
        return

    }
        

await mongoose.connect(MONGO_URI)
}

export default connectDB
>>>>>>> be01f3123430ae524cdf7d479c658a7cef741447
