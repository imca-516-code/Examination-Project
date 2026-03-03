package com.examportal.servlet;

import com.examportal.dao.QuestionDAO;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

@WebServlet("/admin/questions/delete")
public class DeleteQuestionServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        int id = Integer.parseInt(req.getParameter("id"));
        new QuestionDAO().delete(id);
        resp.sendRedirect(req.getContextPath() + "/admin/questions");
    }
}
