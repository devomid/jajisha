import * as Yup from "yup";

export const signInSchema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    password: Yup.string()
        .min(5)
        .required("Password is required"),
});

export const signUpSchema = Yup.object({
    username: Yup.string()
        .trim()
        .required("Username is required"),

    firstName: Yup.string()
        .trim()
        .required("First name is required"),

    lastName: Yup.string()
        .trim()
        .required("Last name is required"),

    email: Yup.string()
        .trim()
        .email("Invalid email address")
        .required("Email is required"),

    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),

    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),
});

