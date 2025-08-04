import db from "../db.js";


export const getSheetList= async(req , res) =>{
    const fileId = req.query.file_id;
    if (!fileId) {
    return res.status(400).json({ message: "Missing file_id in query parameter" });
  }
    try {
        const [result] = await db.execute("Select * from Extracteddata  where file_id = ? order by created_at DESC", [fileId]);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).json({message : "Error while getting sheet list from the database"});
    }
    
}