package com.examportal.models;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.math.BigDecimal;

public class ExamAttempt implements Serializable {
    private int id;
    private int examId;
    private int userId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime submittedAt;
    private Integer score;
    private Integer totalMarks;
    private BigDecimal percentageScore;
    private String status; // "in-progress", "submitted", "graded", "abandoned"
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public ExamAttempt() {
    }

    public ExamAttempt(int examId, int userId, LocalDateTime startTime, String status) {
        this.examId = examId;
        this.userId = userId;
        this.startTime = startTime;
        this.status = status;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getExamId() {
        return examId;
    }

    public void setExamId(int examId) {
        this.examId = examId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Integer getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(Integer totalMarks) {
        this.totalMarks = totalMarks;
    }

    public BigDecimal getPercentageScore() {
        return percentageScore;
    }

    public void setPercentageScore(BigDecimal percentageScore) {
        this.percentageScore = percentageScore;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public boolean isInProgress() {
        return "in-progress".equals(status);
    }

    public boolean isSubmitted() {
        return "submitted".equals(status);
    }

    public boolean isGraded() {
        return "graded".equals(status);
    }

    public boolean isPassed() {
        return percentageScore != null && score != null && 
               percentageScore.compareTo(BigDecimal.ZERO) > 0;
    }

    public long getElapsedSeconds() {
        LocalDateTime end = endTime != null ? endTime : LocalDateTime.now();
        java.time.Duration duration = java.time.Duration.between(startTime, end);
        return duration.getSeconds();
    }

    @Override
    public String toString() {
        return "ExamAttempt{" +
                "id=" + id +
                ", examId=" + examId +
                ", userId=" + userId +
                ", status='" + status + '\'' +
                ", percentageScore=" + percentageScore +
                '}';
    }
}
