package com.examportal.servlets;

import com.examportal.dao.ExamAttemptDAO;
import com.examportal.dao.AnswerDAO;
import com.examportal.dao.QuestionDAO;
import com.examportal.models.User;
import com.examportal.models.ExamAttempt;
import com.examportal.models.Question;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@WebServlet("/dashboard/result/*")
public class ResultServlet extends HttpServlet {
    private ExamAttemptDAO attemptDAO = new ExamAttemptDAO();
    private AnswerDAO answerDAO = new AnswerDAO();
    private QuestionDAO questionDAO = new QuestionDAO();
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            response.sendRedirect(request.getContextPath() + "/login");
            return;
        }
        
        User user = (User) session.getAttribute("user");
        
        // Extract attempt ID from URL
        String pathInfo = request.getPathInfo();
        int attemptId = -1;
        
        if (pathInfo != null && pathInfo.length() > 1) {
            try {
                attemptId = Integer.parseInt(pathInfo.substring(1));
            } catch (NumberFormatException e) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST);
                return;
            }
        }
        
        // Get attempt
        ExamAttempt attempt = attemptDAO.getAttemptById(attemptId);
        if (attempt == null || attempt.getUserId() != user.getId()) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
            return;
        }
        
        // Grade exam if not already graded
        if (!attempt.isGraded()) {
            gradeExam(attempt);
        }
        
        // Get answers
        Map<Integer, AnswerDAO.ExamAnswer> answers = answerDAO.getAttemptAnswers(attemptId);
        
        // Get questions
        List<Question> questions = new ArrayList<>();
        for (Integer qId : answers.keySet()) {
            Question q = questionDAO.getQuestionById(qId);
            if (q != null) {
                questions.add(q);
            }
        }
        
        // Set attributes
        request.setAttribute("attempt", attempt);
        request.setAttribute("answers", answers);
        request.setAttribute("questions", questions);
        
        // Forward to result page
        request.getRequestDispatcher("/WEB-INF/jsp/dashboard/result.jsp").forward(request, response);
    }
    
    private void gradeExam(ExamAttempt attempt) {
        // Get all answers for this attempt
        Map<Integer, AnswerDAO.ExamAnswer> answers = answerDAO.getAttemptAnswers(attempt.getId());
        
        int score = 0;
        int totalQuestions = 0;
        
        for (Map.Entry<Integer, AnswerDAO.ExamAnswer> entry : answers.entrySet()) {
            AnswerDAO.ExamAnswer answer = entry.getValue();
            Question question = questionDAO.getQuestionById(entry.getKey());
            
            if (question != null) {
                totalQuestions++;
                boolean isCorrect = false;
                
                if ("multiple-choice".equals(question.getQuestionType())) {
                    isCorrect = question.getCorrectAnswer().equals(answer.userAnswer);
                }
                
                int marks = isCorrect ? 1 : 0;
                score += marks;
                
                answerDAO.gradeAnswer(attempt.getId(), entry.getKey(), isCorrect, marks);
            }
        }
        
        // Calculate percentage
        BigDecimal percentage = BigDecimal.ZERO;
        if (totalQuestions > 0) {
            percentage = new BigDecimal(score * 100).divide(new BigDecimal(totalQuestions), 2, java.math.RoundingMode.HALF_UP);
        }
        
        // Update attempt with score
        attemptDAO.gradeAttempt(attempt.getId(), score, totalQuestions, percentage);
    }
}
