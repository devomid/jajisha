import * as Yup from "yup";

export const signInSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().min(5).required("Password is required"),
});

const signUpSchema = Yup.object({
    name: Yup.string()
        .trim()
        .required("Name is required"),

    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),

    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),

    birthYear: Yup.number()
        .typeError("Birth year must be a number")
        .integer("Birth year must be a whole number")
        .min(1900, "Invalid birth year")
        .max(new Date().getFullYear(), "Invalid birth year")
        .required("Birth year is required"),
});

