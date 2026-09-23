import { renderHook } from "@testing-library/react-native";

import { useAuth } from "../../src/hooks/useAuth";

const mockStartWaiting = jest.fn();
const mockUpdateWaiting = jest.fn();
const mockEndWaiting = jest.fn();

const mockSetUser = jest.fn();
const mockLogout = jest.fn();

const mockToastShow = jest.fn();

const mockGetItemAsync = jest.fn();
const mockSetItemAsync = jest.fn();
const mockDeleteItemAsync = jest.fn();

let mockUser = null;

jest.mock("expo-secure-store", () => ({
    getItemAsync: (...args) => mockGetItemAsync(...args),
    setItemAsync: (...args) => mockSetItemAsync(...args),
    deleteItemAsync: (...args) => mockDeleteItemAsync(...args),
}));

jest.mock("../../src/store/userStore", () => ({
    useUserStore: Object.assign(
        () => ({
            user: mockUser,
        }),
        {
            getState: () => ({
                setUser: mockSetUser,
                logout: mockLogout,
            }),
        }
    ),
}));

jest.mock("../../src/store/waitingSystemStore", () => ({
    __esModule: true,
    default: (selector) =>
        selector({
            startWaiting: mockStartWaiting,
            updateWaiting: mockUpdateWaiting,
            endWaiting: mockEndWaiting,
        }),
}));

jest.mock("react-native-toast-notifications", () => ({
    useToast: () => ({
        show: mockToastShow,
    }),
}));

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key) => key,
    }),
}));

jest.mock("../../src/config/api", () => ({
    API_URL: "http://test-api",
}));

jest.mock("../../src/utils/logger", () => ({
    __esModule: true,
    default: {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
    },
}));

beforeEach(() => {
    jest.clearAllMocks();

    global.fetch = jest.fn();

    mockUser = null;

    mockStartWaiting.mockReturnValue(123);

    mockGetItemAsync.mockResolvedValue("test-token");
    mockSetItemAsync.mockResolvedValue(undefined);
    mockDeleteItemAsync.mockResolvedValue(undefined);
});

describe("useAuth - signUp", () => {
    test("returns true and stores the authenticated user on success", async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue({
                token: "new-token",
                user: {
                    _id: "user-1",
                    username: "omid",
                },
            }),
        });

        const { result } = await renderHook(() => useAuth());

        const response = await result.current.signUp(
            "omid",
            "Omid",
            "Test",
            "omid@example.com",
            "password123"
        );

        expect(response).toBe(true);

        expect(mockSetItemAsync).toHaveBeenCalledWith(
            "authToken",
            "new-token"
        );

        expect(mockSetUser).toHaveBeenCalledWith({
            _id: "user-1",
            username: "omid",
            token: "new-token",
        });

        expect(mockUpdateWaiting).toHaveBeenCalledWith(
            123,
            "waitingSystem.makingAccount"
        );

        expect(mockEndWaiting).toHaveBeenCalledWith(123);
    });

    test("returns null when signup response is not ok", async () => {
        global.fetch.mockResolvedValue({
            ok: false,
            status: 400,
            json: jest.fn().mockResolvedValue({
                error: "Email already exists",
            }),
        });

        const { result } = await renderHook(() => useAuth());

        const response = await result.current.signUp(
            "omid",
            "Omid",
            "Test",
            "omid@example.com",
            "password123"
        );

        expect(response).toBeNull();
        expect(mockSetItemAsync).not.toHaveBeenCalled();
        expect(mockSetUser).not.toHaveBeenCalled();

        expect(mockToastShow).toHaveBeenCalledWith(
            "toast.useAuth.signup.noOkRes1",
            {
                type: "custom",
                data: {
                    type: "error",
                    text2: "toast.useAuth.signup.noOkRes1",
                },
            }
        );

        expect(mockEndWaiting).toHaveBeenCalledWith(123);
    });

    test("returns null when signup request throws", async () => {
        global.fetch.mockRejectedValue(new Error("Network error"));

        const { result } = await renderHook(() => useAuth());

        const response = await result.current.signUp(
            "omid",
            "Omid",
            "Test",
            "omid@example.com",
            "password123"
        );

        expect(response).toBeNull();
        expect(mockSetItemAsync).not.toHaveBeenCalled();
        expect(mockSetUser).not.toHaveBeenCalled();

        expect(mockToastShow).toHaveBeenCalledWith(
            "toast.useAuth.signup.catch1",
            {
                type: "custom",
                data: {
                    type: "error",
                    text2: "toast.useAuth.signup.catch2",
                },
            }
        );

        expect(mockEndWaiting).toHaveBeenCalledWith(123);
    });
});

describe("useAuth - signIn", () => {
    test("returns true and stores the authenticated user on success", async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue({
                token: "signin-token",
                user: {
                    _id: "user-1",
                    username: "omid",
                },
            }),
        });

        const { result } = await renderHook(() => useAuth());

        const response = await result.current.signIn(
            "omid@example.com",
            "password123"
        );

        expect(response).toBe(true);

        expect(mockSetItemAsync).toHaveBeenCalledWith(
            "authToken",
            "signin-token"
        );

        expect(mockSetUser).toHaveBeenCalledWith({
            _id: "user-1",
            username: "omid",
            token: "signin-token",
        });

        expect(mockUpdateWaiting).toHaveBeenCalledWith(
            123,
            "waitingSystem.puttingYourStuffBack"
        );

        expect(mockEndWaiting).toHaveBeenCalledWith(123);
    });

    test("returns null when signin response is not ok", async () => {
        global.fetch.mockResolvedValue({
            ok: false,
            status: 401,
            json: jest.fn().mockResolvedValue({
                error: "Invalid credentials",
            }),
        });

        const { result } = await renderHook(() => useAuth());

        const response = await result.current.signIn(
            "omid@example.com",
            "wrong-password"
        );

        expect(response).toBeNull();
        expect(mockSetItemAsync).not.toHaveBeenCalled();
        expect(mockSetUser).not.toHaveBeenCalled();

        expect(mockToastShow).toHaveBeenCalledWith(
            "toast.useAuth.signin.noOkRes1",
            {
                type: "custom",
                data: {
                    type: "error",
                    text2: "toast.useAuth.signin.noOkRes2",
                },
            }
        );

        expect(mockEndWaiting).toHaveBeenCalledWith(123);
    });

    test("returns null when signin request throws", async () => {
        global.fetch.mockRejectedValue(new Error("Network error"));

        const { result } = await renderHook(() => useAuth());

        const response = await result.current.signIn(
            "omid@example.com",
            "password123"
        );

        expect(response).toBeNull();
        expect(mockSetItemAsync).not.toHaveBeenCalled();
        expect(mockSetUser).not.toHaveBeenCalled();

        expect(mockToastShow).toHaveBeenCalledWith(
            "toast.useAuth.signin.catch1",
            {
                type: "custom",
                data: {
                    type: "error",
                    text2: "toast.useAuth.signin.catch2",
                },
            }
        );

        expect(mockEndWaiting).toHaveBeenCalledWith(123);
    });
});

describe("useAuth - restoreUser", () => {
    test("logs out and removes the token when no saved token exists", async () => {
        mockGetItemAsync.mockResolvedValue(null);

        const { result } = await renderHook(() => useAuth());

        await result.current.restoreUser();

        expect(mockGetItemAsync).toHaveBeenCalledWith("authToken");
        expect(mockDeleteItemAsync).toHaveBeenCalledWith("authToken");
        expect(mockLogout).toHaveBeenCalled();

        expect(global.fetch).not.toHaveBeenCalled();
        expect(mockSetUser).not.toHaveBeenCalled();
        expect(mockEndWaiting).toHaveBeenCalledWith(123);
    });

    test("restores the user when the token is valid", async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue({
                _id: "user-1",
                username: "omid",
            }),
        });

        mockGetItemAsync
            .mockResolvedValueOnce("saved-token")
            .mockResolvedValueOnce("saved-token");

        const { result } = await renderHook(() => useAuth());

        await result.current.restoreUser();

        expect(global.fetch).toHaveBeenCalledWith(
            "http://test-api/api/user/returnMe",
            {
                headers: {
                    Authorization: "Bearer saved-token",
                },
            }
        );

        expect(mockSetUser).toHaveBeenCalledWith({
            _id: "user-1",
            username: "omid",
            token: "saved-token",
        });

        expect(mockLogout).not.toHaveBeenCalled();
        expect(mockEndWaiting).toHaveBeenCalledWith(123);
    });

    test("removes the token and logs out when restore response is not ok", async () => {
        global.fetch.mockResolvedValue({
            ok: false,
            status: 401,
            json: jest.fn().mockResolvedValue({
                error: "Invalid token",
            }),
        });

        const { result } = await renderHook(() => useAuth());

        await result.current.restoreUser();

        expect(mockDeleteItemAsync).toHaveBeenCalledWith("authToken");
        expect(mockLogout).toHaveBeenCalled();
        expect(mockSetUser).not.toHaveBeenCalled();

        expect(mockToastShow).toHaveBeenCalledWith(
            "toast.useAuth.restoreUser.noOkRes1",
            {
                type: "custom",
                data: {
                    type: "error",
                    text2: "toast.useAuth.restoreUser.noOkRes2",
                },
            }
        );

        expect(mockEndWaiting).toHaveBeenCalledWith(123);
    });

    test("does not restore the user when the stored token changes", async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue({
                _id: "user-1",
                username: "omid",
            }),
        });

        mockGetItemAsync
            .mockResolvedValueOnce("original-token")
            .mockResolvedValueOnce("different-token");

        const { result } = await renderHook(() => useAuth());

        await result.current.restoreUser();

        expect(mockSetUser).not.toHaveBeenCalled();
        expect(mockLogout).not.toHaveBeenCalled();
        expect(mockEndWaiting).toHaveBeenCalledWith(123);
    });

    test("handles restore request errors", async () => {
        global.fetch.mockRejectedValue(new Error("Network error"));

        const { result } = await renderHook(() => useAuth());

        await result.current.restoreUser();

        expect(mockSetUser).not.toHaveBeenCalled();
        expect(mockLogout).not.toHaveBeenCalled();

        expect(mockToastShow).toHaveBeenCalledWith(
            "toast.useAuth.restoreUser.catch1",
            {
                type: "custom",
                data: {
                    type: "error",
                    text2: "toast.useAuth.restoreUser.catch2",
                },
            }
        );

        expect(mockEndWaiting).toHaveBeenCalledWith(123);
    });
});

describe("useAuth - logout", () => {
    test("deletes the token and logs out successfully", async () => {
        const { result } = await renderHook(() => useAuth());

        await result.current.logout();

        expect(mockDeleteItemAsync).toHaveBeenCalledWith("authToken");
        expect(mockLogout).toHaveBeenCalled();
        expect(mockToastShow).not.toHaveBeenCalled();
        expect(mockEndWaiting).toHaveBeenCalledWith(123);
    });

    test("handles logout errors", async () => {
        mockDeleteItemAsync.mockRejectedValue(new Error("SecureStore error"));

        const { result } = await renderHook(() => useAuth());

        await result.current.logout();

        expect(mockLogout).not.toHaveBeenCalled();

        expect(mockToastShow).toHaveBeenCalledWith(
            "toast.useAuth.logout.catch1",
            {
                type: "custom",
                data: {
                    type: "error",
                    text2: "toast.useAuth.logout.catch2",
                },
            }
        );

        expect(mockEndWaiting).toHaveBeenCalledWith(123);
    });
});

describe("useAuth - deleteUser", () => {
    test("deletes the account and logs out successfully", async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: jest.fn(),
        });

        const { result } = await renderHook(() => useAuth());

        await result.current.deleteUser();

        expect(mockGetItemAsync).toHaveBeenCalledWith("authToken");

        expect(global.fetch).toHaveBeenCalledWith(
            "http://test-api/api/user/rm",
            {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer test-token",
                },
            }
        );

        expect(mockDeleteItemAsync).toHaveBeenCalledWith("authToken");
        expect(mockLogout).toHaveBeenCalled();
        expect(mockEndWaiting).toHaveBeenCalledWith(123);
    });

    test("does not delete the local token or log out when delete response is not ok", async () => {
        global.fetch.mockResolvedValue({
            ok: false,
            status: 500,
            json: jest.fn().mockResolvedValue({
                error: "Delete failed",
            }),
        });

        const { result } = await renderHook(() => useAuth());

        await result.current.deleteUser();

        expect(mockDeleteItemAsync).not.toHaveBeenCalled();
        expect(mockLogout).not.toHaveBeenCalled();

        expect(mockToastShow).toHaveBeenCalledWith(
            "toast.useAuth.deleteUser.noOkRes1",
            {
                type: "custom",
                data: {
                    type: "error",
                    text2: "toast.useAuth.deleteUser.noOkRes2",
                },
            }
        );

        expect(mockEndWaiting).toHaveBeenCalledWith(123);
    });

    test("handles delete account request errors", async () => {
        global.fetch.mockRejectedValue(new Error("Network error"));

        const { result } = await renderHook(() => useAuth());

        await result.current.deleteUser();

        expect(mockDeleteItemAsync).not.toHaveBeenCalled();
        expect(mockLogout).not.toHaveBeenCalled();

        expect(mockToastShow).toHaveBeenCalledWith(
            "toast.useAuth.deleteUser.catch1",
            {
                type: "custom",
                data: {
                    type: "error",
                    text2: "toast.useAuth.deleteUser.catch2",
                },
            }
        );

        expect(mockEndWaiting).toHaveBeenCalledWith(123);
    });
});