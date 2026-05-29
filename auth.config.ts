import { type NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnProtectedRoute = nextUrl.pathname !== '/';
            if (!isLoggedIn && isOnProtectedRoute) {
                return false;
            }
            return true;
        },
    },
    providers: [], 
} satisfies NextAuthConfig;