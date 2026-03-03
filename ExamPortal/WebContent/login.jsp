<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<jsp:include page="/includes/header.jsp">
    <jsp:param name="title" value="Sign In" />
</jsp:include>

<div class="auth-page">
    <div class="auth-container">
        <div class="auth-branding">
            <div class="auth-logo">EP</div>
            <div class="text-center">
                <h1 class="auth-title">ExamPortal</h1>
                <p class="auth-subtitle">Smart Online Examination System</p>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Sign in</h2>
                <p class="card-description">Enter your credentials to access the system</p>
            </div>

            <c:if test="${not empty error}">
                <div style="padding: 0 1.5rem;">
                    <div class="alert alert-error">${error}</div>
                </div>
            </c:if>

            <form method="post" action="${pageContext.request.contextPath}/login">
                <div class="card-content" style="padding-top: 0.75rem;">
                    <div class="flex-col gap-4" style="display:flex;flex-direction:column;gap:1rem;">
                        <div class="form-group">
                            <label class="form-label" for="email">Email</label>
                            <input class="form-input" type="email" id="email" name="email"
                                   placeholder="you@example.com" value="${email}" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="password">Password</label>
                            <div class="password-wrapper">
                                <input class="form-input" type="password" id="password" name="password"
                                       placeholder="Enter your password" required>
                                <button type="button" class="password-toggle" onclick="togglePassword('password', this)" aria-label="Show password">
                                    Show
                                </button>
                            </div>
                        </div>
                        <div class="demo-box">
                            <p style="font-weight:500;margin-bottom:0.5rem;">Demo accounts:</p>
                            <p><span class="demo-label">Admin:</span> admin@exam.com / admin123</p>
                            <p><span class="demo-label">Student:</span> alice@exam.com / student123</p>
                        </div>
                    </div>
                </div>
                <div class="card-footer" style="display:flex;flex-direction:column;gap:0.75rem;align-items:center;">
                    <button type="submit" class="btn btn-primary btn-block">Sign in</button>
                    <p class="text-sm text-muted">
                        Don't have an account?
                        <a href="${pageContext.request.contextPath}/register" style="color:var(--primary);font-weight:500;">Register as Student</a>
                    </p>
                </div>
            </form>
        </div>
    </div>
</div>

<jsp:include page="/includes/footer.jsp" />
