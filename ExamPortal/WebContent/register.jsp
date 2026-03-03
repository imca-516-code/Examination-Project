<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<jsp:include page="/includes/header.jsp">
    <jsp:param name="title" value="Register" />
</jsp:include>

<div class="auth-page">
    <div class="auth-container">
        <div class="auth-branding">
            <div class="auth-logo">EP</div>
            <div class="text-center">
                <h1 class="auth-title">ExamPortal</h1>
                <p class="auth-subtitle">Create your student account</p>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Register</h2>
                <p class="card-description">Fill in your details to create a student account</p>
            </div>

            <c:if test="${not empty error}">
                <div style="padding: 0 1.5rem;">
                    <div class="alert alert-error">${error}</div>
                </div>
            </c:if>

            <form method="post" action="${pageContext.request.contextPath}/register">
                <div class="card-content" style="padding-top: 0.75rem;">
                    <div style="display:flex;flex-direction:column;gap:1rem;">
                        <div class="form-group">
                            <label class="form-label" for="name">Full Name</label>
                            <input class="form-input" type="text" id="name" name="name"
                                   placeholder="John Doe" value="${name}" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="email">Email</label>
                            <input class="form-input" type="email" id="email" name="email"
                                   placeholder="you@example.com" value="${email}" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="password">Password</label>
                            <div class="password-wrapper">
                                <input class="form-input" type="password" id="password" name="password"
                                       placeholder="Min 6 characters" required minlength="6">
                                <button type="button" class="password-toggle" onclick="togglePassword('password', this)" aria-label="Show password">
                                    Show
                                </button>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="confirmPassword">Confirm Password</label>
                            <input class="form-input" type="password" id="confirmPassword" name="confirmPassword"
                                   placeholder="Confirm your password" required minlength="6">
                        </div>
                    </div>
                </div>
                <div class="card-footer" style="display:flex;flex-direction:column;gap:0.75rem;align-items:center;">
                    <button type="submit" class="btn btn-primary btn-block">Create Account</button>
                    <p class="text-sm text-muted">
                        Already have an account?
                        <a href="${pageContext.request.contextPath}/login" style="color:var(--primary);font-weight:500;">Sign in</a>
                    </p>
                </div>
            </form>
        </div>
    </div>
</div>

<jsp:include page="/includes/footer.jsp" />
