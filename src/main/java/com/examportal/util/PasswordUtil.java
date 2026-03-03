package com.examportal.util;

import org.mindrot.jbcrypt.BCrypt;

public class PasswordUtil {
    /**
     * Hash a password using BCrypt
     * @param password the plain text password
     * @return the hashed password
     */
    public static String hashPassword(String password) {
        return BCrypt.hashpw(password, BCrypt.gensalt());
    }

    /**
     * Check if a password matches its hash
     * @param password the plain text password
     * @param hash the hashed password
     * @return true if password matches, false otherwise
     */
    public static boolean checkPassword(String password, String hash) {
        return BCrypt.checkpw(password, hash);
    }
}
