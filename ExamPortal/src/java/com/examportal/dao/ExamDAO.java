package com.examportal.dao;

import com.examportal.model.Exam;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ExamDAO {

    public List<Exam> findAll() {
        List<Exam> list = new ArrayList<>();
        String sql = "SELECT * FROM exams ORDER BY created_at DESC";
        try (Connection c = DBConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) list.add(mapRow(rs));
        } catch (SQLException e) { e.printStackTrace(); }
        return list;
    }

    public List<Exam> findActive() {
        List<Exam> list = new ArrayList<>();
        String sql = "SELECT * FROM exams WHERE status = 'active' ORDER BY created_at DESC";
        try (Connection c = DBConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) list.add(mapRow(rs));
        } catch (SQLException e) { e.printStackTrace(); }
        return list;
    }

    public Exam findById(int id) {
        String sql = "SELECT * FROM exams WHERE id = ?";
        try (Connection c = DBConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) return mapRow(rs);
        } catch (SQLException e) { e.printStackTrace(); }
        return null;
    }

    public int insert(Exam exam) {
        String sql = "INSERT INTO exams (title, description, subject, duration, total_questions, passing_score, status, created_by, scheduled_at) VALUES (?,?,?,?,?,?,?,?,?)";
        try (Connection c = DBConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, exam.getTitle());
            ps.setString(2, exam.getDescription());
            ps.setString(3, exam.getSubject());
            ps.setInt(4, exam.getDuration());
            ps.setInt(5, exam.getTotalQuestions());
            ps.setInt(6, exam.getPassingScore());
            ps.setString(7, exam.getStatus());
            ps.setInt(8, exam.getCreatedBy());
            ps.setTimestamp(9, exam.getScheduledAt());
            ps.executeUpdate();
            ResultSet keys = ps.getGeneratedKeys();
            if (keys.next()) {
                int examId = keys.getInt(1);
                // Insert question mappings
                insertQuestionMappings(c, examId, exam.getQuestionIds());
                return examId;
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return -1;
    }

    public void delete(int id) {
        String sql = "DELETE FROM exams WHERE id = ?";
        try (Connection c = DBConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setInt(1, id);
            ps.executeUpdate();
        } catch (SQLException e) { e.printStackTrace(); }
    }

    public void updateStatus(int id, String status) {
        String sql = "UPDATE exams SET status = ? WHERE id = ?";
        try (Connection c = DBConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, status);
            ps.setInt(2, id);
            ps.executeUpdate();
        } catch (SQLException e) { e.printStackTrace(); }
    }

    public int count() {
        String sql = "SELECT COUNT(*) FROM exams";
        try (Connection c = DBConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next()) return rs.getInt(1);
        } catch (SQLException e) { e.printStackTrace(); }
        return 0;
    }

    /** Get question IDs linked to an exam. */
    public List<Integer> getQuestionIds(int examId) {
        List<Integer> ids = new ArrayList<>();
        String sql = "SELECT question_id FROM exam_questions WHERE exam_id = ?";
        try (Connection c = DBConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setInt(1, examId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) ids.add(rs.getInt("question_id"));
        } catch (SQLException e) { e.printStackTrace(); }
        return ids;
    }

    // ----- internal -----

    private void insertQuestionMappings(Connection c, int examId, List<Integer> questionIds) throws SQLException {
        if (questionIds == null || questionIds.isEmpty()) return;
        String sql = "INSERT INTO exam_questions (exam_id, question_id) VALUES (?, ?)";
        try (PreparedStatement ps = c.prepareStatement(sql)) {
            for (int qId : questionIds) {
                ps.setInt(1, examId);
                ps.setInt(2, qId);
                ps.addBatch();
            }
            ps.executeBatch();
        }
    }

    private Exam mapRow(ResultSet rs) throws SQLException {
        Exam e = new Exam();
        e.setId(rs.getInt("id"));
        e.setTitle(rs.getString("title"));
        e.setDescription(rs.getString("description"));
        e.setSubject(rs.getString("subject"));
        e.setDuration(rs.getInt("duration"));
        e.setTotalQuestions(rs.getInt("total_questions"));
        e.setPassingScore(rs.getInt("passing_score"));
        e.setStatus(rs.getString("status"));
        e.setCreatedBy(rs.getInt("created_by"));
        e.setCreatedAt(rs.getTimestamp("created_at"));
        e.setScheduledAt(rs.getTimestamp("scheduled_at"));
        // Load question IDs
        e.setQuestionIds(getQuestionIds(e.getId()));
        return e;
    }
}
