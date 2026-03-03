-- ExamPortal Database Schema
-- MySQL 5.7+ compatible

-- Create database
CREATE DATABASE IF NOT EXISTS exam_portal;
USE exam_portal;

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS proctoring_logs;
DROP TABLE IF EXISTS exam_answers;
DROP TABLE IF EXISTS exam_attempts;
DROP TABLE IF EXISTS exam_questions;
DROP TABLE IF EXISTS exams;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role ENUM('student', 'admin') NOT NULL DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Questions table
CREATE TABLE questions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  question_type ENUM('multiple-choice', 'short-answer') NOT NULL,
  options JSON,
  correct_answer VARCHAR(500),
  explanation TEXT,
  difficulty_level ENUM('easy', 'medium', 'hard') NOT NULL DEFAULT 'medium',
  category VARCHAR(100),
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id),
  INDEX idx_category (category),
  INDEX idx_difficulty (difficulty_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Exams table
CREATE TABLE exams (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration_minutes INT NOT NULL,
  total_questions INT NOT NULL,
  passing_percentage INT DEFAULT 40,
  status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
  proctoring_enabled BOOLEAN DEFAULT FALSE,
  allow_navigation BOOLEAN DEFAULT TRUE,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id),
  INDEX idx_status (status),
  INDEX idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Exam Questions junction table
CREATE TABLE exam_questions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  exam_id INT NOT NULL,
  question_id INT NOT NULL,
  question_order INT NOT NULL,
  FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id),
  UNIQUE KEY unique_exam_question (exam_id, question_id),
  INDEX idx_exam_id (exam_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Exam Attempts table
CREATE TABLE exam_attempts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  exam_id INT NOT NULL,
  user_id INT NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  submitted_at TIMESTAMP,
  score INT,
  total_marks INT,
  percentage_score DECIMAL(5,2),
  status ENUM('in-progress', 'submitted', 'graded', 'abandoned') NOT NULL DEFAULT 'in-progress',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (exam_id) REFERENCES exams(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_exam_id (exam_id),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Exam Answers table
CREATE TABLE exam_answers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  attempt_id INT NOT NULL,
  question_id INT NOT NULL,
  user_answer VARCHAR(500),
  is_correct BOOLEAN,
  marks_obtained INT,
  answered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (attempt_id) REFERENCES exam_attempts(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id),
  INDEX idx_attempt_id (attempt_id),
  INDEX idx_question_id (question_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Proctoring Logs table
CREATE TABLE proctoring_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  attempt_id INT NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  event_data JSON,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (attempt_id) REFERENCES exam_attempts(id) ON DELETE CASCADE,
  INDEX idx_attempt_id (attempt_id),
  INDEX idx_event_type (event_type),
  INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create indexes for performance
CREATE INDEX idx_exam_attempts_user_exam ON exam_attempts(user_id, exam_id);
CREATE INDEX idx_exam_answers_attempt_question ON exam_answers(attempt_id, question_id);
