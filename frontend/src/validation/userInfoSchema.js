import * as Yup from "yup";

export const signInSchema = (t) =>
    Yup.object().shape({
        email: Yup.string()
            .email(t("app.auth.signin.invalidEmailError"))
            .required(t("app.auth.signin.requiredEmailError")),

        password: Yup.string()
            .min(5, t("app.auth.signin.passwordMinError"))
            .required(t("app.auth.signin.passwordRequiredError")),
    });

export const signUpSchema = (t) =>
    Yup.object({
        username: Yup.string()
            .trim()
            .required(t("app.auth.signup.usernameRequiredError")),

        firstName: Yup.string()
            .trim()
            .required(t("app.auth.signup.firstNameRequiredError")),

        lastName: Yup.string()
            .trim()
            .required(t("app.auth.signup.lastNameRequiredError")),

        email: Yup.string()
            .trim()
            .email(t("app.auth.signup.invalidEmailError"))
            .required(t("app.auth.signup.requiredEmailError")),

        password: Yup.string()
            .min(8, t("app.auth.signup.passwordMinError"))
            .required(t("app.auth.signup.passwordRequiredError")),

        confirmPassword: Yup.string()
            .oneOf(
                [Yup.ref("password")],
                t("app.auth.signup.passwordsMustMatchError")
            )
            .required(t("app.auth.signup.confirmPasswordRequiredError")),
    });