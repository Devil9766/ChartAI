
-- Create Database
CREATE DATABASE IF NOT EXISTS ExcelAnalyticsDB;
USE ExcelAnalyticsDB;

-- 1. Users Table
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    is_blocked BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


-- 2. UploadedFiles Table
CREATE TABLE UploadedFiles (
    file_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    filename VARCHAR(200) NOT NULL,
    filepath TEXT NOT NULL,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- 3. ExtractedData Table
CREATE TABLE ExtractedData (
    data_id INT AUTO_INCREMENT PRIMARY KEY,
    file_id INT NOT NULL,
    sheet_name VARCHAR(100),
    data_json JSON,
    columns TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (file_id) REFERENCES UploadedFiles(file_id) ON DELETE CASCADE
);

-- 4. AnalysisReports Table
CREATE TABLE AnalysisReports (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    data_id INT NOT NULL,
    user_id INT NOT NULL,
    title VARCHAR(200),
    summary TEXT,
    report_json JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (data_id) REFERENCES ExtractedData(data_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- 5. Visualizations Table
CREATE TABLE Visualizations (
    viz_id INT AUTO_INCREMENT PRIMARY KEY,
    report_id INT NOT NULL,
    type VARCHAR(50),
    config_json JSON,
    title VARCHAR(150),
    FOREIGN KEY (report_id) REFERENCES AnalysisReports(report_id) ON DELETE CASCADE
);

-- 6. AuditLogs Table (Optional)
CREATE TABLE AuditLogs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(100),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    details TEXT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
