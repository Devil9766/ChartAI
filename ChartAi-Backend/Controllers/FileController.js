import db from "../db.js";


export const getFileHistory= async(req , res) =>{
    try {
        const [result] = await db.execute("Select * from uploadedfiles where user_id = ? order by uploaded_at desc " , [req.user.id]);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(400).json({message : "Error while getting file history from the database"});
    }
    
}