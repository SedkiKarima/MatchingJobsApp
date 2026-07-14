CREATE DATABASE IF NOT EXISTS recruitment_platform
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE recruitment_platform;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('candidate', 'manager') NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE candidate_profiles (
  user_id INT PRIMARY KEY,
  phone VARCHAR(30),
  skills TEXT,
  resume_path VARCHAR(500),
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE job_offers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  manager_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  required_skills TEXT NOT NULL,
  location VARCHAR(255),
  status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  offer_id INT NOT NULL,
  candidate_id INT NOT NULL,
  status ENUM('submitted', 'under_review', 'accepted', 'rejected') NOT NULL DEFAULT 'submitted',
  applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_application (offer_id, candidate_id),
  FOREIGN KEY (offer_id) REFERENCES job_offers(id) ON DELETE CASCADE,
  FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE ai_analyses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT NOT NULL UNIQUE,
  compatibility_score INT NOT NULL,
  matched_skills TEXT,
  missing_skills TEXT,
  recommendation TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
) ENGINE=InnoDB;
