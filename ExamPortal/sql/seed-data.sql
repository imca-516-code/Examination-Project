-- ============================================================
-- ExamPortal Seed Data
-- Run AFTER schema.sql
-- ============================================================

USE exam_portal;

-- -----------------------------------------------------------
-- Users  (passwords stored as plain text matching original app)
-- -----------------------------------------------------------
INSERT INTO users (id, name, email, password, role, created_at) VALUES
(1, 'Admin User',    'admin@exam.com',  'admin123',   'admin',   '2025-01-15 10:00:00'),
(2, 'Alice Johnson', 'alice@exam.com',  'student123', 'student', '2025-02-01 09:00:00'),
(3, 'Bob Smith',     'bob@exam.com',    'student123', 'student', '2025-02-05 14:00:00');

-- -----------------------------------------------------------
-- Questions
-- -----------------------------------------------------------
-- Mathematics - Easy
INSERT INTO questions (id, text, option_a, option_b, option_c, option_d, correct_answer, subject, difficulty, created_by) VALUES
(1,  'What is the value of 15 + 27?',                                 '32','42','52','40',                                    1, 'Mathematics','easy',1),
(2,  'What is 8 x 7?',                                                '54','48','56','64',                                    2, 'Mathematics','easy',1),
(3,  'What is 144 / 12?',                                             '10','11','12','14',                                    2, 'Mathematics','easy',1);

-- Mathematics - Medium
INSERT INTO questions (id, text, option_a, option_b, option_c, option_d, correct_answer, subject, difficulty, created_by) VALUES
(4,  'What is the square root of 169?',                               '11','12','13','14',                                    2, 'Mathematics','medium',1),
(5,  'Solve: 3x + 7 = 22. What is x?',                               '3','4','5','6',                                        2, 'Mathematics','medium',1),
(6,  'What is the area of a circle with radius 7? (Use pi = 22/7)',   '144','154','164','176',                                1, 'Mathematics','medium',1);

-- Mathematics - Hard
INSERT INTO questions (id, text, option_a, option_b, option_c, option_d, correct_answer, subject, difficulty, created_by) VALUES
(7,  'What is the derivative of f(x) = 3x^2 + 2x + 1?',             '6x + 2','3x + 2','6x + 1','6x^2 + 2',                0, 'Mathematics','hard',1);

-- Science - Easy
INSERT INTO questions (id, text, option_a, option_b, option_c, option_d, correct_answer, subject, difficulty, created_by) VALUES
(8,  'What is the chemical symbol for water?',                        'HO','H2O','H2O2','OH',                                 1, 'Science','easy',1),
(9,  'What planet is known as the Red Planet?',                       'Venus','Jupiter','Mars','Saturn',                       2, 'Science','easy',1),
(10, 'What gas do plants absorb from the atmosphere?',                'Oxygen','Nitrogen','Carbon Dioxide','Hydrogen',         2, 'Science','easy',1);

-- Science - Medium
INSERT INTO questions (id, text, option_a, option_b, option_c, option_d, correct_answer, subject, difficulty, created_by) VALUES
(11, 'What is the powerhouse of the cell?',                           'Nucleus','Ribosome','Mitochondria','Golgi Body',        2, 'Science','medium',1),
(12, 'What is the speed of light in vacuum (approximately)?',         '3 x 10^6 m/s','3 x 10^8 m/s','3 x 10^10 m/s','3 x 10^5 m/s', 1, 'Science','medium',1),
(13, 'Which element has the atomic number 6?',                        'Nitrogen','Oxygen','Carbon','Boron',                    2, 'Science','medium',1);

-- Science - Hard
INSERT INTO questions (id, text, option_a, option_b, option_c, option_d, correct_answer, subject, difficulty, created_by) VALUES
(14, 'What is the Heisenberg Uncertainty Principle about?',           'Energy conservation in quantum systems','Simultaneous measurement of position and momentum','Wave-particle duality of light','Quantization of electron orbits', 1, 'Science','hard',1);

-- Programming - Easy
INSERT INTO questions (id, text, option_a, option_b, option_c, option_d, correct_answer, subject, difficulty, created_by) VALUES
(15, 'Which keyword is used to declare a variable in JavaScript?',    'var','int','string','dim',                              0, 'Programming','easy',1),
(16, 'What does HTML stand for?',                                     'Hyper Text Markup Language','High Tech Modern Language','Hyper Transfer Markup Language','Home Tool Markup Language', 0, 'Programming','easy',1),
(17, 'Which symbol is used for single-line comments in JavaScript?',  '#','//','/*','--',                                      1, 'Programming','easy',1);

-- Programming - Medium
INSERT INTO questions (id, text, option_a, option_b, option_c, option_d, correct_answer, subject, difficulty, created_by) VALUES
(18, 'What is the time complexity of binary search?',                 'O(n)','O(log n)','O(n log n)','O(1)',                   1, 'Programming','medium',1),
(19, 'Which data structure uses FIFO (First In, First Out)?',         'Stack','Queue','Tree','Graph',                          1, 'Programming','medium',1),
(20, 'What does the ''this'' keyword refer to in JavaScript?',        'The current function','The global object always','The object that is executing the current function','The parent function', 2, 'Programming','medium',1);

-- Programming - Hard
INSERT INTO questions (id, text, option_a, option_b, option_c, option_d, correct_answer, subject, difficulty, created_by) VALUES
(21, 'What is a closure in JavaScript?',                              'A function that returns another function','A function bundled with its lexical environment','A self-invoking function','A function with no parameters', 1, 'Programming','hard',1),
(22, 'Which sorting algorithm has the best average-case time complexity?', 'Bubble Sort','Selection Sort','Merge Sort','Insertion Sort', 2, 'Programming','hard',1);

-- -----------------------------------------------------------
-- Exams
-- -----------------------------------------------------------
INSERT INTO exams (id, title, description, subject, duration, total_questions, passing_score, status, created_by, created_at, scheduled_at) VALUES
(1, 'Mathematics Fundamentals',
    'Test your knowledge of basic to intermediate mathematics concepts including arithmetic, algebra, and geometry.',
    'Mathematics', 30, 5, 60, 'active', 1, '2025-03-01 10:00:00', '2025-03-10 09:00:00'),
(2, 'Science General Knowledge',
    'A comprehensive science exam covering physics, chemistry, and biology fundamentals.',
    'Science', 25, 5, 50, 'active', 1, '2025-03-02 11:00:00', '2025-03-12 10:00:00'),
(3, 'Programming Basics',
    'Test your understanding of programming concepts, data structures, and algorithms.',
    'Programming', 20, 5, 60, 'draft', 1, '2025-03-05 08:00:00', '2025-03-20 14:00:00');

-- -----------------------------------------------------------
-- Exam ↔ Question mapping
-- -----------------------------------------------------------
INSERT INTO exam_questions (exam_id, question_id) VALUES
(1,1),(1,2),(1,3),(1,4),(1,5),
(2,8),(2,9),(2,10),(2,11),(2,12),
(3,15),(3,16),(3,17),(3,18),(3,19);
