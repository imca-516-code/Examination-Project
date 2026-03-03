package com.examportal.servlets;

import com.examportal.dao.ExamDAO;
import com.examportal.dao.ExamAttemptDAO;
import com.examportal.dao.QuestionDAO;
import com.examportal.models.User;
import com.examportal.models.Exam;
import com.examportal.models.ExamAttempt;
import com.examportal.models.Question;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/dashboard/attempt/*")
public class AttemptServlet extends HttpServlet {
    private ExamDAO examDAO = new ExamDAO();
    private ExamAttemptDAO attemptDAO = new ExamAttemptDAO();
    private QuestionDAO questionDAO = new QuestionDAO();
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            response.sendRedirect(request.getContextPath() + "/login");
            return;
        }
        
        User user = (User) session.getAttribute("user");
        
        // Extract exam ID from URL
        String pathInfo = request.getPathInfo();
        int examId = -1;
        
        if (pathInfo != null && pathInfo.length() > 1) {
            try {
                examId = Integer.parseInt(pathInfo.substring(1));
            } catch (NumberFormatException e) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST);
                return;
            }
        }
        
        // Get exam
        Exam exam = examDAO.getExamById(examId);
        if (exam == null || !exam.isPublished()) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
            return;
        }
        
        // Check for existing in-progress attempt
        ExamAttempt existingAttempt = attemptDAO.getOngoingAttempt(examId, user.getId());
        ExamAttempt attempt;
        
        if (existingAttempt != null) {
            attempt = existingAttempt;
        } else {
            // Create new attempt
            int attemptId = attemptDAO.createAttempt(examId, user.getId());
            if (attemptId == -1) {
                response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                return;
            }
            attempt = attemptDAO.getAttemptById(attemptId);
        }
        
        // Get questions for exam
        List<Integer> questionIds = examDAO.getExamQuestionIds(examId);
        List<Question> questions = new ArrayList<>();
        for (Integer qId : questionIds) {
            Question q = questionDAO.getQuestionById(qId);
            if (q != null) {
                questions.add(q);
            }
        }
        
        // Get user's answers
        Map<Integer, String> userAnswers = new HashMap<>();
        // TODO: Fetch from database when answer saving is implemented
        
        // Set attributes
        request.setAttribute("exam", exam);
        request.setAttribute("attempt", attempt);
        request.setAttribute("questions", questions);
        request.setAttribute("userAnswers", userAnswers);
        
        // Forward to attempt page
        request.getRequestDispatcher("/WEB-INF/jsp/dashboard/attempt.jsp").forward(request, response);
    }
}
