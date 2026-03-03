<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<jsp:include page="/includes/header.jsp"><jsp:param name="title" value="Reports" /></jsp:include>

<div class="app-layout">
    <jsp:include page="/includes/sidebar-admin.jsp" />
    <main class="main-content">
        <div style="display:flex;flex-direction:column;gap:1.5rem;">
            <div>
                <h1>Reports</h1>
                <p class="text-sm text-muted">Analytics and performance reports</p>
            </div>

            <div class="grid grid-cols-2" style="gap:1.5rem;">
                <!-- Score Distribution -->
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">Score Distribution</div>
                        <p class="card-description">Number of students per score range</p>
                    </div>
                    <div class="card-content">
                        <div class="bar-chart">
                            <c:set var="labels" value="${['0-20%','21-40%','41-60%','61-80%','81-100%']}" />
                            <c:forEach var="i" begin="0" end="4">
                                <div class="bar-chart-col">
                                    <div class="bar-chart-value">${scoreDistribution[i]}</div>
                                    <div class="bar-chart-bar" style="height:${scoreDistribution[i] > 0 ? (scoreDistribution[i] * 20 > 100 ? 100 : scoreDistribution[i] * 20) : 2}%;background:var(--chart-${i+1});"></div>
                                    <div class="bar-chart-label">
                                        <c:choose>
                                            <c:when test="${i==0}">0-20%</c:when>
                                            <c:when test="${i==1}">21-40%</c:when>
                                            <c:when test="${i==2}">41-60%</c:when>
                                            <c:when test="${i==3}">61-80%</c:when>
                                            <c:when test="${i==4}">81-100%</c:when>
                                        </c:choose>
                                    </div>
                                </div>
                            </c:forEach>
                        </div>
                    </div>
                </div>

                <!-- Subject Performance -->
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">Subject Performance</div>
                        <p class="card-description">Average score by subject</p>
                    </div>
                    <div class="card-content">
                        <div class="bar-chart">
                            <c:set var="colorIdx" value="1" />
                            <c:forEach var="entry" items="${subjectAvg}">
                                <div class="bar-chart-col">
                                    <div class="bar-chart-value">${entry.value}%</div>
                                    <div class="bar-chart-bar" style="height:${entry.value > 0 ? entry.value : 2}%;background:var(--chart-${colorIdx});"></div>
                                    <div class="bar-chart-label">${entry.key}</div>
                                </div>
                                <c:set var="colorIdx" value="${colorIdx + 1}" />
                            </c:forEach>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Leaderboard -->
            <div class="card">
                <div class="card-header">
                    <div class="card-title">Leaderboard</div>
                    <p class="card-description">Top performing students</p>
                </div>
                <div class="card-content">
                    <c:choose>
                        <c:when test="${not empty leaderboard}">
                            <table class="data-table">
                                <thead><tr><th>#</th><th>Student</th><th>Email</th><th>Exams</th><th>Avg Score</th></tr></thead>
                                <tbody>
                                    <c:forEach var="entry" items="${leaderboard}" varStatus="s">
                                        <tr>
                                            <td class="font-bold">${s.index + 1}</td>
                                            <td class="font-medium">${entry.name}</td>
                                            <td class="text-muted">${entry.email}</td>
                                            <td>${entry.attempts}</td>
                                            <td class="font-mono font-bold">${entry.avgScore}%</td>
                                        </tr>
                                    </c:forEach>
                                </tbody>
                            </table>
                        </c:when>
                        <c:otherwise>
                            <p class="text-sm text-muted" style="padding:2rem 0;text-align:center;">No data available yet.</p>
                        </c:otherwise>
                    </c:choose>
                </div>
            </div>
        </div>
    </main>
</div>

<jsp:include page="/includes/footer.jsp" />
