package com.examportal.servlet;

import com.examportal.dao.QuestionDAO;
import com.examportal.model.Question;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.List;

@WebServlet("/admin/questions")
public class AdminQuestionsServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String keyword = req.getParameter("q");
        String subject = req.getParameter("subject");
        String difficulty = req.getParameter("difficulty");

        QuestionDAO dao = new QuestionDAO();
        List<Question> questions;

        if ((keyword != null && !keyword.isEmpty()) || (subject != null && !subject.isEmpty()) || (difficulty != null && !difficulty.isEmpty())) {
            questions = dao.search(keyword, subject, difficulty);
        } else {
            questions = dao.findAll();
        }

        req.setAttribute("questions", questions);
        req.setAttribute("keyword", keyword);
        req.setAttribute("selectedSubject", subject);
        req.setAttribute("selectedDifficulty", difficulty);
        req.getRequestDispatcher("/admin/questions.jsp").forward(req, resp);
    }
}
