import {
    signInSchema,
    signUpSchema,
} from "../../src/validation/userInfoSchema";

const t = (key) => key;

describe("signInSchema", () => {
    const schema = signInSchema(t);

    test("accepts valid credentials", async () => {
        await expect(
            schema.validate({
                email: "user@example.com",
                password: "12345",
            })
        ).resolves.toEqual({
            email: "user@example.com",
            password: "12345",
        });
    });

    test("rejects invalid email", async () => {
        await expect(
            schema.validate({
                email: "invalid-email",
                password: "12345",
            })
        ).rejects.toThrow("app.auth.signin.invalidEmailError");
    });

    test("rejects missing email", async () => {
        await expect(
            schema.validate({
                password: "12345",
            })
        ).rejects.toThrow("app.auth.signin.requiredEmailError");
    });

    test("rejects password shorter than 5 characters", async () => {
        await expect(
            schema.validate({
                email: "user@example.com",
                password: "1234",
            })
        ).rejects.toThrow("app.auth.signin.passwordMinError");
    });

    test("rejects missing password", async () => {
        await expect(
            schema.validate({
                email: "user@example.com",
            })
        ).rejects.toThrow("app.auth.signin.passwordRequiredError");
    });
});

describe("signUpSchema", () => {
    const schema = signUpSchema(t);

    const validData = {
        username: "testuser",
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
    };

    test("accepts valid signup data", async () => {
        await expect(
            schema.validate(validData)
        ).resolves.toEqual(validData);
    });

    test("trims username", async () => {
        const result = await schema.validate({
            ...validData,
            username: "  testuser  ",
        });

        expect(result.username).toBe("testuser");
    });

    test("trims first name", async () => {
        const result = await schema.validate({
            ...validData,
            firstName: "  Test  ",
        });

        expect(result.firstName).toBe("Test");
    });

    test("trims last name", async () => {
        const result = await schema.validate({
            ...validData,
            lastName: "  User  ",
        });

        expect(result.lastName).toBe("User");
    });

    test("trims email", async () => {
        const result = await schema.validate({
            ...validData,
            email: "  test@example.com  ",
        });

        expect(result.email).toBe("test@example.com");
    });

    test.each([
        ["username", "app.auth.signup.usernameRequiredError"],
        ["firstName", "app.auth.signup.firstNameRequiredError"],
        ["lastName", "app.auth.signup.lastNameRequiredError"],
        ["email", "app.auth.signup.requiredEmailError"],
        ["password", "app.auth.signup.passwordRequiredError"],
        ["confirmPassword", "app.auth.signup.confirmPasswordRequiredError"],
    ])("rejects missing %s", async (field, message) => {
        const data = { ...validData };
        delete data[field];

        await expect(
            schema.validate(data)
        ).rejects.toThrow(message);
    });

    test("rejects invalid email", async () => {
        await expect(
            schema.validate({
                ...validData,
                email: "invalid-email",
            })
        ).rejects.toThrow("app.auth.signup.invalidEmailError");
    });

    test("rejects password shorter than 8 characters", async () => {
        await expect(
            schema.validate({
                ...validData,
                password: "1234567",
                confirmPassword: "1234567",
            })
        ).rejects.toThrow("app.auth.signup.passwordMinError");
    });

    test("rejects mismatched passwords", async () => {
        await expect(
            schema.validate({
                ...validData,
                confirmPassword: "different123",
            })
        ).rejects.toThrow(
            "app.auth.signup.passwordsMustMatchError"
        );
    });

    test("rejects whitespace-only required fields", async () => {
        await expect(
            schema.validate({
                ...validData,
                username: "   ",
            })
        ).rejects.toThrow(
            "app.auth.signup.usernameRequiredError"
        );
    });
});