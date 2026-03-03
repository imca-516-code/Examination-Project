package com.examportal.dao;

import com.examportal.model.ExamAttempt;
import com.examportal.model.ProctorLog;
import java.sql.*;
import java.util.*;

public class ExamAttemptDAO {

    /** Create a new attempt, store question order, and return the created attempt. */
    public ExamAttempt create(int examId, int studentId, int totalQuestions, List<Integer> questionOrder) {
        String sql = "INSERT INTO exam_attempts (exam_id, student_id, total_questions, status) VALUES (?,?,?,'in_progress')";
        try (Connection c = DBConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setInt(1, examId);
            ps.setInt(2, studentId);
            ps.setInt(3, totalQuestions);
            ps.executeUpdate();
            ResultSet keys = ps.getGeneratedKeys();
            if (keys.next()) {
                int attemptId = keys.getInt(1);
                insertQuestionOrder(c, attemptId, questionOrder);
                return findById(attemptId);
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return null;
    }

    /** Find attempt by ID with all related data. */
    public ExamAttempt findById(int id) {
        String sql = "SELECT * FROM exam_attempts WHERE id = ?";
        try (Connection c = DBConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                ExamAttempt a = mapRow(rs);
                a.setAnswers(loadAnswers(id));
                a.setQuestionOrder(loadQuestionOrder(id));
                a.setProctorLogs(new ProctorLogDAO().findByAttemptId(id));
                return a;
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return null;
    }

    /** Find in-progress attempt for student + exam. */
    public ExamAttempt findInProgress(int examId, int studentId) {
        String sql = "SELECT * FROM exam_attempts WHERE exam_id = ? AND student_id = ? AND status = 'in_progress' LIMIT 1";
        try (Connection c = DBConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setInt(1, examId);
            ps.setInt(2, studentId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                ExamAttempt a = mapRow(rs);
                a.setAnswers(loadAnswers(a.getId()));
                a.setQuestionOrder(loadQuestionOrder(a.getId()));
                a.setProctorLogs(new ProctorLogDAO().findByAttemptId(a.getId()));
                return a;
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return null;
    }

    /** Get all submitted attempts. */
    public List<ExamAttempt> findAllSubmitted() {
        return queryList("SELECT * FROM exam_attempts WHERE status = 'submitted' ORDER BY submitted_at DESC");
    }

    /** Get submitted attempts for a specific exam. */
    public List<ExamAttempt> findByExamId(int examId) {
        return queryList("SELECT * FROM exam_attempts WHERE exam_id = ? ORDER BY submitted_at DESC", examId);
    }

    /** Get all attempts for a student. */
    public List<ExamAttempt> findByStudentId(int studentId) {
        return queryList("SELECT * FROM exam_attempts WHERE student_id = ? ORDER BY started_at DESC", studentId);
    }

    /** Get submitted attempts for a student. */
    public List<ExamAttempt> findSubmittedByStudentId(int studentId) {
        return queryList("SELECT * FROM exam_attempts WHERE student_id = ? AND status = 'submitted' ORDER BY submitted_at DESC", studentId);
    }

    /** Save or update an answer for a given attempt + question. */
    public void saveAnswer(int attemptId, int questionId, int selectedAnswer) {
        String sql = "INSERT INTO attempt_answers (attempt_id, question_id, selected_answer) VALUES (?,?,?) " +
                     "ON DUPLICATE KEY UPDATE selected_answer = ?";
        try (Connection c = DBConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setInt(1, attemptId);
            ps.setInt(2, questionId);
            ps.setInt(3, selectedAnswer);
            ps.setInt(4, selectedAnswer);
            ps.executeUpdate();
        } catch (SQLException e) { e.printStackTrace(); }
    }

    /** Submit an attempt: calculate score, update record. */
    public void submit(int attemptId, double score, int totalCorrect) {
        String sql = "UPDATE exam_attempts SET status = 'submitted', submitted_at = NOW(), score = ?, total_correct = ? WHERE id = ?";
        try (Connection c = DBConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setDouble(1, score);
            ps.setInt(2, totalCorrect);
            ps.setInt(3, attemptId);
            ps.executeUpdate();
        } catch (SQLException e) { e.printStackTrace(); }
    }

    /** Average score of all submitted attempts. */
    public double averageScore() {
        String sql = "SELECT AVG(score) FROM exam_attempts WHERE status = 'submitted'";
        try (Connection c = DBConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next()) return rs.getDouble(1);
        } catch (SQLException e) { e.printStackTrace(); }
        return 0;
    }

    /** Count submitted attempts for a student. */
    public int countByStudent(int studentId) {
        String sql = "SELECT COUNT(*) FROM exam_attempts WHERE student_id = ? AND status = 'submitted'";
        try (Connection c = DBConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setInt(1, studentId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) return rs.getInt(1);
        } catch (SQLException e) { e.printStackTrace(); }
        return 0;
    }

    /** Average score for a student across submitted attempts. */
    public double averageScoreByStudent(int studentId) {
        String sql = "SELECT AVG(score) FROM exam_attempts WHERE student_id = ? AND status = 'submitted'";
        try (Connection c = DBConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setInt(1, studentId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) return rs.getDouble(1);
        } catch (SQLException e) { e.printStackTrace(); }
        return 0;
    }

    /** Check if a student has already submitted an attempt for an exam. */
    public boolean hasSubmittedAttempt(int examId, int studentId) {
        String sql = "SELECT COUNT(*) FROM exam_attempts WHERE exam_id = ? AND student_id = ? AND status = 'submitted'";
        try (Connection c = DBConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setInt(1, examId);
            ps.setInt(2, studentId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) return rs.getInt(1) > 0;
        } catch (SQLException e) { e.printStackTrace(); }
        return false;
    }

    // ---------- internal helpers ----------

    private void insertQuestionOrder(Connection c, int attemptId, List<Integer> questionOrder) throws SQLException {
        String sql = "INSERT INTO attempt_question_order (attempt_id, question_id, question_position) VALUES (?,?,?)";
        try (PreparedStatement ps = c.prepareStatement(sql)) {
            for (int i = 0; i < questionOrder.size(); i++) {
                ps.setInt(1, attemptId);
                ps.setInt(2, questionOrder.get(i));
                ps.setInt(3, i);
                ps.addBatch();
            }
            ps.executeBatch();
        }
    }

    private Map<Integer, Integer> loadAnswers(int attemptId) {
        Map<Integer, Integer> map = new HashMap<>();
        String sql = "SELECT question_id, selected_answer FROM attempt_answers WHERE attempt_id = ?";
        try (Connection c = DBConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setInt(1, attemptId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) map.put(rs.getInt("question_id"), rs.getInt("selected_answer"));
        } catch (SQLException e) { e.printStackTrace(); }
        return map;
    }

    private List<Integer> loadQuestionOrder(int attemptId) {
        List<Integer> order = new ArrayList<>();
        String sql = "SELECT question_id FROM attempt_question_order WHERE attempt_id = ? ORDER BY question_position";
        try (Connection c = DBConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setInt(1, attemptId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) order.add(rs.getInt("question_id"));
        } catch (SQLException e) { e.printStackTrace(); }
        return order;
    }

    private List<ExamAttempt> queryList(String sql, Object... params) {
        List<ExamAttempt> list = new ArrayList<>();
        try (Connection c = DBConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            for (int i = 0; i < params.length; i++) ps.setObject(i + 1, params[i]);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) list.add(mapRow(rs));
        } catch (SQLException e) { e.printStackTrace(); }
        return list;
    }

    private ExamAttempt mapRow(ResultSet rs) throws SQLException {
        ExamAttempt a = new ExamAttempt();
        a.setId(rs.getInt("id"));
        a.setExamId(rs.getInt("exam_id"));
        a.setStudentId(rs.getInt("student_id"));
        a.setStartedAt(rs.getTimestamp("started_at"));
        a.setSubmittedAt(rs.getTimestamp("submitted_at"));
        double score = rs.getDouble("score");
        a.setScore(rs.wasNull() ? null : score);
        int tc = rs.getInt("total_correct");
        a.setTotalCorrect(rs.wasNull() ? null : tc);
        a.setTotalQuestions(rs.getInt("total_questions"));
        a.setStatus(rs.getString("status"));
        return a;
    }
}
