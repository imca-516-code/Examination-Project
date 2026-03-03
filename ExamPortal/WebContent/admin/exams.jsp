<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>
<jsp:include page="/includes/header.jsp"><jsp:param name="title" value="Manage Exams" /></jsp:include>

<div class="app-layout">
    <jsp:include page="/includes/sidebar-admin.jsp" />
    <main class="main-content">
        <div style="display:flex;flex-direction:column;gap:1.5rem;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
                <div>
                    <h1>Exams</h1>
                    <p class="text-sm text-muted">Manage your examinations</p>
                </div>
                <a href="${pageContext.request.contextPath}/admin/exams/new" class="btn btn-primary">+ Create Exam</a>
            </div>

            <div class="card">
                <div class="card-content" style="padding-top:1.5rem;">
                    <c:choose>
                        <c:when test="${not empty exams}">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Subject</th>
                                        <th>Duration</th>
                                        <th>Questions</th>
                                        <th>Pass %</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <c:forEach var="exam" items="${exams}">
                                        <tr>
                                            <td class="font-medium">
                                                <a href="${pageContext.request.contextPath}/admin/exams/detail?id=${exam.id}" style="color:var(--primary);">${exam.title}</a>
                                            </td>
                                            <td><span class="badge badge-outline">${exam.subject}</span></td>
                                            <td>${exam.duration} min</td>
                                            <td>${exam.totalQuestions}</td>
                                            <td>${exam.passingScore}%</td>
                                            <td>
                                                <c:choose>
                                                    <c:when test="${exam.status == 'active'}"><span class="badge badge-success">Active</span></c:when>
                                                    <c:when test="${exam.status == 'draft'}"><span class="badge badge-warning">Draft</span></c:when>
                                                    <c:otherwise><span class="badge badge-secondary">${exam.status}</span></c:otherwise>
                                                </c:choose>
                                            </td>
                                            <td>
                                                <div style="display:flex;gap:0.5rem;">
                                                    <form method="post" action="${pageContext.request.contextPath}/admin/exams/toggle-status" style="display:inline;">
                                                        <input type="hidden" name="id" value="${exam.id}">
                                                        <button type="submit" class="btn btn-outline btn-sm">
                                                            ${exam.status == 'active' ? 'Deactivate' : 'Activate'}
                                                        </button>
                                                    </form>
                                                    <form method="post" action="${pageContext.request.contextPath}/admin/exams/delete" style="display:inline;" onsubmit="return confirm('Delete this exam?');">
                                                        <input type="hidden" name="id" value="${exam.id}">
                                                        <button type="submit" class="btn btn-destructive btn-sm">Delete</button>
                                                    </form>
                                                </div>
                                            </td>
                                        </tr>
                                    </c:forEach>
                                </tbody>
                            </table>
                        </c:when>
                        <c:otherwise>
                            <p class="text-sm text-muted" style="padding:2rem 0;text-align:center;">No exams created yet.</p>
                        </c:otherwise>
                    </c:choose>
                </div>
            </div>
        </div>
    </main>
</div>

<jsp:include page="/includes/footer.jsp" />
