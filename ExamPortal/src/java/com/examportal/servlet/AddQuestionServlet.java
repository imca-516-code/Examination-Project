package com.examportal.servlet;

import com.examportal.dao.QuestionDAO;
import com.examportal.model.Question;
import com.examportal.model.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

@WebServlet("/admin/questions/new")
public class AddQuestionServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.getRequestDispatcher("/admin/add-question.jsp").forward(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        User user = (User) req.getSession().getAttribute("user");

        Question q = new Question();
        q.setText(req.getParameter("text"));
        q.setOptionA(req.getParameter("optionA"));
        q.setOptionB(req.getParameter("optionB"));
        q.setOptionC(req.getParameter("optionC"));
        q.setOptionD(req.getParameter("optionD"));
        q.setCorrectAnswer(Integer.parseInt(req.getParameter("correctAnswer")));
        q.setSubject(req.getParameter("subject"));
        q.setDifficulty(req.getParameter("difficulty"));
        q.setCreatedBy(user.getId());

        new QuestionDAO().insert(q);
        resp.sendRedirect(req.getContextPath() + "/admin/questions");
    }
}
