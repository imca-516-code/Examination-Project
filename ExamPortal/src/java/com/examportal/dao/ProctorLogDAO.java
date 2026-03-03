package com.examportal.dao;

import com.examportal.model.ProctorLog;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ProctorLogDAO {

    public void insert(int attemptId, String eventType, String description) {
        String sql = "INSERT INTO proctor_logs (attempt_id, event_type, description) VALUES (?,?,?)";
        try (Connection c = DBConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setInt(1, attemptId);
            ps.setString(2, eventType);
            ps.setString(3, description);
            ps.executeUpdate();
        } catch (SQLException e) { e.printStackTrace(); }
    }

    public List<ProctorLog> findByAttemptId(int attemptId) {
        List<ProctorLog> list = new ArrayList<>();
        String sql = "SELECT * FROM proctor_logs WHERE attempt_id = ? ORDER BY timestamp";
        try (Connection c = DBConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setInt(1, attemptId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                ProctorLog log = new ProctorLog();
                log.setId(rs.getInt("id"));
                log.setAttemptId(rs.getInt("attempt_id"));
                log.setEventType(rs.getString("event_type"));
                log.setTimestamp(rs.getTimestamp("timestamp"));
                log.setDescription(rs.getString("description"));
                list.add(log);
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return list;
    }

    public int countByAttemptId(int attemptId) {
        String sql = "SELECT COUNT(*) FROM proctor_logs WHERE attempt_id = ?";
        try (Connection c = DBConnection.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setInt(1, attemptId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) return rs.getInt(1);
        } catch (SQLException e) { e.printStackTrace(); }
        return 0;
    }
}
