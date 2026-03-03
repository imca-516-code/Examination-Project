<%@ page contentType="text/html; charset=UTF-8" %>
<%@ page import="com.examportal.models.User" %>
<header style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 0; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <nav style="display: flex; justify-content: space-between; align-items: center; padding: 15px 30px; max-width: 1400px; margin: 0 auto;">
        <div style="font-size: 24px; font-weight: bold; color: white;">
            <a href="${pageContext.request.contextPath}/dashboard/exams" style="color: white; text-decoration: none;">
                ExamPortal
            </a>
        </div>
        
        <ul style="display: flex; list-style: none; gap: 30px; margin: 0; align-items: center;">
            <li>
                <% 
                    User user = (User) session.getAttribute("user");
                    if (user != null) {
                %>
                    <span style="color: white; font-size: 14px;">
                        Welcome, <%= user.getFirstName() %>
                    </span>
                <% } %>
            </li>
            <li>
                <a href="${pageContext.request.contextPath}/logout" style="color: white; text-decoration: none; font-weight: 500; transition: opacity 0.3s;">
                    Logout
                </a>
            </li>
        </ul>
    </nav>
</header>
