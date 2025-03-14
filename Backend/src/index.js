import dotenv from "dotenv"
import connectdb from "./db/index.js";
import { app } from "./app.js"
dotenv.config({
    path:'./.env'
})
connectdb()
.then(()=>{
    app.listen(process.env.PORT||8000, ()=>{
        console.log("server is running at port ", process.env.PORT);
    })
})
.catch((error)=>{
    console.log("error Mongo db connection failed", error)
    throw error
})