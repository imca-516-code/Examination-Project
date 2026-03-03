# ExamPortal Java/JSP - Deployment Guide

## Project Overview

**ExamPortal** is now fully converted from React/Next.js to Java/JSP with MySQL backend. This is a complete online examination system with student and admin portals.

### Key Features
- User authentication (student & admin roles)
- Exam creation and management
- Question bank system
- Online exam taking with timer
- Automatic grading
- Results and analytics
- Proctoring logs support
- Session-based security

## Technology Stack

- **Backend**: Java 17 with Jakarta Servlet API 6.0
- **Frontend**: JSP with HTML/CSS (no external JS frameworks)
- **Database**: MySQL 8.0+
- **Build Tool**: Maven 3.8+
- **Server**: Apache Tomcat 10.1+

## Prerequisites

1. **Java Development Kit (JDK) 17+**
   ```bash
   java -version
   ```

2. **Maven 3.8+**
   ```bash
   mvn -version
   ```

3. **MySQL Server 8.0+**
   ```bash
   mysql --version
   ```

4. **Apache Tomcat 10.1+**
   - Download from: https://tomcat.apache.org/download-10.cgi

## Installation Steps

### Step 1: Setup Database

```bash
# Connect to MySQL
mysql -u root -p

# Execute schema and seed scripts
mysql> SOURCE /path/to/scripts/01-create-schema.sql;
mysql> SOURCE /path/to/scripts/02-seed-data.sql;

# Verify database creation
mysql> USE exam_portal;
mysql> SHOW TABLES;
```

### Step 2: Configure Database Connection

Edit `/src/main/java/com/examportal/util/DatabaseConnection.java`:

```java
private static final String URL = "jdbc:mysql://localhost:3306/exam_portal";
private static final String USER = "root";
private static final String PASSWORD = "your_mysql_password"; // Update this
```

Also update `web.xml` context parameters in `/src/main/webapp/WEB-INF/web.xml`.

### Step 3: Build the Project

```bash
# Navigate to project directory
cd /path/to/exam-portal

# Clean and build
mvn clean package

# Output WAR file
# target/exam-portal.war
```

### Step 4: Deploy to Tomcat

**Option A: Copy WAR File**
```bash
# Copy WAR to Tomcat webapps
cp target/exam-portal.war $CATALINA_HOME/webapps/

# Start Tomcat
$CATALINA_HOME/bin/startup.sh

# Application will be available at:
# http://localhost:8080/exam-portal
```

**Option B: Maven Tomcat Plugin**
```bash
# Run directly
mvn tomcat7:run

# Application at: http://localhost:8080/exam-portal
```

## Project Structure

```
exam-portal/
├── src/main/java/com/examportal/
│   ├── models/              # Data models
│   │   ├── User.java
│   │   ├── Question.java
│   │   ├── Exam.java
│   │   └── ExamAttempt.java
│   ├── dao/                 # Database access
│   │   ├── UserDAO.java
│   │   ├── QuestionDAO.java
│   │   ├── ExamDAO.java
│   │   ├── ExamAttemptDAO.java
│   │   └── AnswerDAO.java
│   ├── servlets/            # HTTP handlers
│   │   ├── LoginServlet.java
│   │   ├── RegisterServlet.java
│   │   ├── ExamServlet.java
│   │   ├── AttemptServlet.java
│   │   ├── ResultServlet.java
│   │   ├── AdminExamServlet.java
│   │   └── AdminStudentServlet.java
│   ├── filters/             # Security
│   │   └── AuthFilter.java
│   └── util/                # Utilities
│       ├── DatabaseConnection.java
│       └── PasswordUtil.java
├── src/main/webapp/
│   ├── WEB-INF/
│   │   ├── jsp/             # JSP views
│   │   │   ├── auth/        # Login & register
│   │   │   ├── dashboard/   # Student pages
│   │   │   ├── admin/       # Admin pages
│   │   │   ├── includes/    # Reusable components
│   │   │   └── error/       # Error pages
│   │   └── web.xml          # Deployment descriptor
│   └── css/                 # Static CSS (optional)
├── scripts/
│   ├── 01-create-schema.sql
│   └── 02-seed-data.sql
├── pom.xml                  # Maven configuration
└── README.md
```

## User Roles & Access

### Student Account
- **Email**: john.student@example.com
- **Password**: student123
- **Access**: Dashboard, take exams, view results

### Admin Account
- **Email**: admin@example.com
- **Password**: admin123
- **Access**: Manage exams, questions, students, view analytics

## Key Endpoints

### Authentication
- `GET/POST /login` - Login page
- `GET/POST /register` - Registration page
- `GET /logout` - Logout

### Student Dashboard
- `GET /dashboard/exams` - Available exams & attempts
- `GET /dashboard/attempt/{id}` - Take exam
- `GET /dashboard/result/{id}` - View exam results

### Admin Panel
- `GET /admin/exams` - Manage exams
- `GET /admin/questions` - Manage questions
- `GET /admin/students` - Manage students
- `GET /admin/results` - View analytics

## Database Schema

### Users Table
- `id` - Primary key
- `email` - Unique email address
- `password_hash` - BCrypt hashed password
- `first_name`, `last_name` - User names
- `role` - 'student' or 'admin'
- `created_at`, `updated_at` - Timestamps

### Exams Table
- `id` - Primary key
- `title`, `description` - Exam details
- `duration_minutes` - Time limit
- `total_questions` - Question count
- `passing_percentage` - Pass threshold
- `status` - 'draft', 'published', 'archived'
- `proctoring_enabled` - Security feature
- `allow_navigation` - Question navigation
- `created_by` - Admin who created it

### Questions Table
- `id` - Primary key
- `title`, `description` - Question text
- `question_type` - 'multiple-choice' or 'short-answer'
- `options` - JSON array of options
- `correct_answer` - Answer for auto-grading
- `difficulty_level` - 'easy', 'medium', 'hard'
- `category` - Question category

### Exam Attempts Table
- `id` - Primary key
- `exam_id`, `user_id` - Foreign keys
- `start_time`, `end_time`, `submitted_at` - Timestamps
- `score`, `total_marks` - Grading info
- `percentage_score` - Final score
- `status` - 'in-progress', 'submitted', 'graded', 'abandoned'

### Exam Answers Table
- `id` - Primary key
- `attempt_id`, `question_id` - Foreign keys
- `user_answer` - Student's response
- `is_correct` - Auto-graded result
- `marks_obtained` - Points earned
- `answered_at` - Answer timestamp

## Security Features

1. **Password Hashing**: BCrypt with salt rounds
2. **Session Management**: HTTP-only cookies, 30-minute timeout
3. **Authentication Filter**: Protects `/dashboard/*` and `/admin/*` routes
4. **Role-Based Access**: Admin-only actions checked in filters
5. **SQL Injection Prevention**: PreparedStatements for all queries
6. **CSRF Protection**: Form-based submissions with sessions

## Configuration Files

### web.xml
Located at: `/src/main/webapp/WEB-INF/web.xml`

Configure:
- Database connection parameters
- Session timeout (default: 30 minutes)
- Welcome pages
- Error page mappings

### pom.xml
Located at: `/pom.xml`

Dependencies managed:
- Jakarta Servlet API
- Jakarta JSP API
- MySQL Connector
- BCrypt
- GSON (JSON processing)

## Troubleshooting

### Database Connection Failed
1. Verify MySQL is running: `mysql -u root -p`
2. Check credentials in `DatabaseConnection.java`
3. Ensure database `exam_portal` exists: `SHOW DATABASES;`

### Tomcat Deployment Issues
1. Check logs: `$CATALINA_HOME/logs/catalina.out`
2. Verify WAR file: `$CATALINA_HOME/webapps/exam-portal/`
3. Check port 8080 is available: `lsof -i :8080`

### JSP Compilation Errors
1. Verify Java version: `java -version` (should be 17+)
2. Clean build: `mvn clean package`
3. Check JSP syntax in `/WEB-INF/jsp/`

### Performance Optimization
1. Enable connection pooling (future enhancement)
2. Add database indexes for frequently queried columns
3. Cache static resources (CSS, images)
4. Consider page caching for admin pages

## API Endpoints for Integration

### Login API
```
POST /login
Content-Type: application/x-www-form-urlencoded

email=user@example.com&password=password123
```

### Get Exams
```
GET /dashboard/exams
Authorization: Session Cookie
```

### Submit Answer
```
POST /api/answer
Content-Type: application/x-www-form-urlencoded

attemptId=1&questionId=5&answer=OptionA
```

## Backup & Maintenance

### Database Backup
```bash
mysqldump -u root -p exam_portal > exam_portal_backup.sql
```

### Database Restore
```bash
mysql -u root -p exam_portal < exam_portal_backup.sql
```

### Clean Tomcat Cache
```bash
rm -rf $CATALINA_HOME/work/Catalina/localhost/exam-portal
```

## Future Enhancements

1. **Connection Pooling**: Implement HikariCP for better performance
2. **Caching**: Add Redis for session and result caching
3. **API Layer**: RESTful API with JSON responses
4. **File Uploads**: Support image/document question types
5. **Email Notifications**: Exam results via email
6. **Analytics Dashboard**: Detailed exam analytics
7. **Mobile App**: Native Android/iOS applications
8. **Docker Support**: Containerize for cloud deployment

## Support & Documentation

- **Java Documentation**: https://docs.oracle.com/en/java/
- **Jakarta EE**: https://jakarta.ee/
- **MySQL Documentation**: https://dev.mysql.com/doc/
- **Tomcat Documentation**: https://tomcat.apache.org/

## License

This project is provided as-is for educational purposes.

---

**Deployment Date**: March 2026
**Java Version**: 17+
**MySQL Version**: 8.0+
**Tomcat Version**: 10.1+
