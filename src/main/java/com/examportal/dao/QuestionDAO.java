package com.examportal.dao;

import com.examportal.models.Question;
import com.examportal.util.DatabaseConnection;
import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class QuestionDAO {
    
    /**
     * Create a new question
     */
    public int createQuestion(Question question) {
        String sql = "INSERT INTO questions (title, description, question_type, options, correct_answer, " +
                     "explanation, difficulty_level, category, created_by) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            stmt.setString(1, question.getTitle());
            stmt.setString(2, question.getDescription());
            stmt.setString(3, question.getQuestionType());
            stmt.setString(4, question.getOptionsAsJson());
            stmt.setString(5, question.getCorrectAnswer());
            stmt.setString(6, question.getExplanation());
            stmt.setString(7, question.getDifficultyLevel());
            stmt.setString(8, question.getCategory());
            stmt.setInt(9, question.getCreatedBy());
            
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
     * Get question by ID
     */
    public Question getQuestionById(int questionId) {
        String sql = "SELECT * FROM questions WHERE id = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, questionId);
            ResultSet rs = stmt.executeQuery();
            
            if (rs.next()) {
                return mapResultSetToQuestion(rs);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Get all questions
     */
    public List<Question> getAllQuestions() {
        List<Question> questions = new ArrayList<>();
        String sql = "SELECT * FROM questions ORDER BY created_at DESC";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                questions.add(mapResultSetToQuestion(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return questions;
    }

    /**
     * Get questions by category
     */
    public List<Question> getQuestionsByCategory(String category) {
        List<Question> questions = new ArrayList<>();
        String sql = "SELECT * FROM questions WHERE category = ? ORDER BY created_at DESC";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, category);
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                questions.add(mapResultSetToQuestion(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return questions;
    }

    /**
     * Get questions by difficulty
     */
    public List<Question> getQuestionsByDifficulty(String difficulty) {
        List<Question> questions = new ArrayList<>();
        String sql = "SELECT * FROM questions WHERE difficulty_level = ? ORDER BY created_at DESC";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, difficulty);
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                questions.add(mapResultSetToQuestion(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return questions;
    }

    /**
     * Get questions created by user
     */
    public List<Question> getQuestionsByCreator(int createdBy) {
        List<Question> questions = new ArrayList<>();
        String sql = "SELECT * FROM questions WHERE created_by = ? ORDER BY created_at DESC";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, createdBy);
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                questions.add(mapResultSetToQuestion(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return questions;
    }

    /**
     * Update question
     */
    public boolean updateQuestion(Question question) {
        String sql = "UPDATE questions SET title = ?, description = ?, question_type = ?, " +
                     "options = ?, correct_answer = ?, explanation = ?, difficulty_level = ?, category = ? WHERE id = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setString(1, question.getTitle());
            stmt.setString(2, question.getDescription());
            stmt.setString(3, question.getQuestionType());
            stmt.setString(4, question.getOptionsAsJson());
            stmt.setString(5, question.getCorrectAnswer());
            stmt.setString(6, question.getExplanation());
            stmt.setString(7, question.getDifficultyLevel());
            stmt.setString(8, question.getCategory());
            stmt.setInt(9, question.getId());
            
            stmt.executeUpdate();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    /**
     * Delete question
     */
    public boolean deleteQuestion(int questionId) {
        String sql = "DELETE FROM questions WHERE id = ?";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            stmt.setInt(1, questionId);
            stmt.executeUpdate();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    /**
     * Get all categories
     */
    public List<String> getAllCategories() {
        List<String> categories = new ArrayList<>();
        String sql = "SELECT DISTINCT category FROM questions WHERE category IS NOT NULL ORDER BY category";
        
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                categories.add(rs.getString("category"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return categories;
    }

    /**
     * Map ResultSet to Question object
     */
    private Question mapResultSetToQuestion(ResultSet rs) throws SQLException {
        Question question = new Question();
        question.setId(rs.getInt("id"));
        question.setTitle(rs.getString("title"));
        question.setDescription(rs.getString("description"));
        question.setQuestionType(rs.getString("question_type"));
        question.setCorrectAnswer(rs.getString("correct_answer"));
        question.setExplanation(rs.getString("explanation"));
        question.setDifficultyLevel(rs.getString("difficulty_level"));
        question.setCategory(rs.getString("category"));
        question.setCreatedBy(rs.getInt("created_by"));
        
        String optionsJson = rs.getString("options");
        if (optionsJson != null) {
            question.setOptionsFromJson(optionsJson);
        }
        
        Timestamp createdAt = rs.getTimestamp("created_at");
        if (createdAt != null) {
            question.setCreatedAt(createdAt.toLocalDateTime());
        }
        
        Timestamp updatedAt = rs.getTimestamp("updated_at");
        if (updatedAt != null) {
            question.setUpdatedAt(updatedAt.toLocalDateTime());
        }
        
        return question;
    }
}
