package com.examportal.dao;

import com.examportal.models.Exam;
import com.examportal.util.DatabaseConnection;
import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ExamDAO {
    
    /**
     * Create a new exam
     */
    public int createExam(Exam exam) {
        String sql = "INSERT INTO exams (title, description, duration_minutes, total_questions, " +
                     "passing_percentage, status, proctoring_enabled, allow_navigation, created_by) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            stmt.setString(1, exam.getTitle());
            stmt.setString(2, exam.getDescription());
            stmt.setInt(3, exam.getDurationMinutes());
            stmt.setInt(4, exam.getTotalQuestions());
            stmt.setInt(5, exam.getPassingPercentage());
            stmt.setString(6, exam.getStatus());
            stmt.setBoolean(7, exam.isProctoringEnabled());
            stmt.setBoolean(8, exam.isAllowNavigation());
            stmt.setInt(9, exam.getCreatedBy());
            
            stmt.executeUpdate();
            
            ResultSet rs = stmt.getGeneratedKeys();
            if (rs.next()) {
                return rs.getInt(1);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return -1;
    }

    /**
     * Get exam by ID
     */
    public Exam getExamById(int examId) {
        String sql = "SELECT * FROM exams WHERE id = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, examId);
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                return mapResultSetToExam(rs);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Get all published exams
     */
    public List<Exam> getPublishedExams() {
        List<Exam> exams = new ArrayList<>();
        String sql = "SELECT * FROM exams WHERE status = 'published' ORDER BY created_at DESC";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                exams.add(mapResultSetToExam(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return exams;
    }

    /**
     * Get all exams (for admin)
     */
    public List<Exam> getAllExams() {
        List<Exam> exams = new ArrayList<>();
        String sql = "SELECT * FROM exams ORDER BY created_at DESC";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                exams.add(mapResultSetToExam(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return exams;
    }

    /**
     * Get exams created by a specific user
     */
    public List<Exam> getExamsByCreator(int createdBy) {
        List<Exam> exams = new ArrayList<>();
        String sql = "SELECT * FROM exams WHERE created_by = ? ORDER BY created_at DESC";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, createdBy);
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                exams.add(mapResultSetToExam(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return exams;
    }

    /**
     * Update exam
     */
    public boolean updateExam(Exam exam) {
        String sql = "UPDATE exams SET title = ?, description = ?, duration_minutes = ?, " +
                     "total_questions = ?, passing_percentage = ?, status = ?, " +
                     "proctoring_enabled = ?, allow_navigation = ? WHERE id = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, exam.getTitle());
            stmt.setString(2, exam.getDescription());
            stmt.setInt(3, exam.getDurationMinutes());
            stmt.setInt(4, exam.getTotalQuestions());
            stmt.setInt(5, exam.getPassingPercentage());
            stmt.setString(6, exam.getStatus());
            stmt.setBoolean(7, exam.isProctoringEnabled());
            stmt.setBoolean(8, exam.isAllowNavigation());
            stmt.setInt(9, exam.getId());
            
            stmt.executeUpdate();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    /**
     * Delete exam
     */
    public boolean deleteExam(int examId) {
        String sql = "DELETE FROM exams WHERE id = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, examId);
            stmt.executeUpdate();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    /**
     * Add question to exam
     */
    public boolean addQuestionToExam(int examId, int questionId, int order) {
        String sql = "INSERT INTO exam_questions (exam_id, question_id, question_order) VALUES (?, ?, ?)";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, examId);
            stmt.setInt(2, questionId);
            stmt.setInt(3, order);
            
            stmt.executeUpdate();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    /**
     * Get questions for exam
     */
    public List<Integer> getExamQuestionIds(int examId) {
        List<Integer> questionIds = new ArrayList<>();
        String sql = "SELECT question_id FROM exam_questions WHERE exam_id = ? ORDER BY question_order ASC";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, examId);
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                questionIds.add(rs.getInt("question_id"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return questionIds;
    }

    /**
     * Map ResultSet to Exam object
     */
    private Exam mapResultSetToExam(ResultSet rs) throws SQLException {
        Exam exam = new Exam();
        exam.setId(rs.getInt("id"));
        exam.setTitle(rs.getString("title"));
        exam.setDescription(rs.getString("description"));
        exam.setDurationMinutes(rs.getInt("duration_minutes"));
        exam.setTotalQuestions(rs.getInt("total_questions"));
        exam.setPassingPercentage(rs.getInt("passing_percentage"));
        exam.setStatus(rs.getString("status"));
        exam.setProctoringEnabled(rs.getBoolean("proctoring_enabled"));
        exam.setAllowNavigation(rs.getBoolean("allow_navigation"));
        exam.setCreatedBy(rs.getInt("created_by"));
        
        Timestamp createdAt = rs.getTimestamp("created_at");
        if (createdAt != null) {
            exam.setCreatedAt(createdAt.toLocalDateTime());
        }
        
        Timestamp updatedAt = rs.getTimestamp("updated_at");
        if (updatedAt != null) {
            exam.setUpdatedAt(updatedAt.toLocalDateTime());
        }
        
        return exam;
    }
}
