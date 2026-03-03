package com.examportal.servlet;

import com.examportal.dao.*;
import com.examportal.model.*;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.*;

@WebServlet("/admin/reports")
public class AdminReportsServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        ExamAttemptDAO attemptDAO = new ExamAttemptDAO();
        ExamDAO examDAO = new ExamDAO();
        UserDAO userDAO = new UserDAO();
        QuestionDAO questionDAO = new QuestionDAO();

        List<ExamAttempt> submitted = attemptDAO.findAllSubmitted();

        // Score distribution: 0-20, 21-40, 41-60, 61-80, 81-100
        int[] distribution = new int[5];
        for (ExamAttempt a : submitted) {
            if (a.getScore() != null) {
                int bucket = Math.min((int)(a.getScore() / 20), 4);
                distribution[bucket]++;
            }
        }
        req.setAttribute("scoreDistribution", distribution);

        // Subject performance
        Map<String, List<Double>> subjectScores = new LinkedHashMap<>();
        subjectScores.put("Mathematics", new ArrayList<>());
        subjectScores.put("Science", new ArrayList<>());
        subjectScores.put("Programming", new ArrayList<>());
        for (ExamAttempt a : submitted) {
            if (a.getScore() != null) {
                Exam exam = examDAO.findById(a.getExamId());
                if (exam != null && subjectScores.containsKey(exam.getSubject())) {
                    subjectScores.get(exam.getSubject()).add(a.getScore());
                }
            }
        }
        Map<String, Integer> subjectAvg = new LinkedHashMap<>();
        for (Map.Entry<String, List<Double>> entry : subjectScores.entrySet()) {
            List<Double> scores = entry.getValue();
            double avg = scores.isEmpty() ? 0 : scores.stream().mapToDouble(Double::doubleValue).average().orElse(0);
            subjectAvg.put(entry.getKey(), (int) Math.round(avg));
        }
        req.setAttribute("subjectAvg", subjectAvg);

        // Leaderboard (top 10 students by avg score)
        List<User> students = userDAO.findAllStudents();
        List<Map<String, Object>> leaderboard = new ArrayList<>();
        for (User s : students) {
            int count = attemptDAO.countByStudent(s.getId());
            if (count > 0) {
                double avg = attemptDAO.averageScoreByStudent(s.getId());
                Map<String, Object> entry = new HashMap<>();
                entry.put("name", s.getName());
                entry.put("email", s.getEmail());
                entry.put("attempts", count);
                entry.put("avgScore", Math.round(avg));
                leaderboard.add(entry);
            }
        }
        leaderboard.sort((a, b) -> Long.compare((long)b.get("avgScore"), (long)a.get("avgScore")));
        req.setAttribute("leaderboard", leaderboard.subList(0, Math.min(10, leaderboard.size())));

        req.getRequestDispatcher("/admin/reports.jsp").forward(req, resp);
    }
}
