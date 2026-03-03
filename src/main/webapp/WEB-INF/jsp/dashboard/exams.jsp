<%@ page contentType="text/html; charset=UTF-8" %>
<%@ page import="java.util.List" %>
<%@ page import="com.examportal.models.Exam" %>
<%@ page import="com.examportal.models.ExamAttempt" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.Map" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Available Exams - ExamPortal</title>
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
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
        }

        .page-header {
            margin-bottom: 40px;
        }

        .page-header h1 {
            color: #333;
            font-size: 32px;
            margin-bottom: 10px;
        }

        .page-header p {
            color: #666;
            font-size: 16px;
        }

        .tabs {
            display: flex;
            gap: 20px;
            margin-bottom: 30px;
            border-bottom: 2px solid #e0e0e0;
        }

        .tab-button {
            padding: 12px 20px;
            background: none;
            border: none;
            font-size: 16px;
            color: #666;
            cursor: pointer;
            position: relative;
            font-weight: 500;
            transition: color 0.3s;
        }

        .tab-button.active {
            color: #667eea;
        }

        .tab-button.active::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            right: 0;
            height: 2px;
            background: #667eea;
        }

        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
        }

        .exams-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
        }

        .exam-card {
            background: white;
            border-radius: 8px;
            padding: 24px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            transition: transform 0.3s, box-shadow 0.3s;
            cursor: pointer;
        }

        .exam-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
        }

        .exam-title {
            font-size: 20px;
            font-weight: 600;
            color: #333;
            margin-bottom: 10px;
        }

        .exam-description {
            color: #666;
            font-size: 14px;
            margin-bottom: 15px;
            line-height: 1.5;
        }

        .exam-meta {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-top: 1px solid #f0f0f0;
            border-bottom: 1px solid #f0f0f0;
            margin: 15px 0;
            font-size: 13px;
            color: #666;
        }

        .meta-item {
            display: flex;
            flex-direction: column;
        }

        .meta-label {
            font-size: 11px;
            font-weight: 600;
            color: #999;
            text-transform: uppercase;
            margin-bottom: 4px;
        }

        .meta-value {
            color: #333;
            font-weight: 500;
        }

        .exam-button {
            width: 100%;
            padding: 10px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .exam-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .exam-button.review {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #999;
        }

        .empty-state h3 {
            font-size: 20px;
            margin-bottom: 10px;
            color: #666;
        }

        .attempt-badge {
            display: inline-block;
            background: #e3f2fd;
            color: #1976d2;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 12px;
        }

        .score-badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
        }

        .score-badge.pass {
            background: #c8e6c9;
            color: #2e7d32;
        }

        .score-badge.fail {
            background: #ffcccc;
            color: #c62828;
        }
    </style>
</head>
<body>
    <jsp:include page="/WEB-INF/jsp/includes/header.jsp" />
    
    <div class="container">
        <div class="page-header">
            <h1>Exams</h1>
            <p>Take an exam or review your previous attempts</p>
        </div>

        <div class="tabs">
            <button class="tab-button active" onclick="switchTab(event, 'available')">
                Available Exams
            </button>
            <button class="tab-button" onclick="switchTab(event, 'attempts')">
                My Attempts
            </button>
        </div>

        <!-- Available Exams Tab -->
        <div id="available" class="tab-content active">
            <%
                List<Exam> exams = (List<Exam>) request.getAttribute("exams");
                if (exams != null && !exams.isEmpty()) {
            %>
                <div class="exams-grid">
                    <% for (Exam exam : exams) { %>
                        <div class="exam-card">
                            <div class="exam-title"><%= exam.getTitle() %></div>
                            <div class="exam-description"><%= exam.getDescription() %></div>
                            
                            <div class="exam-meta">
                                <div class="meta-item">
                                    <span class="meta-label">Duration</span>
                                    <span class="meta-value"><%= exam.getDurationMinutes() %> mins</span>
                                </div>
                                <div class="meta-item">
                                    <span class="meta-label">Questions</span>
                                    <span class="meta-value"><%= exam.getTotalQuestions() %></span>
                                </div>
                                <div class="meta-item">
                                    <span class="meta-label">Passing %</span>
                                    <span class="meta-value"><%= exam.getPassingPercentage() %>%</span>
                                </div>
                            </div>

                            <a href="${pageContext.request.contextPath}/dashboard/attempt/<%= exam.getId() %>" 
                               style="text-decoration: none;">
                                <button class="exam-button">Start Exam</button>
                            </a>
                        </div>
                    <% } %>
                </div>
            <% } else { %>
                <div class="empty-state">
                    <h3>No exams available</h3>
                    <p>Check back later for new exams</p>
                </div>
            <% } %>
        </div>

        <!-- My Attempts Tab -->
        <div id="attempts" class="tab-content">
            <%
                List<ExamAttempt> attempts = (List<ExamAttempt>) request.getAttribute("attempts");
                if (attempts != null && !attempts.isEmpty()) {
            %>
                <div class="exams-grid">
                    <% for (ExamAttempt attempt : attempts) { %>
                        <div class="exam-card">
                            <div class="attempt-badge">
                                <%= attempt.getStatus().toUpperCase() %>
                            </div>
                            
                            <div class="exam-title">Attempt #<%= attempt.getId() %></div>
                            
                            <div class="exam-meta">
                                <div class="meta-item">
                                    <span class="meta-label">Status</span>
                                    <span class="meta-value"><%= attempt.getStatus() %></span>
                                </div>
                                <% if (attempt.getPercentageScore() != null) { %>
                                    <div class="meta-item">
                                        <span class="meta-label">Score</span>
                                        <span class="meta-value">
                                            <span class="score-badge <%= attempt.getPercentageScore().doubleValue() >= 40 ? "pass" : "fail" %>">
                                                <%= String.format("%.1f", attempt.getPercentageScore()) %>%
                                            </span>
                                        </span>
                                    </div>
                                <% } %>
                            </div>

                            <a href="${pageContext.request.contextPath}/dashboard/result/<%= attempt.getId() %>" 
                               style="text-decoration: none;">
                                <button class="exam-button review">View Details</button>
                            </a>
                        </div>
                    <% } %>
                </div>
            <% } else { %>
                <div class="empty-state">
                    <h3>No attempts yet</h3>
                    <p>Start an exam from the Available Exams tab</p>
                </div>
            <% } %>
        </div>
    </div>

    <script>
        function switchTab(event, tabName) {
            // Hide all tabs
            const tabs = document.querySelectorAll('.tab-content');
            tabs.forEach(tab => tab.classList.remove('active'));

            // Remove active from all buttons
            const buttons = document.querySelectorAll('.tab-button');
            buttons.forEach(btn => btn.classList.remove('active'));

            // Show selected tab
            document.getElementById(tabName).classList.add('active');

            // Add active to clicked button
            event.target.classList.add('active');
        }
    </script>
</body>
</html>
