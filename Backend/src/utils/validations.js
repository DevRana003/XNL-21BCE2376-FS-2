import Joi from "joi";

export const registerUserSchema = Joi.object({
    fullName: Joi.string().min(3).max(50).required().messages({
        "string.empty": "Full Name is required",
        "string.min": "Full Name must be at least 3 characters",
        "string.max": "Full Name must not exceed 50 characters",
    }),
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Invalid email format",
    }),
    username: Joi.string().min(3).max(30).required().messages({
        "string.empty": "Username is required",
        "string.min": "Username must be at least 3 characters",
        "string.max": "Username must not exceed 30 characters",
    }),
    password: Joi.string().min(6).max(20).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters",
        "string.max": "Password must not exceed 20 characters",
    }),
    role: Joi.string().valid("User", "Trainer", "Admin").optional(),
});

// for login 
export const loginUserSchema = Joi.object({
    username: Joi.string().required().messages({
        "string.empty": "Username is required",
    }),
    password: Joi.string().required().messages({
        "string.empty": "Password is required",
    }),
});

// for password change
export const changePasswordSchema = Joi.object({
    oldPassword: Joi.string().required().messages({
        "string.empty": "Old Password is required",
    }),
    newPassword: Joi.string().min(6).max(20).required().messages({
        "string.empty": "New Password is required",
        "string.min": "New Password must be at least 6 characters",
        "string.max": "New Password must not exceed 20 characters",
    }),
});

//for updating account details
export const updateAccountSchema = Joi.object({
    fullName: Joi.string().min(3).max(50).optional(),
    email: Joi.string().email().optional(),
});
