package com.examportal.model;

import java.sql.Timestamp;

public class ProctorLog {
    private int id;
    private int attemptId;
    private String eventType;  // tab_switch, focus_loss, right_click, copy_paste, fullscreen_exit, key_combo
    private Timestamp timestamp;
    private String description;

    public ProctorLog() {}

    public ProctorLog(int attemptId, String eventType, String description) {
        this.attemptId = attemptId;
        this.eventType = eventType;
        this.description = description;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getAttemptId() { return attemptId; }
    public void setAttemptId(int attemptId) { this.attemptId = attemptId; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public Timestamp getTimestamp() { return timestamp; }
    public void setTimestamp(Timestamp timestamp) { this.timestamp = timestamp; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
