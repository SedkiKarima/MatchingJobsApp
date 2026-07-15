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

CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    company VARCHAR(150) NOT NULL,
    location VARCHAR(100) NOT NULL,
    contract ENUM('CDI','CDD','Stage','Freelance') NOT NULL,
    description TEXT,
    manager_id INT,
    status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (manager_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);


CREATE TABLE job_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    tag VARCHAR(50) NOT NULL,

    FOREIGN KEY (job_id)
        REFERENCES jobs(id)
        ON DELETE CASCADE
);
INSERT INTO jobs
(title, company, location, contract, manager_id)
VALUES
('Développeur Fullstack React/Node','Capital One','Casablanca','CDI',1),

('Product Designer (UI/UX)','Stripe','Rabat · Hybride','CDI',1),

('DevOps Engineer','Chipotle','À distance','Freelance',2),

('Data Scientist','Electronic Arts','Casablanca','CDI',2),

('Chargé(e) de support client','Zendesk','Tanger','Stage',1),

('Ingénieur QA / Game Tester','Electronic Arts','Marrakech','CDI',2)

INSERT INTO job_tags (job_id, tag)
VALUES
(25, 'React'),
(25, 'Node.js'),
(25, 'MySQL'),

(26, 'Figma'),
(26, 'UX Research'),

(27, 'Docker'),
(27, 'CI/CD'),
(27, 'AWS'),

(28, 'Python'),
(28, 'ML'),

(29, 'Relation client'),

(30, 'Tests manuels'),
(30, 'Bug tracking');