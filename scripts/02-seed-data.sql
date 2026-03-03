-- Seed data for ExamPortal
USE exam_portal;

-- Insert admin and student users
-- Password for admin: hashed version of "admin123"
-- Password for students: hashed version of "student123"
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
  ('admin@example.com', '$2b$10$YourHashedAdminPassword123', 'Admin', 'User', 'admin'),
  ('john.student@example.com', '$2b$10$YourHashedStudentPassword1', 'John', 'Doe', 'student'),
  ('jane.student@example.com', '$2b$10$YourHashedStudentPassword2', 'Jane', 'Smith', 'student'),
  ('mike.student@example.com', '$2b$10$YourHashedStudentPassword3', 'Mike', 'Johnson', 'student');

-- Insert questions
INSERT INTO questions (title, description, question_type, options, correct_answer, explanation, difficulty_level, category, created_by) VALUES
  (
    'What is the capital of France?',
    'Identify the capital city of France',
    'multiple-choice',
    '["Paris", "London", "Berlin", "Madrid"]',
    'Paris',
    'Paris is the capital and most populous city of France.',
    'easy',
    'Geography',
    1
  ),
  (
    'Which planet is known as the Red Planet?',
    'Name the planet famous for its red color',
    'multiple-choice',
    '["Venus", "Mars", "Jupiter", "Saturn"]',
    'Mars',
    'Mars is often called the Red Planet due to its reddish appearance caused by iron oxide on its surface.',
    'easy',
    'Science',
    1
  ),
  (
    'What is the chemical formula for water?',
    'Provide the chemical formula of water',
    'multiple-choice',
    '["H2O", "CO2", "O2", "H2"]',
    'H2O',
    'Water is composed of two hydrogen atoms and one oxygen atom.',
    'easy',
    'Chemistry',
    1
  ),
  (
    'In what year did World War II end?',
    'When did the second world war conclude?',
    'multiple-choice',
    '["1943", "1944", "1945", "1946"]',
    '1945',
    'World War II ended in 1945 with the surrender of Japan on September 2.',
    'medium',
    'History',
    1
  ),
  (
    'What is the largest ocean on Earth?',
    'Name the largest ocean',
    'multiple-choice',
    '["Atlantic Ocean", "Pacific Ocean", "Indian Ocean", "Arctic Ocean"]',
    'Pacific Ocean',
    'The Pacific Ocean is the largest and deepest of all oceans.',
    'easy',
    'Geography',
    1
  ),
  (
    'Who wrote Romeo and Juliet?',
    'Identify the author of this famous play',
    'multiple-choice',
    '["Jane Austen", "William Shakespeare", "Charles Dickens", "Mark Twain"]',
    'William Shakespeare',
    'William Shakespeare wrote Romeo and Juliet, one of his most famous tragedies.',
    'easy',
    'Literature',
    1
  ),
  (
    'What is the square root of 144?',
    'Calculate the square root',
    'multiple-choice',
    '["10", "12", "14", "16"]',
    '12',
    'The square root of 144 is 12 because 12 × 12 = 144.',
    'easy',
    'Mathematics',
    1
  ),
  (
    'Which element has the atomic number 1?',
    'Identify the element with atomic number 1',
    'multiple-choice',
    '["Helium", "Hydrogen", "Lithium", "Carbon"]',
    'Hydrogen',
    'Hydrogen is the lightest element and has the atomic number 1.',
    'medium',
    'Chemistry',
    1
  ),
  (
    'What is the smallest prime number?',
    'Find the smallest prime number',
    'multiple-choice',
    '["0", "1", "2", "3"]',
    '2',
    'Two is the smallest prime number and the only even prime number.',
    'medium',
    'Mathematics',
    1
  ),
  (
    'In what year did the Titanic sink?',
    'When did the Titanic sink?',
    'multiple-choice',
    '["1910", "1911", "1912", "1913"]',
    '1912',
    'The Titanic sank on April 15, 1912, after hitting an iceberg.',
    'medium',
    'History',
    1
  );

-- Insert exams
INSERT INTO exams (title, description, duration_minutes, total_questions, passing_percentage, status, proctoring_enabled, allow_navigation, created_by) VALUES
  (
    'General Knowledge Quiz',
    'A comprehensive quiz covering geography, history, science, and literature.',
    30,
    5,
    40,
    'published',
    FALSE,
    TRUE,
    1
  ),
  (
    'Advanced Science Exam',
    'Test your knowledge of chemistry, physics, and biology.',
    45,
    5,
    50,
    'published',
    TRUE,
    FALSE,
    1
  ),
  (
    'Mathematics Fundamentals',
    'Basic mathematics concepts and problem solving.',
    30,
    3,
    60,
    'draft',
    FALSE,
    TRUE,
    1
  );

-- Link questions to exams
INSERT INTO exam_questions (exam_id, question_id, question_order) VALUES
  (1, 1, 1),
  (1, 2, 2),
  (1, 3, 3),
  (1, 5, 4),
  (1, 6, 5),
  (2, 3, 1),
  (2, 7, 2),
  (2, 8, 3),
  (2, 9, 4),
  (2, 10, 5),
  (3, 7, 1),
  (3, 9, 2),
  (3, 2, 3);

-- Insert sample exam attempts
INSERT INTO exam_attempts (exam_id, user_id, start_time, end_time, submitted_at, score, total_marks, percentage_score, status) VALUES
  (1, 2, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 25 MINUTE, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 25 MINUTE, 4, 5, 80.00, 'graded'),
  (1, 3, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 28 MINUTE, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 28 MINUTE, 3, 5, 60.00, 'graded'),
  (2, 2, NOW() - INTERVAL 2 HOUR, NULL, NULL, NULL, NULL, NULL, 'in-progress');

-- Insert sample answers for completed attempts
INSERT INTO exam_answers (attempt_id, question_id, user_answer, is_correct, marks_obtained, answered_at) VALUES
  (1, 1, 'Paris', TRUE, 1, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 2 MINUTE),
  (1, 2, 'Mars', TRUE, 1, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 5 MINUTE),
  (1, 3, 'H2O', TRUE, 1, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 8 MINUTE),
  (1, 5, 'Pacific Ocean', TRUE, 1, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 15 MINUTE),
  (1, 6, 'Mark Twain', FALSE, 0, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 22 MINUTE),
  (2, 1, 'London', FALSE, 0, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 3 MINUTE),
  (2, 2, 'Mars', TRUE, 1, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 7 MINUTE),
  (2, 3, 'H2O', TRUE, 1, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 12 MINUTE),
  (2, 5, 'Atlantic Ocean', FALSE, 0, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 18 MINUTE),
  (2, 6, 'William Shakespeare', TRUE, 1, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 25 MINUTE);

-- Insert sample proctoring logs
INSERT INTO proctoring_logs (attempt_id, event_type, event_data) VALUES
  (3, 'tab_switch', '{"count": 1}'),
  (3, 'page_visibility', '{"hidden": true}'),
  (3, 'window_blur', '{"duration_seconds": 5}');
