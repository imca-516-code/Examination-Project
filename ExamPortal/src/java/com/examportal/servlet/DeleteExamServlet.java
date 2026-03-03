package com.examportal.servlet;

import com.examportal.dao.ExamDAO;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

@WebServlet("/admin/exams/delete")
public class DeleteExamServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        int id = Integer.parseInt(req.getParameter("id"));
        new ExamDAO().delete(id);
        resp.sendRedirect(req.getContextPath() + "/admin/exams");
    }
}
