package com.examportal.model;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ExamAttempt {
    private int id;
    private int examId;
    private int studentId;
    private Timestamp startedAt;
    private Timestamp submittedAt;
    private Double score;         // nullable
    private Integer totalCorrect; // nullable
    private int totalQuestions;
    private String status;        // in_progress, submitted

    // Loaded separately
    private Map<Integer, Integer> answers = new HashMap<>();   // questionId -> selectedAnswer
    private List<Integer> questionOrder = new ArrayList<>();     // ordered question IDs
    private List<ProctorLog> proctorLogs = new ArrayList<>();

    // Transient display helpers (populated by servlets)
    private String studentName;
    private String examTitle;
    private int passingScore;

    public ExamAttempt() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getExamId() { return examId; }
    public void setExamId(int examId) { this.examId = examId; }

    public int getStudentId() { return studentId; }
    public void setStudentId(int studentId) { this.studentId = studentId; }

    public Timestamp getStartedAt() { return startedAt; }
    public void setStartedAt(Timestamp startedAt) { this.startedAt = startedAt; }

    public Timestamp getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(Timestamp submittedAt) { this.submittedAt = submittedAt; }

    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }

    public Integer getTotalCorrect() { return totalCorrect; }
    public void setTotalCorrect(Integer totalCorrect) { this.totalCorrect = totalCorrect; }

    public int getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(int totalQuestions) { this.totalQuestions = totalQuestions; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Map<Integer, Integer> getAnswers() { return answers; }
    public void setAnswers(Map<Integer, Integer> answers) { this.answers = answers; }

    public List<Integer> getQuestionOrder() { return questionOrder; }
    public void setQuestionOrder(List<Integer> questionOrder) { this.questionOrder = questionOrder; }

    public List<ProctorLog> getProctorLogs() { return proctorLogs; }
    public void setProctorLogs(List<ProctorLog> proctorLogs) { this.proctorLogs = proctorLogs; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getExamTitle() { return examTitle; }
    public void setExamTitle(String examTitle) { this.examTitle = examTitle; }

    public int getPassingScore() { return passingScore; }
    public void setPassingScore(int passingScore) { this.passingScore = passingScore; }

    public boolean isPassed() {
        return score != null && score >= passingScore;
    }

    public int getTotalIncorrect() {
        return totalQuestions - (totalCorrect != null ? totalCorrect : 0);
    }

    public int getAnsweredCount() {
        return answers.size();
    }
}
