import { renderHook } from "@testing-library/react-native";

import { useCreateReview } from "../../src/hooks/usecreateReview";

const mockStartWaiting = jest.fn();
const mockEndWaiting = jest.fn();
const mockToastShow = jest.fn();

let mockUser = {
    token: "test-token",
};

let mockToiletId = "toilet-1";

jest.mock("../../src/store/userStore", () => ({
    useUserStore: (selector) =>
        selector({
            user: mockUser,
        }),
}));

jest.mock("../../src/store/wcDataStore", () => ({
    useWcDataStore: (selector) =>
        selector({
            selectedToilet: {
                _id: mockToiletId,
            },
        }),
}));

jest.mock("../../src/store/waitingSystemStore", () => ({
    __esModule: true,
    default: (selector) =>
        selector({
            startWaiting: mockStartWaiting,
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

    mockUser = {
        token: "test-token",
    };

    mockToiletId = "toilet-1";

    mockStartWaiting.mockReturnValue(123);
});

describe("useCreateReview", () => {
    test("rejects when review creation is already in progress", async () => {
        const { result } = await renderHook(() => useCreateReview());

        const firstRequest = new Promise(() => { });

        global.fetch.mockReturnValue(firstRequest);

        const firstCall = result.current({
            reviewText: "This is a valid review.",
            ratings: {
                cleanliness: 5,
            },
        });

        const secondResponse = await result.current({
            reviewText: "Another valid review.",
            ratings: {
                cleanliness: 4,
            },
        });

        expect(secondResponse).toBeNull();
        expect(global.fetch).toHaveBeenCalledTimes(1);

        // Prevent the intentionally pending promise from affecting the test.
        void firstCall;
    });

    test("returns null when the user is not authenticated", async () => {
        mockUser = null;

        const { result } = await renderHook(() => useCreateReview());

        const response = await result.current({
            reviewText: "This is a valid review.",
            ratings: {
                cleanliness: 5,
            },
        });

        expect(response).toBeNull();
        expect(global.fetch).not.toHaveBeenCalled();

        expect(mockToastShow).toHaveBeenCalledWith(
            "toast.useCreateReview.userNotFound",
            {
                type: "custom",
                data: {
                    type: "error",
                },
            }
        );

        expect(mockEndWaiting).toHaveBeenCalledWith(123);
    });

    test("returns null when there is no selected toilet", async () => {
        mockToiletId = null;

        const { result } = await renderHook(() => useCreateReview());

        const response = await result.current({
            reviewText: "This is a valid review.",
            ratings: {
                cleanliness: 5,
            },
        });

        expect(response).toBeNull();
        expect(global.fetch).not.toHaveBeenCalled();

        expect(mockToastShow).toHaveBeenCalledWith(
            "toast.useCreateReview.toiletNotFound",
            {
                type: "custom",
                data: {
                    type: "error",
                },
            }
        );

        expect(mockEndWaiting).toHaveBeenCalledWith(123);
    });

    test("creates a review successfully", async () => {
        const review = {
            _id: "review-1",
            reviewText: "This is a valid review.",
            ratings: {
                cleanliness: 5,
            },
        };

        global.fetch.mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue({
                review,
            }),
        });

        const { result } = await renderHook(() => useCreateReview());

        const response = await result.current({
            reviewText: "This is a valid review.",
            ratings: {
                cleanliness: 5,
            },
        });

        expect(response).toEqual(review);

        expect(global.fetch).toHaveBeenCalledWith(
            "http://test-api/api/managment/toiletManagement/toilet-1",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer test-token",
                },
                body: JSON.stringify({
                    reviewText: "This is a valid review.",
                    ratings: {
                        cleanliness: 5,
                    },
                }),
            }
        );

        expect(mockEndWaiting).toHaveBeenCalledWith(123);
    });

    test("handles a 409 response", async () => {
        global.fetch.mockResolvedValue({
            ok: false,
            status: 409,
            json: jest.fn().mockResolvedValue({
                error: "Already reviewed",
            }),
        });

        const { result } = await renderHook(() => useCreateReview());

        const response = await result.current({
            reviewText: "This is a valid review.",
            ratings: {
                cleanliness: 5,
            },
        });

        expect(response).toBeNull();

        expect(mockToastShow).toHaveBeenCalledWith(
            "toast.useCreateReview.noOkRes1",
            {
                type: "custom",
                data: {
                    type: "error",
                    text2: "toast.useCreateReview.noOkRes2",
                },
            }
        );

        expect(mockEndWaiting).toHaveBeenCalledWith(123);
    });

    test("handles other rejected responses", async () => {
        global.fetch.mockResolvedValue({
            ok: false,
            status: 500,
            json: jest.fn().mockResolvedValue({
                error: "Server error",
            }),
        });

        const { result } = await renderHook(() => useCreateReview());

        const response = await result.current({
            reviewText: "This is a valid review.",
            ratings: {
                cleanliness: 5,
            },
        });

        expect(response).toBeNull();

        expect(mockToastShow).toHaveBeenCalledWith(
            "toast.useCreateReview.noOkRes3",
            {
                type: "custom",
                data: {
                    type: "error",
                    text2: "toast.useCreateReview.noOkRes4",
                },
            }
        );

        expect(mockEndWaiting).toHaveBeenCalledWith(123);
    });

    test("handles review request errors", async () => {
        global.fetch.mockRejectedValue(new Error("Network error"));

        const { result } = await renderHook(() => useCreateReview());

        const response = await result.current({
            reviewText: "This is a valid review.",
            ratings: {
                cleanliness: 5,
            },
        });

        expect(response).toBeNull();

        expect(mockToastShow).toHaveBeenCalledWith(
            "toast.useCreateReview.catch1",
            {
                type: "custom",
                data: {
                    type: "error",
                    text2: "toast.useCreateReview.catch2",
                },
            }
        );

        expect(mockEndWaiting).toHaveBeenCalledWith(123);
    });
});