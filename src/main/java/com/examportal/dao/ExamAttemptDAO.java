package com.examportal.dao;

import com.examportal.models.ExamAttempt;
import com.examportal.util.DatabaseConnection;
import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.math.BigDecimal;

public class ExamAttemptDAO {
    
    /**
     * Create a new exam attempt
     */
    public int createAttempt(int examId, int userId) {
        String sql = "INSERT INTO exam_attempts (exam_id, user_id, start_time, status) VALUES (?, ?, NOW(), 'in-progress')";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            stmt.setInt(1, examId);
            stmt.setInt(2, userId);
            
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
     * Get attempt by ID
     */
    public ExamAttempt getAttemptById(int attemptId) {
        String sql = "SELECT * FROM exam_attempts WHERE id = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, attemptId);
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                return mapResultSetToAttempt(rs);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Get attempts for a user
     */
    public List<ExamAttempt> getAttemptsByUser(int userId) {
        List<ExamAttempt> attempts = new ArrayList<>();
        String sql = "SELECT * FROM exam_attempts WHERE user_id = ? ORDER BY created_at DESC";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, userId);
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                attempts.add(mapResultSetToAttempt(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return attempts;
    }

    /**
     * Get attempts for an exam
     */
    public List<ExamAttempt> getAttemptsByExam(int examId) {
        List<ExamAttempt> attempts = new ArrayList<>();
        String sql = "SELECT * FROM exam_attempts WHERE exam_id = ? ORDER BY created_at DESC";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, examId);
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                attempts.add(mapResultSetToAttempt(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return attempts;
    }

    /**
     * Get ongoing attempt for user and exam
     */
    public ExamAttempt getOngoingAttempt(int examId, int userId) {
        String sql = "SELECT * FROM exam_attempts WHERE exam_id = ? AND user_id = ? AND status = 'in-progress'";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, examId);
            stmt.setInt(2, userId);
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                return mapResultSetToAttempt(rs);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Submit exam attempt
     */
    public boolean submitAttempt(int attemptId) {
        String sql = "UPDATE exam_attempts SET status = 'submitted', submitted_at = NOW() WHERE id = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, attemptId);
            stmt.executeUpdate();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    /**
     * Grade exam attempt
     */
    public boolean gradeAttempt(int attemptId, int score, int totalMarks, BigDecimal percentage) {
        String sql = "UPDATE exam_attempts SET score = ?, total_marks = ?, percentage_score = ?, " +
                     "status = 'graded', end_time = NOW() WHERE id = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, score);
            stmt.setInt(2, totalMarks);
            stmt.setBigDecimal(3, percentage);
            stmt.setInt(4, attemptId);
            
            stmt.executeUpdate();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    /**
     * Abandon attempt
     */
    public boolean abandonAttempt(int attemptId) {
        String sql = "UPDATE exam_attempts SET status = 'abandoned', end_time = NOW() WHERE id = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, attemptId);
            stmt.executeUpdate();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    /**
     * Get statistics for an exam
     */
    public ExamStatistics getExamStatistics(int examId) {
        String sql = "SELECT COUNT(*) as total_attempts, AVG(percentage_score) as avg_score, " +
                     "MAX(percentage_score) as max_score, MIN(percentage_score) as min_score " +
                     "FROM exam_attempts WHERE exam_id = ? AND status = 'graded'";
        
        ExamStatistics stats = new ExamStatistics();
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, examId);
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                stats.totalAttempts = rs.getInt("total_attempts");
                stats.averageScore = rs.getBigDecimal("avg_score");
                stats.maxScore = rs.getBigDecimal("max_score");
                stats.minScore = rs.getBigDecimal("min_score");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return stats;
    }

    /**
     * Map ResultSet to ExamAttempt object
     */
    private ExamAttempt mapResultSetToAttempt(ResultSet rs) throws SQLException {
        ExamAttempt attempt = new ExamAttempt();
        attempt.setId(rs.getInt("id"));
        attempt.setExamId(rs.getInt("exam_id"));
        attempt.setUserId(rs.getInt("user_id"));
        attempt.setStatus(rs.getString("status"));
        
        Timestamp startTime = rs.getTimestamp("start_time");
        if (startTime != null) {
            attempt.setStartTime(startTime.toLocalDateTime());
        }
        
        Timestamp endTime = rs.getTimestamp("end_time");
        if (endTime != null) {
            attempt.setEndTime(endTime.toLocalDateTime());
        }
        
        Timestamp submittedAt = rs.getTimestamp("submitted_at");
        if (submittedAt != null) {
            attempt.setSubmittedAt(submittedAt.toLocalDateTime());
        }
        
        Integer score = rs.getInt("score");
        if (!rs.wasNull()) {
            attempt.setScore(score);
        }
        
        Integer totalMarks = rs.getInt("total_marks");
        if (!rs.wasNull()) {
            attempt.setTotalMarks(totalMarks);
        }
        
        BigDecimal percentage = rs.getBigDecimal("percentage_score");
        if (percentage != null) {
            attempt.setPercentageScore(percentage);
        }
        
        Timestamp createdAt = rs.getTimestamp("created_at");
        if (createdAt != null) {
            attempt.setCreatedAt(createdAt.toLocalDateTime());
        }
        
        Timestamp updatedAt = rs.getTimestamp("updated_at");
        if (updatedAt != null) {
            attempt.setUpdatedAt(updatedAt.toLocalDateTime());
        }
        
        return attempt;
    }

    /**
     * Inner class for exam statistics
     */
    public static class ExamStatistics {
        public int totalAttempts;
        public BigDecimal averageScore;
        public BigDecimal maxScore;
        public BigDecimal minScore;
    }
}
