"use client";

import { ReactNode, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { Provider, useDispatch } from "react-redux";
import { store } from "../store";
import { authService } from "@/services/auth";
import { setUser } from "@/store/slices/authSlice";

// Inner component to use hooks
function ProvidersInner({ children }: { children: ReactNode }) {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await authService.getMe(); // call /auth/me
                if (data.success) {
                    dispatch(setUser(data.user));
                }
            } catch (err) {
                console.log("User not logged in", err);
            }
        };
        fetchUser();
    }, [dispatch]);

    return <>{children}</>;
}

// Outer wrapper with Redux and ThemeProvider
export function Providers({ children }: { children: ReactNode }) {
    return (
        <Provider store={store}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <ProvidersInner>{children}</ProvidersInner>
            </ThemeProvider>
        </Provider>
    );
}
