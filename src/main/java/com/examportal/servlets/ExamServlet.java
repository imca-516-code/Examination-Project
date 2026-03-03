package com.examportal.servlets;

import com.examportal.dao.ExamDAO;
import com.examportal.dao.ExamAttemptDAO;
import com.examportal.models.User;
import com.examportal.models.Exam;
import com.examportal.models.ExamAttempt;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.util.List;

@WebServlet("/dashboard/exams")
public class ExamServlet extends HttpServlet {
    private ExamDAO examDAO = new ExamDAO();
    private ExamAttemptDAO attemptDAO = new ExamAttemptDAO();
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            response.sendRedirect(request.getContextPath() + "/login");
            return;
        }
        
        User user = (User) session.getAttribute("user");
        
        // Get all published exams
        List<Exam> publishedExams = examDAO.getPublishedExams();
        
        // Get user's attempts
        List<ExamAttempt> userAttempts = attemptDAO.getAttemptsByUser(user.getId());
        
        // Set attributes for JSP
        request.setAttribute("exams", publishedExams);
        request.setAttribute("attempts", userAttempts);
        request.setAttribute("user", user);
        
        // Forward to exams page
        request.getRequestDispatcher("/WEB-INF/jsp/dashboard/exams.jsp").forward(request, response);
    }
}
