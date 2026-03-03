package com.examportal.servlets;

import com.examportal.dao.ExamDAO;
import com.examportal.models.User;
import com.examportal.models.Exam;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.util.List;

@WebServlet("/admin/exams")
public class AdminExamServlet extends HttpServlet {
    private ExamDAO examDAO = new ExamDAO();
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            response.sendRedirect(request.getContextPath() + "/login");
            return;
        }
        
        User user = (User) session.getAttribute("user");
        if (!user.isAdmin()) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN);
            return;
        }
        
        // Get all exams
        List<Exam> exams = examDAO.getAllExams();
        
        // Set attributes
        request.setAttribute("exams", exams);
        
        // Forward to admin exams page
        request.getRequestDispatcher("/WEB-INF/jsp/admin/exams.jsp").forward(request, response);
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            response.sendRedirect(request.getContextPath() + "/login");
            return;
        }
        
        User user = (User) session.getAttribute("user");
        if (!user.isAdmin()) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN);
            return;
        }
        
        String action = request.getParameter("action");
        
        if ("create".equals(action)) {
            createExam(request, response);
        } else if ("update".equals(action)) {
            updateExam(request, response);
        } else if ("delete".equals(action)) {
            deleteExam(request, response);
        }
    }
    
    private void createExam(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        User user = (User) request.getSession(false).getAttribute("user");
        
        String title = request.getParameter("title");
        String description = request.getParameter("description");
        int durationMinutes = Integer.parseInt(request.getParameter("durationMinutes"));
        int totalQuestions = Integer.parseInt(request.getParameter("totalQuestions"));
        int passingPercentage = Integer.parseInt(request.getParameter("passingPercentage"));
        String status = request.getParameter("status");
        boolean proctoringEnabled = "on".equals(request.getParameter("proctoringEnabled"));
        boolean allowNavigation = "on".equals(request.getParameter("allowNavigation"));
        
        Exam exam = new Exam(title, description, durationMinutes, totalQuestions, 
                            passingPercentage, status, proctoringEnabled, allowNavigation, user.getId());
        
        int examId = examDAO.createExam(exam);
        if (examId > 0) {
            response.sendRedirect(request.getContextPath() + "/admin/exams");
        } else {
            request.setAttribute("error", "Failed to create exam");
            request.getRequestDispatcher("/WEB-INF/jsp/admin/exams/create.jsp").forward(request, response);
        }
    }
    
    private void updateExam(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        int examId = Integer.parseInt(request.getParameter("examId"));
        String title = request.getParameter("title");
        String description = request.getParameter("description");
        int durationMinutes = Integer.parseInt(request.getParameter("durationMinutes"));
        int totalQuestions = Integer.parseInt(request.getParameter("totalQuestions"));
        int passingPercentage = Integer.parseInt(request.getParameter("passingPercentage"));
        String status = request.getParameter("status");
        boolean proctoringEnabled = "on".equals(request.getParameter("proctoringEnabled"));
        boolean allowNavigation = "on".equals(request.getParameter("allowNavigation"));
        
        Exam exam = examDAO.getExamById(examId);
        if (exam == null) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
            return;
        }
        
        exam.setTitle(title);
        exam.setDescription(description);
        exam.setDurationMinutes(durationMinutes);
        exam.setTotalQuestions(totalQuestions);
        exam.setPassingPercentage(passingPercentage);
        exam.setStatus(status);
        exam.setProctoringEnabled(proctoringEnabled);
        exam.setAllowNavigation(allowNavigation);
        
        if (examDAO.updateExam(exam)) {
            response.sendRedirect(request.getContextPath() + "/admin/exams");
        } else {
            request.setAttribute("error", "Failed to update exam");
            request.setAttribute("exam", exam);
            request.getRequestDispatcher("/WEB-INF/jsp/admin/exams/edit.jsp").forward(request, response);
        }
    }
    
    private void deleteExam(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        int examId = Integer.parseInt(request.getParameter("examId"));
        
        if (examDAO.deleteExam(examId)) {
            response.sendRedirect(request.getContextPath() + "/admin/exams");
        } else {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}
