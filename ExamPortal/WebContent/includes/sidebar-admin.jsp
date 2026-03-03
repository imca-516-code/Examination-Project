<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="currentPath" value="${requestScope['jakarta.servlet.forward.servlet_path']}" />
<aside class="sidebar">
    <div class="sidebar-header">
        <div class="sidebar-logo">EP</div>
        <div>
            <div class="sidebar-brand-name">ExamPortal</div>
            <div class="sidebar-brand-sub">Admin Panel</div>
        </div>
    </div>
    <div class="sidebar-separator"></div>
    <div class="sidebar-group-label">Navigation</div>
    <ul class="sidebar-nav">
        <li class="sidebar-nav-item ${currentPath == '/admin/dashboard' ? 'active' : ''}">
            <a href="${pageContext.request.contextPath}/admin/dashboard">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                <span>Dashboard</span>
            </a>
        </li>
        <li class="sidebar-nav-item ${currentPath.startsWith('/admin/exam') ? 'active' : ''}">
            <a href="${pageContext.request.contextPath}/admin/exams">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
                <span>Exams</span>
            </a>
        </li>
        <li class="sidebar-nav-item ${currentPath.startsWith('/admin/question') ? 'active' : ''}">
            <a href="${pageContext.request.contextPath}/admin/questions">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                <span>Question Bank</span>
            </a>
        </li>
        <li class="sidebar-nav-item ${currentPath == '/admin/students' ? 'active' : ''}">
            <a href="${pageContext.request.contextPath}/admin/students">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span>Students</span>
            </a>
        </li>
        <li class="sidebar-nav-item ${currentPath == '/admin/reports' ? 'active' : ''}">
            <a href="${pageContext.request.contextPath}/admin/reports">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                <span>Reports</span>
            </a>
        </li>
    </ul>
    <div class="sidebar-footer">
        <div class="sidebar-separator"></div>
        <div class="sidebar-user">
            <div class="sidebar-avatar">${sessionScope.user.initial}</div>
            <div class="sidebar-user-info">
                <div class="sidebar-user-name">${sessionScope.user.name}</div>
                <div class="sidebar-user-email">${sessionScope.user.email}</div>
            </div>
            <a href="${pageContext.request.contextPath}/logout" class="sidebar-logout-btn" title="Log out">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </a>
        </div>
    </div>
</aside>
