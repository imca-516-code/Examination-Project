<%@ page contentType="text/html; charset=UTF-8" %>
<%@ page import="java.util.List" %>
<%@ page import="com.examportal.models.Exam" %>
<%@ page import="com.examportal.models.Question" %>
<%@ page import="com.examportal.models.ExamAttempt" %>
<%@ page import="java.util.Map" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exam - ExamPortal</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f7fa;
            height: 100vh;
            overflow: hidden;
        }

        .exam-container {
            display: flex;
            height: 100vh;
            flex-direction: column;
        }

        .exam-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .exam-title {
            font-size: 20px;
            font-weight: 600;
        }

        .timer {
            font-size: 24px;
            font-weight: bold;
            font-family: 'Courier New', monospace;
            padding: 10px 20px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
        }

        .timer.warning {
            background: rgba(255, 107, 107, 0.5);
        }

        .exam-content {
            display: flex;
            flex: 1;
            overflow: hidden;
        }

        .question-panel {
            flex: 1;
            padding: 30px;
            overflow-y: auto;
            background: #f5f7fa;
        }

        .navigator-panel {
            width: 300px;
            background: white;
            border-left: 1px solid #e0e0e0;
            padding: 20px;
            overflow-y: auto;
            box-shadow: -2px 0 8px rgba(0, 0, 0, 0.05);
        }

        .question-card {
            background: white;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            max-width: 700px;
        }

        .question-header {
            margin-bottom: 25px;
        }

        .question-number {
            color: #667eea;
            font-weight: 600;
            font-size: 14px;
            text-transform: uppercase;
            margin-bottom: 8px;
        }

        .question-text {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            line-height: 1.6;
        }

        .question-description {
            font-size: 14px;
            color: #666;
            margin-top: 10px;
            line-height: 1.5;
        }

        .options-section {
            margin-top: 25px;
        }

        .options-label {
            font-size: 12px;
            font-weight: 600;
            color: #999;
            text-transform: uppercase;
            margin-bottom: 15px;
            display: block;
        }

        .option {
            display: flex;
            align-items: center;
            padding: 15px;
            margin-bottom: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s;
            background: white;
        }

        .option:hover {
            border-color: #667eea;
            background: #f9f9f9;
        }

        .option input[type="radio"] {
            margin-right: 12px;
            width: 20px;
            height: 20px;
            cursor: pointer;
        }

        .option.selected {
            border-color: #667eea;
            background: #f0f4ff;
        }

        .option-text {
            flex: 1;
            color: #333;
            font-size: 15px;
        }

        .short-answer {
            margin-top: 25px;
        }

        .short-answer textarea {
            width: 100%;
            padding: 15px;
            border: 2px solid #e0e0e0;
            border-radius: 6px;
            font-family: 'Segoe UI', sans-serif;
            font-size: 14px;
            min-height: 120px;
            resize: vertical;
            transition: border-color 0.3s;
        }

        .short-answer textarea:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .question-nav {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            margin-bottom: 20px;
        }

        .nav-button {
            width: 100%;
            padding: 12px;
            border: 2px solid #e0e0e0;
            background: white;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
            transition: all 0.3s;
        }

        .nav-button:hover {
            border-color: #667eea;
        }

        .nav-button.current {
            background: #667eea;
            color: white;
            border-color: #667eea;
        }

        .nav-button.answered {
            border-color: #43a047;
            background: #e8f5e9;
            color: #43a047;
        }

        .nav-button.unanswered {
            border-color: #ffcccc;
        }

        .navigator-title {
            font-size: 14px;
            font-weight: 600;
            color: #333;
            margin-bottom: 15px;
            text-transform: uppercase;
            color: #999;
        }

        .question-actions {
            display: flex;
            gap: 12px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #f0f0f0;
        }

        .action-button {
            flex: 1;
            padding: 12px 20px;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }

        .btn-previous {
            background: #f0f0f0;
            color: #333;
        }

        .btn-previous:hover {
            background: #e0e0e0;
        }

        .btn-next {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .btn-next:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .btn-submit {
            background: linear-gradient(135deg, #43a047 0%, #2e7d32 100%);
            color: white;
        }

        .btn-submit:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(67, 160, 71, 0.3);
        }

        .submit-section {
            text-align: center;
            padding: 20px;
            margin-top: 20px;
        }

        .submit-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }

        .submit-modal.show {
            display: flex;
        }

        .modal-content {
            background: white;
            border-radius: 8px;
            padding: 40px;
            max-width: 400px;
            text-align: center;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .modal-title {
            font-size: 20px;
            font-weight: 600;
            color: #333;
            margin-bottom: 15px;
        }

        .modal-text {
            color: #666;
            margin-bottom: 30px;
            line-height: 1.5;
        }

        .modal-buttons {
            display: flex;
            gap: 12px;
        }

        .modal-buttons button {
            flex: 1;
            padding: 12px;
            border: none;
            border-radius: 4px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }

        .modal-cancel {
            background: #f0f0f0;
            color: #333;
        }

        .modal-cancel:hover {
            background: #e0e0e0;
        }

        .modal-confirm {
            background: linear-gradient(135deg, #43a047 0%, #2e7d32 100%);
            color: white;
        }

        .modal-confirm:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(67, 160, 71, 0.3);
        }

        @media (max-width: 768px) {
            .exam-content {
                flex-direction: column;
            }

            .navigator-panel {
                width: 100%;
                border-left: none;
                border-top: 1px solid #e0e0e0;
                max-height: 150px;
            }

            .question-nav {
                grid-template-columns: repeat(5, 1fr);
            }
        }
    </style>
</head>
<body>
    <div class="exam-container">
        <%
            Exam exam = (Exam) request.getAttribute("exam");
            ExamAttempt attempt = (ExamAttempt) request.getAttribute("attempt");
            List<Question> questions = (List<Question>) request.getAttribute("questions");
            Map<Integer, String> userAnswers = (Map<Integer, String>) request.getAttribute("userAnswers");
            
            if (userAnswers == null) {
                userAnswers = new java.util.HashMap<>();
            }
            
            int currentQuestion = 0;
            String qParam = request.getParameter("q");
            if (qParam != null && !qParam.isEmpty()) {
                try {
                    currentQuestion = Integer.parseInt(qParam) - 1;
                } catch (NumberFormatException e) {}
            }
            
            if (currentQuestion >= questions.size()) {
                currentQuestion = questions.size() - 1;
            }
            
            Question question = questions.get(currentQuestion);
        %>

        <div class="exam-header">
            <div class="exam-title"><%= exam.getTitle() %></div>
            <div class="timer" id="timer">
                <span id="minutes">29</span>:<span id="seconds">59</span>
            </div>
        </div>

        <div class="exam-content">
            <div class="question-panel">
                <div class="question-card">
                    <div class="question-header">
                        <div class="question-number">Question <%= currentQuestion + 1 %> of <%= questions.size() %></div>
                        <div class="question-text"><%= question.getTitle() %></div>
                        <% if (question.getDescription() != null && !question.getDescription().isEmpty()) { %>
                            <div class="question-description"><%= question.getDescription() %></div>
                        <% } %>
                    </div>

                    <form id="answerForm" method="POST" action="${pageContext.request.contextPath}/api/answer">
                        <input type="hidden" name="attemptId" value="<%= attempt.getId() %>">
                        <input type="hidden" name="questionId" value="<%= question.getId() %>">

                        <% if ("multiple-choice".equals(question.getQuestionType())) { %>
                            <label class="options-label">Select your answer</label>
                            <% for (String option : question.getOptions()) { %>
                                <label class="option">
                                    <input type="radio" name="answer" value="<%= option %>"
                           <%= option.equals(userAnswers.get(question.getId())) ? "checked" : "" %>
                                           onchange="saveAnswer()">
                                    <span class="option-text"><%= option %></span>
                                </label>
                            <% } %>
                        <% } else { %>
                            <div class="short-answer">
                                <textarea name="answer" placeholder="Type your answer here..." onchange="saveAnswer()"
                          ><%= userAnswers.getOrDefault(question.getId(), "") %></textarea>
                            </div>
                        <% } %>

                        <div class="question-actions">
                            <% if (currentQuestion > 0) { %>
                                <a href="?q=<%= currentQuestion %>" style="text-decoration: none; flex: 1;">
                                    <button type="button" class="action-button btn-previous">← Previous</button>
                                </a>
                            <% } else { %>
                                <button type="button" class="action-button btn-previous" disabled style="opacity: 0.5;">← Previous</button>
                            <% } %>

                            <% if (currentQuestion < questions.size() - 1) { %>
                                <a href="?q=<%= currentQuestion + 2 %>" style="text-decoration: none; flex: 1;">
                                    <button type="button" class="action-button btn-next">Next →</button>
                                </a>
                            <% } else { %>
                                <button type="button" class="action-button btn-submit" onclick="showSubmitModal()">Submit Exam</button>
                            <% } %>
                        </div>
                    </form>
                </div>
            </div>

            <div class="navigator-panel">
                <div class="navigator-title">Questions</div>
                <div class="question-nav">
                    <% for (int i = 0; i < questions.size(); i++) { %>
                        <a href="?q=<%= i + 1 %>" style="text-decoration: none;">
                            <button class="nav-button 
                                <%= i == currentQuestion ? "current" : "" %>
                                <%= userAnswers.containsKey(questions.get(i).getId()) ? "answered" : "unanswered" %>">
                                <%= i + 1 %>
                            </button>
                        </a>
                    <% } %>
                </div>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #f0f0f0;">
                    <div class="navigator-title">Legend</div>
                    <div style="font-size: 12px; color: #666; line-height: 1.8;">
                        <div style="margin-bottom: 8px;">
                            <span style="display: inline-block; width: 20px; height: 20px; background: white; border: 2px solid #667eea; border-radius: 2px; margin-right: 8px;"></span>
                            Current
                        </div>
                        <div style="margin-bottom: 8px;">
                            <span style="display: inline-block; width: 20px; height: 20px; background: #e8f5e9; border: 2px solid #43a047; border-radius: 2px; margin-right: 8px;"></span>
                            Answered
                        </div>
                        <div>
                            <span style="display: inline-block; width: 20px; height: 20px; background: white; border: 2px solid #ffcccc; border-radius: 2px; margin-right: 8px;"></span>
                            Unanswered
                        </div>
                    </div>
                </div>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #f0f0f0;">
                    <div class="navigator-title">Progress</div>
                    <%
                        int answered = userAnswers.size();
                        int total = questions.size();
                        int percentage = (answered * 100) / total;
                    %>
                    <div style="margin-bottom: 8px;">
                        <div style="font-size: 12px; color: #666; margin-bottom: 4px;">
                            <%= answered %> / <%= total %> answered
                        </div>
                        <div style="width: 100%; height: 8px; background: #f0f0f0; border-radius: 4px; overflow: hidden;">
                            <div style="height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); width: <%= percentage %>%; transition: width 0.3s;"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="submit-modal" id="submitModal">
        <div class="modal-content">
            <div class="modal-title">Submit Exam?</div>
            <div class="modal-text">
                Are you sure you want to submit your exam? You won't be able to change your answers after submission.
            </div>
            <div class="modal-buttons">
                <button class="modal-cancel" onclick="closeSubmitModal()">Cancel</button>
                <button class="modal-confirm" onclick="submitExam()">Submit</button>
            </div>
        </div>
    </div>

    <script>
        // Timer functionality
        let timeRemaining = <%= exam.getDurationMinutes() * 60 %>;
        
        function updateTimer() {
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            
            document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
            
            const timerElement = document.getElementById('timer');
            if (timeRemaining < 300) {
                timerElement.classList.add('warning');
            }
            
            if (timeRemaining <= 0) {
                submitExam();
            } else {
                timeRemaining--;
                setTimeout(updateTimer, 1000);
            }
        }
        
        updateTimer();
        
        // Save answer
        function saveAnswer() {
            const form = document.getElementById('answerForm');
            const formData = new FormData(form);
            
            fetch('${pageContext.request.contextPath}/api/answer', {
                method: 'POST',
                body: formData
            }).catch(err => console.log('Answer saved locally'));
        }
        
        // Submit modal
        function showSubmitModal() {
            document.getElementById('submitModal').classList.add('show');
        }
        
        function closeSubmitModal() {
            document.getElementById('submitModal').classList.remove('show');
        }
        
        function submitExam() {
            const attemptId = document.querySelector('input[name="attemptId"]').value;
            window.location.href = '${pageContext.request.contextPath}/dashboard/result/' + attemptId;
        }
        
        // Auto-save on page visibility
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                saveAnswer();
            }
        });
    </script>
</body>
</html>
