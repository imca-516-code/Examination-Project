package com.examportal.filter;

import com.examportal.model.User;
import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.*;
import java.io.IOException;

/**
 * Checks for a valid session on all /admin/* and /student/* routes.
 * Redirects to login if unauthenticated, or to the correct dashboard if
 * the user's role does not match the URL prefix.
 */
@WebFilter(urlPatterns = {"/admin/*", "/student/*"})
public class AuthFilter implements Filter {

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest  request  = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        HttpSession session = request.getSession(false);
        User user = (session != null) ? (User) session.getAttribute("user") : null;

        if (user == null) {
            response.sendRedirect(request.getContextPath() + "/login");
            return;
        }

        String path = request.getServletPath();

        // Role-based access control
        if (path.startsWith("/admin") && !"admin".equals(user.getRole())) {
            response.sendRedirect(request.getContextPath() + "/student/dashboard");
            return;
        }
        if (path.startsWith("/student") && !"student".equals(user.getRole())) {
            response.sendRedirect(request.getContextPath() + "/admin/dashboard");
            return;
        }

        chain.doFilter(req, res);
    }
}
