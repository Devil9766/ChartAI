import xlsx from "xlsx";
import db from "../db.js";

export const handleExcelUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded or invalid type." });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: User info missing" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const userId = req.user.id;
    const filename = req.file.originalname;

    const normalizeData = (dataArray) => {
      return dataArray.map((item) => {
        const cleanedItem = {};
        for (let key in item) {
          if (Object.hasOwnProperty.call(item, key)) {
            const trimmedKey = key.trim();
            const value = item[key];

            cleanedItem[trimmedKey] = typeof value === 'string' ? value.trim() : value;
          }
        }
        return cleanedItem;
      });
    };

    const [result] = await db.execute(
      "INSERT INTO UploadedFiles (user_id, filename, filepath) VALUES (?, ?, ?)",
      [userId, filename, "-"]
    );
    const fileId = result.insertId;

    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(sheet, { defval: null });
      if (jsonData.length === 0) continue;
      
      const normalizedData = normalizeData(jsonData);
      const columnNames = Object.keys(normalizedData[0]).join(", ");

      await db.execute(
        "INSERT INTO ExtractedData (file_id, sheet_name, data_json, columns) VALUES (?, ?, ?, ?)",
        [fileId, sheetName, JSON.stringify(normalizedData), columnNames]
      );
    }

    return res.status(200).json({fileId: fileId, message: "Excel file parsed and saved successfully." });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "Internal server error while uploading file." });
  }
};
