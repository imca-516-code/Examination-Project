package com.examportal.servlet;

import com.examportal.dao.ExamDAO;
import com.examportal.dao.QuestionDAO;
import com.examportal.model.Exam;
import com.examportal.model.Question;
import com.examportal.model.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/admin/exams/new")
public class CreateExamServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        List<Question> questions = new QuestionDAO().findAll();
        req.setAttribute("allQuestions", questions);
        req.getRequestDispatcher("/admin/create-exam.jsp").forward(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        User user = (User) req.getSession().getAttribute("user");

        String title = req.getParameter("title");
        String description = req.getParameter("description");
        String subject = req.getParameter("subject");
        int duration = Integer.parseInt(req.getParameter("duration"));
        int passingScore = Integer.parseInt(req.getParameter("passingScore"));
        String status = req.getParameter("status");
        String scheduledAtStr = req.getParameter("scheduledAt");
        String[] questionIdStrs = req.getParameterValues("questionIds");

        List<Integer> questionIds = new ArrayList<>();
        if (questionIdStrs != null) {
            for (String s : questionIdStrs) questionIds.add(Integer.parseInt(s));
        }

        Exam exam = new Exam();
        exam.setTitle(title);
        exam.setDescription(description);
        exam.setSubject(subject);
        exam.setDuration(duration);
        exam.setTotalQuestions(questionIds.size());
        exam.setPassingScore(passingScore);
        exam.setStatus(status != null ? status : "draft");
        exam.setCreatedBy(user.getId());
        if (scheduledAtStr != null && !scheduledAtStr.isEmpty()) {
            exam.setScheduledAt(Timestamp.valueOf(scheduledAtStr.replace("T", " ") + ":00"));
        }
        exam.setQuestionIds(questionIds);

        new ExamDAO().insert(exam);
        resp.sendRedirect(req.getContextPath() + "/admin/exams");
    }
}
