-- Research Opportunity Portal - Database Schema
-- Run this file in MySQL to setup the database

CREATE DATABASE IF NOT EXISTS research_portal;
USE research_portal;

-- Creating the main table for research opportunities
CREATE TABLE IF NOT EXISTS opportunities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    research_area VARCHAR(150) NOT NULL,
    faculty_name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    required_skills VARCHAR(255) NOT NULL,
    positions INT NOT NULL DEFAULT 1,
    deadline DATE NOT NULL,
    status ENUM('Open', 'Closed') NOT NULL DEFAULT 'Open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inserting some sample data so the portal isn't empty when you first run it
INSERT INTO opportunities (title, description, research_area, faculty_name, department, required_skills, positions, deadline, status)
VALUES
('Machine Learning for Healthcare', 'Research on applying ML techniques to predict patient outcomes using hospital data.', 'Artificial Intelligence', 'Dr. Ahmed Khan', 'Computer Science', 'Python, TensorFlow, Data Analysis', 3, '2026-12-15', 'Open'),
('IoT Based Smart Campus', 'Developing an IoT network for monitoring energy usage across campus buildings.', 'Internet of Things', 'Dr. Sara Ali', 'Electrical Engineering', 'Arduino, Raspberry Pi, Networking', 2, '2026-11-30', 'Open'),
('Blockchain in Supply Chain', 'Exploring blockchain technology for transparent and secure supply chain management.', 'Blockchain', 'Dr. Faisal Mahmood', 'Computer Science', 'Solidity, JavaScript, Cryptography', 2, '2026-12-01', 'Open');
