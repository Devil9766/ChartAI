import bodyParser from "body-parser";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import VerifyToken from "./Middleware/VerifyToken.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import uploadRoute from "./Routes/uploadRoute.js";
import db from "./db.js";
import fileHistoryRoute from "./Routes/fileHistoryRoute.js"
import sheetRoute from "./Routes/SheetRoute.js"; 

const PORT = process.env.PORT;
const app = express();
const saltRound = 10;


app.use(bodyParser.urlencoded({extended:true}));
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}));
app.use(express.json())
app.use(cookieParser());
dotenv.config();



app.post("/signUp" , async (req , res)=>{ 
    const {name , email , password} = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }
    try {
        const [row] = await db.execute("select * from users where email = ?" , [email]);
        if(row.length > 0){
          return  res.status(409).json({message : "user already exists"})
        }

        const hashedPassword = await bcrypt.hash(password , saltRound);
        await db.execute("insert into users(name , email , password_hash) values(? ,? ,?)" , [name , email , hashedPassword]);

        return res.status(201).json({message : "User created successfully"});
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : "Internal Server Error"});
    }
})

app.post("/login" , async (req , res)=>{
    const {email , password} = req.body ; 
    try{
    const[row] = await db.execute("select * from users where email = ?" , [email]);
    if(row.length == 0){
        res.status(401).json({message : "Invalid email and password."})
    }
    const user = row[0];

    const isMatch = await bcrypt.compare(password , user.password_hash);
    if(!isMatch){
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.user_id, email: user.email, role : user.role , name : user.name}, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
    res.cookie("token" , token , {
        httpOnly : true,
        secure : false,
        sameSite : "lax",
        maxAge : 60*60*1000
    })

    res.status(200).json({message : "Login Successful", role : user.role });
    }catch(error){
        res.status(500).json({message :" Internal server error"});
    }
})
app.get("/profile", VerifyToken, (req, res) => {
    res.json({
        email: req.user.email,
        role: req.user.role,
        name: req.user.name
    });
});

app.use("/api" , uploadRoute)

app.use("/api" , fileHistoryRoute);

app.use("/api" , sheetRoute);

app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax"
  });
  res.status(200).json({ message: "Logged out successfully" });
});


app.listen(PORT , ()=>{
    console.log(`server successfully started on port ${PORT}`);
})

