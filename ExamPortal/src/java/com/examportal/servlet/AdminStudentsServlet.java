package com.examportal.servlet;

import com.examportal.dao.ExamAttemptDAO;
import com.examportal.dao.UserDAO;
import com.examportal.model.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.*;

@WebServlet("/admin/students")
public class AdminStudentsServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        List<User> students = new UserDAO().findAllStudents();
        ExamAttemptDAO attemptDAO = new ExamAttemptDAO();

        List<Map<String, Object>> studentData = new ArrayList<>();
        for (User s : students) {
            Map<String, Object> data = new HashMap<>();
            data.put("user", s);
            data.put("attemptCount", attemptDAO.countByStudent(s.getId()));
            data.put("avgScore", Math.round(attemptDAO.averageScoreByStudent(s.getId())));
            studentData.add(data);
        }

        req.setAttribute("studentData", studentData);
        req.getRequestDispatcher("/admin/students.jsp").forward(req, resp);
    }
}
