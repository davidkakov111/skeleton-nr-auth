import { api } from "./axios";

// Update user email
export const updateUserEmail = (email: string) => {
    return api.put<{ message: string }>("/user/me/email", { email });
};

// Update user password 
export const updateUserPassword = (newPassword: string, currentPassword: string) => {
    return api.put<{ message: string }>("/user/me/password", { newPassword, currentPassword });
};
