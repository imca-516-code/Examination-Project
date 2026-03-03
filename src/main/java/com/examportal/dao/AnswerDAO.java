package com.examportal.dao;

import com.examportal.util.DatabaseConnection;
import java.sql.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

public class AnswerDAO {
    
    /**
     * Save an answer for a question in an attempt
     */
    public boolean saveAnswer(int attemptId, int questionId, String userAnswer) {
        // Check if answer already exists
        ExamAnswer existing = getAnswer(attemptId, questionId);
        
        if (existing != null) {
            // Update existing answer
            return updateAnswer(attemptId, questionId, userAnswer);
        } else {
            // Insert new answer
            String sql = "INSERT INTO exam_answers (attempt_id, question_id, user_answer, answered_at) " +
                         "VALUES (?, ?, ?, NOW())";
            
            try (Connection conn = DatabaseConnection.getConnection();
                 PreparedStatement stmt = conn.prepareStatement(sql)) {
                
                stmt.setInt(1, attemptId);
                stmt.setInt(2, questionId);
                stmt.setString(3, userAnswer);
                
                stmt.executeUpdate();
                return true;
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return false;
    }

    /**
     * Update an answer
     */
    private boolean updateAnswer(int attemptId, int questionId, String userAnswer) {
        String sql = "UPDATE exam_answers SET user_answer = ?, answered_at = NOW() " +
                     "WHERE attempt_id = ? AND question_id = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, userAnswer);
            stmt.setInt(2, attemptId);
            stmt.setInt(3, questionId);
            
            stmt.executeUpdate();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    /**
     * Get answer for a question
     */
    public ExamAnswer getAnswer(int attemptId, int questionId) {
        String sql = "SELECT * FROM exam_answers WHERE attempt_id = ? AND question_id = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, attemptId);
            stmt.setInt(2, questionId);
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                return mapResultSetToAnswer(rs);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Get all answers for an attempt
     */
    public Map<Integer, ExamAnswer> getAttemptAnswers(int attemptId) {
        Map<Integer, ExamAnswer> answers = new HashMap<>();
        String sql = "SELECT * FROM exam_answers WHERE attempt_id = ? ORDER BY question_id";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, attemptId);
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                ExamAnswer answer = mapResultSetToAnswer(rs);
                answers.put(answer.questionId, answer);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return answers;
    }

    /**
     * Grade answer
     */
    public boolean gradeAnswer(int attemptId, int questionId, boolean isCorrect, int marks) {
        String sql = "UPDATE exam_answers SET is_correct = ?, marks_obtained = ? " +
                     "WHERE attempt_id = ? AND question_id = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setBoolean(1, isCorrect);
            stmt.setInt(2, marks);
            stmt.setInt(3, attemptId);
            stmt.setInt(4, questionId);
            
            stmt.executeUpdate();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    /**
     * Get graded answers for attempt
     */
    public Map<Integer, Integer> getGradedAnswers(int attemptId) {
        Map<Integer, Integer> gradedAnswers = new HashMap<>();
        String sql = "SELECT question_id, marks_obtained FROM exam_answers WHERE attempt_id = ? AND is_correct IS NOT NULL";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, attemptId);
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                gradedAnswers.put(rs.getInt("question_id"), rs.getInt("marks_obtained"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return gradedAnswers;
    }

    /**
     * Map ResultSet to ExamAnswer object
     */
    private ExamAnswer mapResultSetToAnswer(ResultSet rs) throws SQLException {
        ExamAnswer answer = new ExamAnswer();
        answer.id = rs.getInt("id");
        answer.attemptId = rs.getInt("attempt_id");
        answer.questionId = rs.getInt("question_id");
        answer.userAnswer = rs.getString("user_answer");
        answer.marksObtained = rs.getInt("marks_obtained");
        
        Boolean isCorrect = (Boolean) rs.getObject("is_correct");
        if (isCorrect != null) {
            answer.isCorrect = isCorrect;
        }
        
        Timestamp answeredAt = rs.getTimestamp("answered_at");
        if (answeredAt != null) {
            answer.answeredAt = answeredAt.toLocalDateTime();
        }
        
        return answer;
    }

    /**
     * Inner class for ExamAnswer
     */
    public static class ExamAnswer {
        public int id;
        public int attemptId;
        public int questionId;
        public String userAnswer;
        public Boolean isCorrect;
        public int marksObtained;
        public LocalDateTime answeredAt;
    }
}
