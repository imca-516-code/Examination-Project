package com.examportal.servlet;

import com.examportal.dao.ExamDAO;
import com.examportal.model.Exam;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

@WebServlet("/admin/exams/toggle-status")
public class ToggleExamStatusServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        int id = Integer.parseInt(req.getParameter("id"));
        ExamDAO dao = new ExamDAO();
        Exam exam = dao.findById(id);
        if (exam != null) {
            String newStatus = "active".equals(exam.getStatus()) ? "draft" : "active";
            dao.updateStatus(id, newStatus);
        }
        resp.sendRedirect(req.getContextPath() + "/admin/exams");
    }
}
