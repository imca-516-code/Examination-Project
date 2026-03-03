-- ============================================================
-- ExamPortal Database Schema
-- MySQL / MariaDB (XAMPP compatible)
-- ============================================================

CREATE DATABASE IF NOT EXISTS exam_portal
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE exam_portal;

-- -----------------------------------------------------------
-- Users
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(100)   NOT NULL,
    email           VARCHAR(150)   NOT NULL UNIQUE,
    password        VARCHAR(255)   NOT NULL,
    role            ENUM('admin','student') NOT NULL DEFAULT 'student',
    created_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------------
-- Questions
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS questions (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    text            TEXT           NOT NULL,
    option_a        VARCHAR(500)   NOT NULL,
    option_b        VARCHAR(500)   NOT NULL,
    option_c        VARCHAR(500)   NOT NULL,
    option_d        VARCHAR(500)   NOT NULL,
    correct_answer  INT            NOT NULL COMMENT '0=A, 1=B, 2=C, 3=D',
    subject         ENUM('Mathematics','Science','Programming') NOT NULL,
    difficulty      ENUM('easy','medium','hard') NOT NULL,
    created_by      INT            NOT NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------
-- Exams
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS exams (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    title           VARCHAR(200)   NOT NULL,
    description     TEXT,
    subject         ENUM('Mathematics','Science','Programming') NOT NULL,
    duration        INT            NOT NULL COMMENT 'minutes',
    total_questions  INT           NOT NULL,
    passing_score   INT            NOT NULL COMMENT 'percentage',
    status          ENUM('draft','active','completed') NOT NULL DEFAULT 'draft',
    created_by      INT            NOT NULL,
    created_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    scheduled_at    TIMESTAMP      NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------
-- Exam ↔ Question junction
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS exam_questions (
    exam_id         INT NOT NULL,
    question_id     INT NOT NULL,
    PRIMARY KEY (exam_id, question_id),
    FOREIGN KEY (exam_id)     REFERENCES exams(id)     ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id)  ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------
-- Exam Attempts
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS exam_attempts (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    exam_id         INT            NOT NULL,
    student_id      INT            NOT NULL,
    started_at      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    submitted_at    TIMESTAMP      NULL,
    score           DECIMAL(5,2)   NULL,
    total_correct   INT            NULL,
    total_questions INT            NOT NULL,
    status          ENUM('in_progress','submitted') NOT NULL DEFAULT 'in_progress',
    FOREIGN KEY (exam_id)    REFERENCES exams(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------
-- Attempt Answers
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS attempt_answers (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    attempt_id      INT NOT NULL,
    question_id     INT NOT NULL,
    selected_answer INT NOT NULL COMMENT '0=A, 1=B, 2=C, 3=D',
    UNIQUE KEY uq_attempt_question (attempt_id, question_id),
    FOREIGN KEY (attempt_id)  REFERENCES exam_attempts(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id)      ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------
-- Attempt Question Order  (randomized per student)
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS attempt_question_order (
    attempt_id      INT NOT NULL,
    question_id     INT NOT NULL,
    question_position INT NOT NULL,
    PRIMARY KEY (attempt_id, question_position),
    FOREIGN KEY (attempt_id)  REFERENCES exam_attempts(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id)      ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------
-- Proctor Logs
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS proctor_logs (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    attempt_id      INT NOT NULL,
    event_type      ENUM('tab_switch','focus_loss','right_click','copy_paste','fullscreen_exit','key_combo') NOT NULL,
    timestamp       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    description     VARCHAR(500),
    FOREIGN KEY (attempt_id) REFERENCES exam_attempts(id) ON DELETE CASCADE
) ENGINE=InnoDB;
