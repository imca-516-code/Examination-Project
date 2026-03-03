<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>
<jsp:include page="/includes/header.jsp"><jsp:param name="title" value="Students" /></jsp:include>

<div class="app-layout">
    <jsp:include page="/includes/sidebar-admin.jsp" />
    <main class="main-content">
        <div style="display:flex;flex-direction:column;gap:1.5rem;">
            <div>
                <h1>Students</h1>
                <p class="text-sm text-muted">View all registered students</p>
            </div>

            <div class="card">
                <div class="card-content" style="padding-top:1.5rem;">
                    <c:choose>
                        <c:when test="${not empty studentData}">
                            <table class="data-table">
                                <thead>
                                    <tr><th>Name</th><th>Email</th><th>Exams Taken</th><th>Avg Score</th><th>Registered</th></tr>
                                </thead>
                                <tbody>
                                    <c:forEach var="sd" items="${studentData}">
                                        <tr>
                                            <td class="font-medium">${sd.user.name}</td>
                                            <td class="text-muted">${sd.user.email}</td>
                                            <td>${sd.attemptCount}</td>
                                            <td class="font-mono">${sd.avgScore}%</td>
                                            <td class="text-muted"><fmt:formatDate value="${sd.user.createdAt}" pattern="MMM d, yyyy" /></td>
                                        </tr>
                                    </c:forEach>
                                </tbody>
                            </table>
                        </c:when>
                        <c:otherwise>
                            <p class="text-sm text-muted" style="padding:2rem 0;text-align:center;">No students registered yet.</p>
                        </c:otherwise>
                    </c:choose>
                </div>
            </div>
        </div>
    </main>
</div>

<jsp:include page="/includes/footer.jsp" />
