import { useState, useEffect } from "react";
import NeonClient from "../neon-client";

const STORAGE_KEY = 'inventoryUser';

export function useAuth() {
    const [currentUser, setCurrentUser] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [registerUsername, setRegisterUsername] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [registerRole, setRegisterRole] = useState("spectator");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const savedUser = localStorage.getItem(STORAGE_KEY);
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                setCurrentUser(user);
            } catch (error) {
                console.error('Failed to parse saved user:', error);
                localStorage.removeItem(STORAGE_KEY);
            }
        }
    }, []);

    const login = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const user = await NeonClient.loginUser(username, password);
            if (user) {
                setCurrentUser(user);
                setUsername('');
                setPassword('');
                localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
            } else {
                alert('Invalid username or password');
            }
        } catch (err) {
            console.error("Login error:", err);
            alert("Login failed: " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await NeonClient.registerUser(registerUsername, registerPassword, registerRole);
            alert("Registration successful. You may log in.");
            setRegisterUsername("");
            setRegisterPassword("");
            setRegisterRole("spectator");
        } catch (err) {
            console.error("Registration error:", err);
            if (err.message.includes('Username already exists')) {
                alert("This username is already taken. Please choose a different username.");
            } else {
                alert("Registration failed: " + err.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await fetch(`/users/logout`, {
                method: "POST",
                credentials: "include",
            });
        } catch (err) {
            console.error("Logout error:", err);
        }
        localStorage.removeItem(STORAGE_KEY);
        setCurrentUser(null);
    };

    const clearAuthForms = () => {
        setUsername('');
        setPassword('');
        setRegisterUsername('');
        setRegisterPassword('');
        setRegisterRole("spectator");
    };

    return {
        currentUser,
        username,
        setUsername,
        password,
        setPassword,
        registerUsername,
        setRegisterUsername,
        registerPassword,
        setRegisterPassword,
        registerRole,
        setRegisterRole,
        isLoading,
        login,
        register,
        logout,
        clearAuthForms,
    };
}
