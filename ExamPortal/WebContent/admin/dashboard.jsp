<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>
<jsp:include page="/includes/header.jsp"><jsp:param name="title" value="Admin Dashboard" /></jsp:include>

<div class="app-layout">
    <jsp:include page="/includes/sidebar-admin.jsp" />
    <main class="main-content">
        <div style="display:flex;flex-direction:column;gap:1.5rem;">
            <div>
                <h1>Admin Dashboard</h1>
                <p class="text-sm text-muted">Overview of the examination system</p>
            </div>

            <!-- Stat Cards -->
            <div class="grid grid-cols-4" style="gap:1rem;">
                <div class="card">
                    <div class="stat-card-content">
                        <div class="stat-icon color-1">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        </div>
                        <div>
                            <div class="stat-value">${totalStudents}</div>
                            <div class="stat-label">Total Students</div>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="stat-card-content">
                        <div class="stat-icon color-2">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
                        </div>
                        <div>
                            <div class="stat-value">${totalExams}</div>
                            <div class="stat-label">Total Exams</div>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="stat-card-content">
                        <div class="stat-icon color-3">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                        </div>
                        <div>
                            <div class="stat-value">${totalQuestions}</div>
                            <div class="stat-label">Questions</div>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="stat-card-content">
                        <div class="stat-icon color-5">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                        </div>
                        <div>
                            <div class="stat-value">${avgScore}%</div>
                            <div class="stat-label">Avg Score</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Charts Row -->
            <div class="grid grid-cols-2" style="gap:1.5rem;">
                <!-- Pass/Fail -->
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">Pass / Fail Ratio</div>
                        <p class="card-description">Overall exam results distribution</p>
                    </div>
                    <div class="card-content">
                        <c:choose>
                            <c:when test="${passed + failed > 0}">
                                <div style="display:flex;align-items:center;justify-content:center;gap:2rem;padding:1rem 0;">
                                    <div style="display:flex;gap:1rem;">
                                        <div style="text-align:center;">
                                            <div style="width:80px;height:80px;border-radius:50%;background:rgba(32,201,151,0.15);display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:700;color:var(--success);">${passed}</div>
                                            <div class="text-xs text-muted" style="margin-top:0.5rem;">Passed</div>
                                        </div>
                                        <div style="text-align:center;">
                                            <div style="width:80px;height:80px;border-radius:50%;background:rgba(224,49,49,0.15);display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:700;color:var(--destructive);">${failed}</div>
                                            <div class="text-xs text-muted" style="margin-top:0.5rem;">Failed</div>
                                        </div>
                                    </div>
                                </div>
                            </c:when>
                            <c:otherwise>
                                <p class="text-sm text-muted" style="padding:3rem 0;text-align:center;">No exam attempts yet</p>
                            </c:otherwise>
                        </c:choose>
                    </div>
                </div>

                <!-- Exam Performance -->
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">Exam Performance</div>
                        <p class="card-description">Average score by exam</p>
                    </div>
                    <div class="card-content">
                        <c:choose>
                            <c:when test="${not empty examPerformance}">
                                <div class="bar-chart">
                                    <c:forEach var="ep" items="${examPerformance}">
                                        <div class="bar-chart-col">
                                            <div class="bar-chart-value">${ep.avgScore}%</div>
                                            <div class="bar-chart-bar" style="height:${ep.avgScore > 0 ? ep.avgScore : 2}%;"></div>
                                            <div class="bar-chart-label">${ep.name}</div>
                                        </div>
                                    </c:forEach>
                                </div>
                            </c:when>
                            <c:otherwise>
                                <p class="text-sm text-muted" style="padding:3rem 0;text-align:center;">No performance data yet</p>
                            </c:otherwise>
                        </c:choose>
                    </div>
                </div>
            </div>

            <!-- Recent Attempts -->
            <div class="card">
                <div class="card-header">
                    <div class="card-title">Recent Attempts</div>
                    <p class="card-description">Latest exam submissions</p>
                </div>
                <div class="card-content">
                    <c:choose>
                        <c:when test="${not empty recentAttempts}">
                            <div class="overflow-x-auto">
                                <table class="data-table">
                                    <thead>
                                        <tr>
                                            <th>Student</th>
                                            <th>Exam</th>
                                            <th>Score</th>
                                            <th>Status</th>
                                            <th>Submitted</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <c:forEach var="a" items="${recentAttempts}">
                                            <tr>
                                                <td class="font-medium">${a.studentName}</td>
                                                <td class="text-muted">${a.examTitle}</td>
                                                <td class="font-mono"><fmt:formatNumber value="${a.score}" maxFractionDigits="0" />%</td>
                                                <td>
                                                    <c:choose>
                                                        <c:when test="${a.passed}">
                                                            <span class="badge badge-success">Passed</span>
                                                        </c:when>
                                                        <c:otherwise>
                                                            <span class="badge badge-destructive">Failed</span>
                                                        </c:otherwise>
                                                    </c:choose>
                                                </td>
                                                <td class="text-muted"><fmt:formatDate value="${a.submittedAt}" pattern="MMM d, yyyy HH:mm" /></td>
                                            </tr>
                                        </c:forEach>
                                    </tbody>
                                </table>
                            </div>
                        </c:when>
                        <c:otherwise>
                            <p class="text-sm text-muted" style="padding:2rem 0;text-align:center;">No exam attempts yet. Students can take exams from their dashboard.</p>
                        </c:otherwise>
                    </c:choose>
                </div>
            </div>
        </div>
    </main>
</div>

<jsp:include page="/includes/footer.jsp" />
