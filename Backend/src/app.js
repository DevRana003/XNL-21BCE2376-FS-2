import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit:"10kb"}))
app.use(express.urlencoded({extended:true , limit:"10kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// import routes 

import userRouter from "./routes/user.routes.js"
import chatRouter from "./routes/chat.routes.js";
app.use("/api/v1/users",userRouter)
app.use("/api/v1/chat", chatRouter);




app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

export { app }