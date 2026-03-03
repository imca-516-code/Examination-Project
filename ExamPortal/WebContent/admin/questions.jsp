<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<jsp:include page="/includes/header.jsp"><jsp:param name="title" value="Question Bank" /></jsp:include>

<div class="app-layout">
    <jsp:include page="/includes/sidebar-admin.jsp" />
    <main class="main-content">
        <div style="display:flex;flex-direction:column;gap:1.5rem;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
                <div>
                    <h1>Question Bank</h1>
                    <p class="text-sm text-muted">Manage your question repository</p>
                </div>
                <a href="${pageContext.request.contextPath}/admin/questions/new" class="btn btn-primary">+ Add Question</a>
            </div>

            <!-- Search / Filter -->
            <div class="card">
                <div class="card-content" style="padding-top:1.25rem;">
                    <form method="get" action="${pageContext.request.contextPath}/admin/questions" style="display:flex;gap:0.75rem;flex-wrap:wrap;align-items:flex-end;">
                        <div class="form-group" style="flex:1;min-width:180px;">
                            <label class="form-label" for="q">Search</label>
                            <input class="form-input" type="text" id="q" name="q" placeholder="Search questions..." value="${keyword}">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="subject">Subject</label>
                            <select class="form-select" id="subject" name="subject">
                                <option value="">All Subjects</option>
                                <option value="Mathematics" ${selectedSubject == 'Mathematics' ? 'selected' : ''}>Mathematics</option>
                                <option value="Science" ${selectedSubject == 'Science' ? 'selected' : ''}>Science</option>
                                <option value="Programming" ${selectedSubject == 'Programming' ? 'selected' : ''}>Programming</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="difficulty">Difficulty</label>
                            <select class="form-select" id="difficulty" name="difficulty">
                                <option value="">All</option>
                                <option value="easy" ${selectedDifficulty == 'easy' ? 'selected' : ''}>Easy</option>
                                <option value="medium" ${selectedDifficulty == 'medium' ? 'selected' : ''}>Medium</option>
                                <option value="hard" ${selectedDifficulty == 'hard' ? 'selected' : ''}>Hard</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-secondary">Filter</button>
                    </form>
                </div>
            </div>

            <div class="card">
                <div class="card-content" style="padding-top:1.5rem;">
                    <c:choose>
                        <c:when test="${not empty questions}">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Question</th>
                                        <th>Subject</th>
                                        <th>Difficulty</th>
                                        <th>Answer</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <c:forEach var="q" items="${questions}">
                                        <tr>
                                            <td class="font-medium" style="max-width:300px;">
                                                <div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${q.text}</div>
                                            </td>
                                            <td><span class="badge badge-outline">${q.subject}</span></td>
                                            <td>
                                                <c:choose>
                                                    <c:when test="${q.difficulty == 'easy'}"><span class="badge badge-success">Easy</span></c:when>
                                                    <c:when test="${q.difficulty == 'medium'}"><span class="badge badge-warning">Medium</span></c:when>
                                                    <c:otherwise><span class="badge badge-destructive">Hard</span></c:otherwise>
                                                </c:choose>
                                            </td>
                                            <td class="font-mono">${q.correctAnswerLabel}</td>
                                            <td>
                                                <form method="post" action="${pageContext.request.contextPath}/admin/questions/delete" style="display:inline;" onsubmit="return confirm('Delete this question?');">
                                                    <input type="hidden" name="id" value="${q.id}">
                                                    <button type="submit" class="btn btn-destructive btn-sm">Delete</button>
                                                </form>
                                            </td>
                                        </tr>
                                    </c:forEach>
                                </tbody>
                            </table>
                        </c:when>
                        <c:otherwise>
                            <p class="text-sm text-muted" style="padding:2rem 0;text-align:center;">No questions found.</p>
                        </c:otherwise>
                    </c:choose>
                </div>
            </div>
        </div>
    </main>
</div>

<jsp:include page="/includes/footer.jsp" />
