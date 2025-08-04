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
import InsightRoute from "./Routes/InsightRoute.js"
import isAdmin from "./Middleware/isAdmin.js";
import authorizeRoles from "./Middleware/AuthorizeRoles.js";
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
        const [row] = await db.execute("select * from Users where email = ?" , [email]);
        if(row.length > 0){
          return  res.status(409).json({message : "user already exists"})
        }

        const hashedPassword = await bcrypt.hash(password , saltRound);
        await db.execute("insert into Users(name , email , password_hash) values(? ,? ,?)" , [name , email , hashedPassword]);

        return res.status(201).json({message : "User created successfully"});
    } catch (error) {
        console.log(error)
        return res.status(500).json({message : "Internal Server Error"});
    }
})

app.post("/login" , async (req , res)=>{
    const {email , password} = req.body ; 
    try{
    const[row] = await db.execute("select * from Users where email = ?" , [email]);
    if(row.length == 0){
        res.status(401).json({message : "Invalid email and password."})
    }
    const user = row[0];
    if (user.is_blocked) {
      return res.status(403).json({ message: "User is blocked. Contact admin." });
    }

    const isMatch = await bcrypt.compare(password , user.password_hash);
    if(!isMatch){
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.user_id, email: user.email, role : user.role , name : user.name}, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
    res.cookie("token" , token , {
        httpOnly : true,
        secure : true,
        sameSite : "none",
        maxAge : 60*60*1000
    })

    res.status(200).json({message : "Login Successful"});
    }catch(error){
        res.status(500).json({message :" Internal server error"});
    }
})
app.get("/profile", VerifyToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const [rows] = await db.query("SELECT user_id, name, email, role FROM Users WHERE user_id = ?", [req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(rows[0]); 
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});


app.get('/stats', VerifyToken,authorizeRoles("user","admin"), async (req, res) => {
    const userId = req.user.id;

    const [rows] = await db.execute(`
        SELECT 
            (SELECT COUNT(*) FROM UploadedFiles WHERE user_id = ?) AS file_count,
            (SELECT COUNT(*) 
             FROM ExtractedData ed 
             JOIN UploadedFiles uf ON ed.file_id = uf.file_id 
             WHERE uf.user_id = ?) AS sheet_count,
            (SELECT COUNT(*) FROM AnalysisReports WHERE user_id = ?) AS total_insights,
            (SELECT COUNT(*) 
             FROM Visualizations vs
             JOIN AnalysisReports ar ON ar.report_id = vs.report_id 
             WHERE ar.user_id = ?) AS visualization_saved_count
    `, [userId, userId, userId, userId]);

    res.json(rows[0]);
});


app.use("/api" , uploadRoute)

app.use("/api" , fileHistoryRoute);

app.use("/api" , sheetRoute);

app.use("/api" , InsightRoute);


app.post("/save-report", VerifyToken,authorizeRoles("user"), async (req, res) => {
  const { data_id, title, summary, report_json } = req.body;
  const user_id = req.user.id;

  const [result] = await db.query(`
    INSERT INTO AnalysisReports (data_id, user_id, title, summary, report_json)
    VALUES (?, ?, ?, ?, ?)
  `, [data_id, user_id, title, summary, JSON.stringify(report_json)]);

  res.json({ message: "Insight saved", report_id: result.insertId });
});

app.post("/save-viz", VerifyToken, authorizeRoles("user"), async (req, res) => {
  const { report_id, type, config_json, title } = req.body;

  await db.query(`
    INSERT INTO Visualizations (report_id, type, config_json, title)
    VALUES (?, ?, ?, ?)
  `, [report_id, type, JSON.stringify(config_json), title]);

  res.json({ message: "Visualization saved" });
});


app.get("/reports", VerifyToken, authorizeRoles("user"), async (req, res) => {
  const userId = req.user.id;

  try {
    const [reports] = await db.query(
      "SELECT * FROM AnalysisReports WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );
    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching reports" });
  }
});


app.get("/report/:reportId", VerifyToken, authorizeRoles("user"), async (req, res) => {
  const { reportId } = req.params;
  const userId = req.user.id;

  try {
    const [[report]] = await db.query(
      "SELECT * FROM AnalysisReports WHERE report_id = ? AND user_id = ?",
      [reportId, userId]
    );

    if (!report) return res.status(404).json({ message: "Report not found" });

    const [visualizations] = await db.query(
      "SELECT * FROM Visualizations WHERE report_id = ?",
      [reportId]
    );

    res.json({ report, visualizations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching report" });
  }
});


app.get("/admin/stats", VerifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const [[stats]] = await db.query(`
      SELECT
        (SELECT COUNT(*) FROM Users) AS user_count,
        (SELECT COUNT(*) FROM UploadedFiles) AS file_count,
        (SELECT COUNT(*) FROM AnalysisReports) AS report_count,
        (SELECT COUNT(*) FROM Visualizations) AS visualization_count
    `);

    res.json(stats);
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ message: "Server error fetching admin stats" });
  }
});

app.get("/admin/users", VerifyToken, authorizeRoles("admin"), async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT user_id AS id, name, email, role, is_blocked AS blocked FROM Users;
    `);
    res.json(users);
  } catch (err) {
    console.error("Fetch users error:", err);
    res.status(500).json({ message: "Server error fetching users" });
  }
});

app.post("/admin/block/:userId", VerifyToken, authorizeRoles("admin"), async (req, res) => {
  const userId = req.params.userId;

  try {
    await db.query(
      "UPDATE Users SET is_blocked = 1 WHERE user_id = ?",
      [userId]
    );
    res.json({ message: "User blocked successfully" });
  } catch (err) {
    console.error("Block user error:", err);
    res.status(500).json({ message: "Server error blocking user" });
  }
});

app.post("/admin/unblock/:userId", VerifyToken, authorizeRoles("admin"), async (req, res) => {
  const userId = req.params.userId;

  try {
    await db.query(
      "UPDATE Users SET is_blocked = 0 WHERE user_id = ?",
      [userId]
    );
    res.json({ message: "User unblocked successfully" });
  } catch (err) {
    console.error("Unblock user error:", err);
    res.status(500).json({ message: "Server error unblocking user" });
  }
});


app.post("/admin/users", VerifyToken, authorizeRoles("admin"), async (req, res) => {
  const { name, email, role, password } = req.body;

  if (!name || !email || !role || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const [existing] = await db.query("SELECT * FROM Users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [result] = await db.query(
      "INSERT INTO Users (name, email, role, password_hash) VALUES (?, ?, ?, ?)",
      [name, email, role, hashedPassword]
    );

    const [newUser] = await db.query(
      "SELECT user_id AS id, name, email, role FROM Users WHERE user_id = ?",
      [result.insertId]
    );

    res.status(201).json(newUser[0]);
  } catch (error) {
    console.error("Admin Add User Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.put("/admin/users/:id", VerifyToken, authorizeRoles("admin"), async (req, res) => {
  const { name, email, role } = req.body;
  const userId = req.params.id;
  await db.query("UPDATE Users SET name = ?, email = ?, role = ? WHERE user_id = ?", [name, email, role, userId]);
  res.json({ message: "User updated" });
});

app.delete("/admin/users/:id", VerifyToken, authorizeRoles("admin"), async (req, res) => {
  const userId = req.params.id;

  try {
    const [existing] = await db.query("SELECT * FROM Users WHERE user_id = ?", [userId]);
    if (existing.length === 0) return res.status(404).json({ message: "User not found" });

    // Optional: Protect against deleting the only admin
    if (existing[0].role === "admin") {
      const [admins] = await db.query("SELECT COUNT(*) AS count FROM Users WHERE role = 'admin'");
      if (admins[0].count <= 1)
        return res.status(400).json({ message: "Cannot delete the only admin" });
    }

    await db.query("DELETE FROM Users WHERE user_id = ?", [userId]);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.post("/logout",VerifyToken,authorizeRoles("user","admin"), (req, res) => {
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

