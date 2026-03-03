package com.examportal.models;

import java.io.Serializable;
import java.time.LocalDateTime;

public class Exam implements Serializable {
    private int id;
    private String title;
    private String description;
    private int durationMinutes;
    private int totalQuestions;
    private int passingPercentage;
    private String status; // "draft", "published", "archived"
    private boolean proctoringEnabled;
    private boolean allowNavigation;
    private int createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public Exam() {
    }

    public Exam(String title, String description, int durationMinutes, int totalQuestions, 
                int passingPercentage, String status, boolean proctoringEnabled, boolean allowNavigation, int createdBy) {
        this.title = title;
        this.description = description;
        this.durationMinutes = durationMinutes;
        this.totalQuestions = totalQuestions;
        this.passingPercentage = passingPercentage;
        this.status = status;
        this.proctoringEnabled = proctoringEnabled;
        this.allowNavigation = allowNavigation;
        this.createdBy = createdBy;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(int durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public int getPassingPercentage() {
        return passingPercentage;
    }

    public void setPassingPercentage(int passingPercentage) {
        this.passingPercentage = passingPercentage;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isProctoringEnabled() {
        return proctoringEnabled;
    }

    public void setProctoringEnabled(boolean proctoringEnabled) {
        this.proctoringEnabled = proctoringEnabled;
    }

    public boolean isAllowNavigation() {
        return allowNavigation;
    }

    public void setAllowNavigation(boolean allowNavigation) {
        this.allowNavigation = allowNavigation;
    }

    public int getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(int createdBy) {
        this.createdBy = createdBy;
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

    public boolean isPublished() {
        return "published".equals(status);
    }

    public boolean isDraft() {
        return "draft".equals(status);
    }

    @Override
    public String toString() {
        return "Exam{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", status='" + status + '\'' +
                ", durationMinutes=" + durationMinutes +
                ", totalQuestions=" + totalQuestions +
                '}';
    }
}
