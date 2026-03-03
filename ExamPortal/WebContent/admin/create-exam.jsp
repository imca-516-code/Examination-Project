<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<jsp:include page="/includes/header.jsp"><jsp:param name="title" value="Create Exam" /></jsp:include>

<div class="app-layout">
    <jsp:include page="/includes/sidebar-admin.jsp" />
    <main class="main-content">
        <div style="display:flex;flex-direction:column;gap:1.5rem;max-width:48rem;">
            <div>
                <h1>Create New Exam</h1>
                <p class="text-sm text-muted">Set up a new examination</p>
            </div>

            <form method="post" action="${pageContext.request.contextPath}/admin/exams/new">
                <div class="card">
                    <div class="card-content" style="padding-top:1.5rem;">
                        <div style="display:flex;flex-direction:column;gap:1rem;">
                            <div class="form-group">
                                <label class="form-label" for="title">Title</label>
                                <input class="form-input" type="text" id="title" name="title" required placeholder="Exam title">
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="description">Description</label>
                                <textarea class="form-textarea" id="description" name="description" placeholder="Brief description of this exam"></textarea>
                            </div>
                            <div class="grid grid-cols-2" style="gap:1rem;">
                                <div class="form-group">
                                    <label class="form-label" for="subject">Subject</label>
                                    <select class="form-select" id="subject" name="subject" required>
                                        <option value="">Select subject</option>
                                        <option value="Mathematics">Mathematics</option>
                                        <option value="Science">Science</option>
                                        <option value="Programming">Programming</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="duration">Duration (minutes)</label>
                                    <input class="form-input" type="number" id="duration" name="duration" min="5" max="180" value="30" required>
                                </div>
                            </div>
                            <div class="grid grid-cols-2" style="gap:1rem;">
                                <div class="form-group">
                                    <label class="form-label" for="passingScore">Passing Score (%)</label>
                                    <input class="form-input" type="number" id="passingScore" name="passingScore" min="1" max="100" value="60" required>
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="status">Status</label>
                                    <select class="form-select" id="status" name="status">
                                        <option value="draft">Draft</option>
                                        <option value="active">Active</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="scheduledAt">Scheduled At</label>
                                <input class="form-input" type="datetime-local" id="scheduledAt" name="scheduledAt">
                            </div>

                            <div class="form-group">
                                <label class="form-label">Select Questions</label>
                                <p class="text-xs text-muted" style="margin-bottom:0.5rem;">Tip: filter by subject above first, then select questions below.</p>
                                <div style="max-height:300px;overflow-y:auto;border:1px solid var(--border);border-radius:var(--radius);padding:0.75rem;">
                                    <c:forEach var="q" items="${allQuestions}">
                                        <label style="display:flex;align-items:flex-start;gap:0.5rem;padding:0.5rem 0;border-bottom:1px solid var(--border);cursor:pointer;">
                                            <input type="checkbox" name="questionIds" value="${q.id}" style="margin-top:0.25rem;">
                                            <div>
                                                <div class="text-sm">${q.text}</div>
                                                <div class="text-xs text-muted">${q.subject} &middot; ${q.difficulty}</div>
                                            </div>
                                        </label>
                                    </c:forEach>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer" style="display:flex;gap:0.5rem;">
                        <button type="submit" class="btn btn-primary">Create Exam</button>
                        <a href="${pageContext.request.contextPath}/admin/exams" class="btn btn-outline">Cancel</a>
                    </div>
                </div>
            </form>
        </div>
    </main>
</div>

<jsp:include page="/includes/footer.jsp" />
