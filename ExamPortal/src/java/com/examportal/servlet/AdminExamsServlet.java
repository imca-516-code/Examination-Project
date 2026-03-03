package com.examportal.servlet;

import com.examportal.dao.ExamDAO;
import com.examportal.model.Exam;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.List;

@WebServlet("/admin/exams")
public class AdminExamsServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        List<Exam> exams = new ExamDAO().findAll();
        req.setAttribute("exams", exams);
        req.getRequestDispatcher("/admin/exams.jsp").forward(req, resp);
    }
}
