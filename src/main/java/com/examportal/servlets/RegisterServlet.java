package com.examportal.servlets;

import com.examportal.dao.UserDAO;
import com.examportal.models.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;

@WebServlet("/register")
public class RegisterServlet extends HttpServlet {
    private UserDAO userDAO = new UserDAO();
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        // If already logged in, redirect to dashboard
        HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute("user") != null) {
            User user = (User) session.getAttribute("user");
            if (user.isAdmin()) {
                response.sendRedirect(request.getContextPath() + "/admin/exams");
            } else {
                response.sendRedirect(request.getContextPath() + "/dashboard/exams");
            }
            return;
        }
        
        // Forward to register page
        request.getRequestDispatcher("/WEB-INF/jsp/auth/register.jsp").forward(request, response);
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String confirmPassword = request.getParameter("confirmPassword");
        String firstName = request.getParameter("firstName");
        String lastName = request.getParameter("lastName");
        String errorMessage = null;
        
        // Validation
        if (email == null || email.trim().isEmpty()) {
            errorMessage = "Email is required";
        } else if (password == null || password.trim().isEmpty()) {
            errorMessage = "Password is required";
        } else if (!password.equals(confirmPassword)) {
            errorMessage = "Passwords do not match";
        } else if (firstName == null || firstName.trim().isEmpty()) {
            errorMessage = "First name is required";
        } else if (lastName == null || lastName.trim().isEmpty()) {
            errorMessage = "Last name is required";
        } else if (password.length() < 6) {
            errorMessage = "Password must be at least 6 characters";
        }
        
        if (errorMessage != null) {
            request.setAttribute("error", errorMessage);
            request.getRequestDispatcher("/WEB-INF/jsp/auth/register.jsp").forward(request, response);
            return;
        }
        
        // Check if email already exists
        User existingUser = userDAO.getUserByEmail(email);
        if (existingUser != null) {
            request.setAttribute("error", "Email already registered");
            request.getRequestDispatcher("/WEB-INF/jsp/auth/register.jsp").forward(request, response);
            return;
        }
        
        // Register user
        boolean registered = userDAO.register(email, password, firstName, lastName, "student");
        
        if (registered) {
            request.setAttribute("success", "Registration successful. Please login.");
            request.getRequestDispatcher("/WEB-INF/jsp/auth/login.jsp").forward(request, response);
        } else {
            request.setAttribute("error", "Registration failed. Please try again.");
            request.getRequestDispatcher("/WEB-INF/jsp/auth/register.jsp").forward(request, response);
        }
    }
}
