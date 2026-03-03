<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<c:set var="currentPath" value="${requestScope['jakarta.servlet.forward.servlet_path']}" />
<aside class="sidebar">
    <div class="sidebar-header">
        <div class="sidebar-logo">EP</div>
        <div>
            <div class="sidebar-brand-name">ExamPortal</div>
            <div class="sidebar-brand-sub">Student Panel</div>
        </div>
    </div>
    <div class="sidebar-separator"></div>
    <div class="sidebar-group-label">Navigation</div>
    <ul class="sidebar-nav">
        <li class="sidebar-nav-item ${currentPath == '/student/dashboard' ? 'active' : ''}">
            <a href="${pageContext.request.contextPath}/student/dashboard">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                <span>Dashboard</span>
            </a>
        </li>
        <li class="sidebar-nav-item ${currentPath.startsWith('/student/result') ? 'active' : ''}">
            <a href="${pageContext.request.contextPath}/student/results">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
                <span>My Results</span>
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
