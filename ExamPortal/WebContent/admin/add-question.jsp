<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<jsp:include page="/includes/header.jsp"><jsp:param name="title" value="Add Question" /></jsp:include>

<div class="app-layout">
    <jsp:include page="/includes/sidebar-admin.jsp" />
    <main class="main-content">
        <div style="display:flex;flex-direction:column;gap:1.5rem;max-width:48rem;">
            <div>
                <h1>Add New Question</h1>
                <p class="text-sm text-muted">Create a multiple-choice question</p>
            </div>

            <form method="post" action="${pageContext.request.contextPath}/admin/questions/new">
                <div class="card">
                    <div class="card-content" style="padding-top:1.5rem;">
                        <div style="display:flex;flex-direction:column;gap:1rem;">
                            <div class="form-group">
                                <label class="form-label" for="text">Question Text</label>
                                <textarea class="form-textarea" id="text" name="text" required placeholder="Enter the question text"></textarea>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="optionA">Option A</label>
                                <input class="form-input" type="text" id="optionA" name="optionA" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="optionB">Option B</label>
                                <input class="form-input" type="text" id="optionB" name="optionB" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="optionC">Option C</label>
                                <input class="form-input" type="text" id="optionC" name="optionC" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="optionD">Option D</label>
                                <input class="form-input" type="text" id="optionD" name="optionD" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label" for="correctAnswer">Correct Answer</label>
                                <select class="form-select" id="correctAnswer" name="correctAnswer" required>
                                    <option value="0">A</option>
                                    <option value="1">B</option>
                                    <option value="2">C</option>
                                    <option value="3">D</option>
                                </select>
                            </div>
                            <div class="grid grid-cols-2" style="gap:1rem;">
                                <div class="form-group">
                                    <label class="form-label" for="subject">Subject</label>
                                    <select class="form-select" id="subject" name="subject" required>
                                        <option value="Mathematics">Mathematics</option>
                                        <option value="Science">Science</option>
                                        <option value="Programming">Programming</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="difficulty">Difficulty</label>
                                    <select class="form-select" id="difficulty" name="difficulty" required>
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer" style="display:flex;gap:0.5rem;">
                        <button type="submit" class="btn btn-primary">Add Question</button>
                        <a href="${pageContext.request.contextPath}/admin/questions" class="btn btn-outline">Cancel</a>
                    </div>
                </div>
            </form>
        </div>
    </main>
</div>

<jsp:include page="/includes/footer.jsp" />
