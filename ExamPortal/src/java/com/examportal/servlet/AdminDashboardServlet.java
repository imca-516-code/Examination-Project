package com.examportal.servlet;

import com.examportal.dao.*;
import com.examportal.model.*;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.*;

@WebServlet("/admin/dashboard")
public class AdminDashboardServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        UserDAO userDAO = new UserDAO();
        ExamDAO examDAO = new ExamDAO();
        QuestionDAO questionDAO = new QuestionDAO();
        ExamAttemptDAO attemptDAO = new ExamAttemptDAO();

        int totalStudents = userDAO.countStudents();
        int totalExams = examDAO.count();
        int totalQuestions = questionDAO.count();
        double avgScore = attemptDAO.averageScore();

        req.setAttribute("totalStudents", totalStudents);
        req.setAttribute("totalExams", totalExams);
        req.setAttribute("totalQuestions", totalQuestions);
        req.setAttribute("avgScore", Math.round(avgScore));

        // Pass/Fail counts
        List<ExamAttempt> submitted = attemptDAO.findAllSubmitted();
        int passed = 0, failed = 0;
        for (ExamAttempt a : submitted) {
            Exam exam = examDAO.findById(a.getExamId());
            if (exam != null && a.getScore() != null) {
                if (a.getScore() >= exam.getPassingScore()) passed++;
                else failed++;
            }
        }
        req.setAttribute("passed", passed);
        req.setAttribute("failed", failed);

        // Exam performance
        List<Exam> allExams = examDAO.findAll();
        List<Map<String, Object>> examPerf = new ArrayList<>();
        for (Exam exam : allExams) {
            List<ExamAttempt> attempts = attemptDAO.findByExamId(exam.getId());
            double avg = 0;
            int count = 0;
            for (ExamAttempt a : attempts) {
                if ("submitted".equals(a.getStatus()) && a.getScore() != null) {
                    avg += a.getScore();
                    count++;
                }
            }
            Map<String, Object> perf = new HashMap<>();
            perf.put("name", exam.getShortTitle());
            perf.put("avgScore", count > 0 ? (int) Math.round(avg / count) : 0);
            perf.put("attempts", count);
            examPerf.add(perf);
        }
        req.setAttribute("examPerformance", examPerf);

        // Recent attempts (top 5)
        List<ExamAttempt> recent = submitted.subList(0, Math.min(5, submitted.size()));
        for (ExamAttempt a : recent) {
            User student = userDAO.findById(a.getStudentId());
            Exam exam = examDAO.findById(a.getExamId());
            a.setStudentName(student != null ? student.getName() : "Unknown");
            a.setExamTitle(exam != null ? exam.getTitle() : "Unknown");
            a.setPassingScore(exam != null ? exam.getPassingScore() : 0);
        }
        req.setAttribute("recentAttempts", recent);

        req.getRequestDispatcher("/admin/dashboard.jsp").forward(req, resp);
    }
}
