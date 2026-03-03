<%@ page contentType="text/html; charset=UTF-8" %>
<%@ page import="com.examportal.models.ExamAttempt" %>
<%@ page import="java.math.BigDecimal" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exam Results - ExamPortal</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f7fa;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 40px 20px;
        }

        .result-header {
            text-align: center;
            margin-bottom: 40px;
        }

        .result-header h1 {
            color: #333;
            font-size: 32px;
            margin-bottom: 20px;
        }

        .score-display {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
            margin-bottom: 30px;
        }

        .score-circle {
            width: 180px;
            height: 180px;
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 48px;
            font-weight: bold;
            color: white;
        }

        .score-circle.pass {
            background: linear-gradient(135deg, #66bb6a 0%, #43a047 100%);
        }

        .score-circle.fail {
            background: linear-gradient(135deg, #ef5350 0%, #e53935 100%);
        }

        .score-text {
            text-align: center;
            margin-bottom: 20px;
        }

        .score-percentage {
            font-size: 60px;
            font-weight: 700;
            color: #333;
            margin-bottom: 10px;
        }

        .score-label {
            font-size: 18px;
            color: #666;
        }

        .result-status {
            text-align: center;
            font-size: 24px;
            font-weight: 600;
            color: #333;
            margin-top: 20px;
        }

        .result-status.pass {
            color: #43a047;
        }

        .result-status.fail {
            color: #e53935;
        }

        .details-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }

        .detail-item {
            background: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }

        .detail-label {
            font-size: 12px;
            font-weight: 600;
            color: #999;
            text-transform: uppercase;
            margin-bottom: 8px;
        }

        .detail-value {
            font-size: 20px;
            font-weight: 600;
            color: #333;
        }

        .breakdown-section {
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
            margin-bottom: 30px;
        }

        .breakdown-title {
            font-size: 20px;
            font-weight: 600;
            color: #333;
            margin-bottom: 20px;
        }

        .answer-item {
            padding: 20px;
            border-bottom: 1px solid #f0f0f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .answer-item:last-child {
            border-bottom: none;
        }

        .answer-info {
            flex: 1;
        }

        .answer-question {
            font-size: 15px;
            font-weight: 500;
            color: #333;
            margin-bottom: 8px;
        }

        .answer-user-response {
            font-size: 13px;
            color: #666;
            margin-bottom: 4px;
        }

        .answer-correct-response {
            font-size: 13px;
            color: #43a047;
            font-weight: 500;
        }

        .answer-badge {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            font-weight: bold;
            font-size: 18px;
        }

        .answer-badge.correct {
            background: #e8f5e9;
            color: #43a047;
        }

        .answer-badge.incorrect {
            background: #ffebee;
            color: #e53935;
        }

        .back-button {
            display: inline-block;
            padding: 10px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-weight: 600;
            transition: transform 0.2s, box-shadow 0.2s;
            margin-top: 20px;
        }

        .back-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
    </style>
</head>
<body>
    <jsp:include page="/WEB-INF/jsp/includes/header.jsp" />
    
    <div class="container">
        <%
            ExamAttempt attempt = (ExamAttempt) request.getAttribute("attempt");
            if (attempt != null) {
                boolean passed = attempt.getPercentageScore() != null && 
                               attempt.getPercentageScore().compareTo(new BigDecimal(40)) >= 0;
        %>
        
        <div class="result-header">
            <h1>Exam Results</h1>
        </div>

        <div class="score-display">
            <div class="score-circle <%= passed ? "pass" : "fail" %>">
                <%= String.format("%.0f", attempt.getPercentageScore()) %>%
            </div>
            
            <div class="score-text">
                <div class="score-percentage">
                    <%= String.format("%.1f%%", attempt.getPercentageScore()) %>
                </div>
                <div class="score-label">Score</div>
            </div>

            <div class="result-status <%= passed ? "pass" : "fail" %>">
                <%= passed ? "PASSED" : "FAILED" %>
            </div>

            <div class="details-grid">
                <div class="detail-item">
                    <div class="detail-label">Marks Obtained</div>
                    <div class="detail-value"><%= attempt.getScore() %> / <%= attempt.getTotalMarks() %></div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Status</div>
                    <div class="detail-value"><%= attempt.getStatus().toUpperCase() %></div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Attempt Date</div>
                    <div class="detail-value"><%= attempt.getSubmittedAt() %></div>
                </div>
            </div>
        </div>

        <div class="breakdown-section">
            <div class="breakdown-title">Answer Breakdown</div>
            
            <%
                java.util.Map<Integer, com.examportal.dao.AnswerDAO.ExamAnswer> answers = 
                    (java.util.Map<Integer, com.examportal.dao.AnswerDAO.ExamAnswer>) request.getAttribute("answers");
                
                if (answers != null && !answers.isEmpty()) {
                    java.util.List<com.examportal.models.Question> questions = 
                        (java.util.List<com.examportal.models.Question>) request.getAttribute("questions");
                    
                    for (com.examportal.models.Question question : questions) {
                        com.examportal.dao.AnswerDAO.ExamAnswer answer = answers.get(question.getId());
                        if (answer != null) {
                            boolean isCorrect = answer.isCorrect != null && answer.isCorrect;
            %>
            
            <div class="answer-item">
                <div class="answer-info">
                    <div class="answer-question">Q: <%= question.getTitle() %></div>
                    <div class="answer-user-response">Your answer: <%= answer.userAnswer %></div>
                    <div class="answer-correct-response">Correct answer: <%= question.getCorrectAnswer() %></div>
                </div>
                <div class="answer-badge <%= isCorrect ? "correct" : "incorrect" %>">
                    <%= isCorrect ? "✓" : "✗" %>
                </div>
            </div>
            
            <%
                        }
                    }
                }
            %>
        </div>

        <a href="${pageContext.request.contextPath}/dashboard/exams" class="back-button">
            Back to Exams
        </a>

        <% } else { %>
        <div style="text-align: center; padding: 60px 20px;">
            <h2 style="color: #666; margin-bottom: 10px;">Attempt not found</h2>
            <p style="color: #999;">The exam attempt you're looking for doesn't exist.</p>
            <a href="${pageContext.request.contextPath}/dashboard/exams" class="back-button">
                Back to Exams
            </a>
        </div>
        <% } %>
    </div>
</body>
</html>
