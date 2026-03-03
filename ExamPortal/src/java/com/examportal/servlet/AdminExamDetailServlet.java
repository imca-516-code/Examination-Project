package com.examportal.servlet;

import com.examportal.dao.*;
import com.examportal.model.*;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.List;

@WebServlet("/admin/exams/detail")
public class AdminExamDetailServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        int examId = Integer.parseInt(req.getParameter("id"));
        ExamDAO examDAO = new ExamDAO();
        Exam exam = examDAO.findById(examId);
        if (exam == null) {
            resp.sendRedirect(req.getContextPath() + "/admin/exams");
            return;
        }

        QuestionDAO questionDAO = new QuestionDAO();
        List<Question> questions = questionDAO.findByIds(exam.getQuestionIds());

        ExamAttemptDAO attemptDAO = new ExamAttemptDAO();
        UserDAO userDAO = new UserDAO();
        List<ExamAttempt> attempts = attemptDAO.findByExamId(examId);
        for (ExamAttempt a : attempts) {
            User student = userDAO.findById(a.getStudentId());
            a.setStudentName(student != null ? student.getName() : "Unknown");
        }

        req.setAttribute("exam", exam);
        req.setAttribute("questions", questions);
        req.setAttribute("attempts", attempts);
        req.getRequestDispatcher("/admin/exam-detail.jsp").forward(req, resp);
    }
}
