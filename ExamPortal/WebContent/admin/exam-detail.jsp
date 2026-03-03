<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>
<jsp:include page="/includes/header.jsp"><jsp:param name="title" value="Exam Details" /></jsp:include>

<div class="app-layout">
    <jsp:include page="/includes/sidebar-admin.jsp" />
    <main class="main-content">
        <div style="display:flex;flex-direction:column;gap:1.5rem;max-width:48rem;">
            <div style="display:flex;align-items:center;gap:0.75rem;">
                <a href="${pageContext.request.contextPath}/admin/exams" class="btn btn-ghost btn-sm">&larr;</a>
                <div>
                    <h1>${exam.title}</h1>
                    <p class="text-sm text-muted">${exam.subject} &middot; ${exam.duration} min &middot;
                        <c:choose>
                            <c:when test="${exam.status == 'active'}"><span style="color:var(--success);">Active</span></c:when>
                            <c:otherwise><span style="color:var(--warning-foreground);">${exam.status}</span></c:otherwise>
                        </c:choose>
                    </p>
                </div>
            </div>

            <!-- Info -->
            <div class="card">
                <div class="card-header"><div class="card-title">Details</div></div>
                <div class="card-content">
                    <p class="text-sm" style="margin-bottom:1rem;">${exam.description}</p>
                    <div class="grid grid-cols-4" style="gap:1rem;">
                        <div><div class="text-xs text-muted">Total Questions</div><div class="font-bold">${exam.totalQuestions}</div></div>
                        <div><div class="text-xs text-muted">Duration</div><div class="font-bold">${exam.duration} min</div></div>
                        <div><div class="text-xs text-muted">Passing Score</div><div class="font-bold">${exam.passingScore}%</div></div>
                        <div><div class="text-xs text-muted">Scheduled</div><div class="font-bold"><fmt:formatDate value="${exam.scheduledAt}" pattern="MMM d, yyyy" /></div></div>
                    </div>
                </div>
            </div>

            <!-- Questions -->
            <div class="card">
                <div class="card-header"><div class="card-title">Questions (${exam.totalQuestions})</div></div>
                <div class="card-content">
                    <c:forEach var="q" items="${questions}" varStatus="s">
                        <div style="padding:0.75rem 0;border-bottom:1px solid var(--border);">
                            <div class="text-sm"><span class="text-muted">Q${s.index + 1}.</span> ${q.text}</div>
                            <div class="text-xs text-muted" style="margin-top:0.25rem;">Answer: ${q.correctAnswerLabel} &middot; ${q.difficulty}</div>
                        </div>
                    </c:forEach>
                </div>
            </div>

            <!-- Submissions -->
            <div class="card">
                <div class="card-header"><div class="card-title">Submissions</div></div>
                <div class="card-content">
                    <c:choose>
                        <c:when test="${not empty attempts}">
                            <table class="data-table">
                                <thead><tr><th>Student</th><th>Score</th><th>Status</th><th>Submitted</th></tr></thead>
                                <tbody>
                                    <c:forEach var="a" items="${attempts}">
                                        <tr>
                                            <td class="font-medium">${a.studentName}</td>
                                            <td class="font-mono"><c:if test="${a.score != null}"><fmt:formatNumber value="${a.score}" maxFractionDigits="0" />%</c:if><c:if test="${a.score == null}">-</c:if></td>
                                            <td>
                                                <c:choose>
                                                    <c:when test="${a.status == 'submitted' && a.passed}"><span class="badge badge-success">Passed</span></c:when>
                                                    <c:when test="${a.status == 'submitted'}"><span class="badge badge-destructive">Failed</span></c:when>
                                                    <c:otherwise><span class="badge badge-warning">In Progress</span></c:otherwise>
                                                </c:choose>
                                            </td>
                                            <td class="text-muted"><c:if test="${a.submittedAt != null}"><fmt:formatDate value="${a.submittedAt}" pattern="MMM d, yyyy HH:mm" /></c:if></td>
                                        </tr>
                                    </c:forEach>
                                </tbody>
                            </table>
                        </c:when>
                        <c:otherwise>
                            <p class="text-sm text-muted" style="padding:1.5rem 0;text-align:center;">No submissions yet.</p>
                        </c:otherwise>
                    </c:choose>
                </div>
            </div>
        </div>
    </main>
</div>

<jsp:include page="/includes/footer.jsp" />
