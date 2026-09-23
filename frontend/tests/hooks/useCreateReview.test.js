import { renderHook } from "@testing-library/react-native";

import { useCreateReview } from "../../src/hooks/usecreateReview";

const mockStartWaiting = jest.fn();
const mockEndWaiting = jest.fn();
const mockToastShow = jest.fn();

const mockSetSelectedToilet = jest.fn();

let mockUser = {
    token: "test-token",
};

let mockSelectedToilet = {
    _id: "toilet-1",
};

jest.mock("../../src/store/userStore", () => ({
    useUserStore: (selector) =>
        selector({
            user: mockUser,
        }),
}));

jest.mock("../../src/store/wcDataStore", () => ({
    useWcDataStore: (selector) =>
        selector({
            selectedToilet: mockSelectedToilet,
            setSelectedToilet: mockSetSelectedToilet,
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

    mockSelectedToilet = {
        _id: "toilet-1",
    };

    mockStartWaiting.mockReturnValue(123);
});

describe("useCreateReview", () => {
    test("rejects a review shorter than 10 characters", async () => {
        const { result } = await renderHook(() => useCreateReview());

        const response = await result.current.createReview(
            "toilet-1",
            5,
            "too short"
        );

        expect(response).toBeNull();

        expect(global.fetch).not.toHaveBeenCalled();
        expect(mockStartWaiting).not.toHaveBeenCalled();
    });

    test("returns null when the user is not authenticated", async () => {
        mockUser = null;

        const { result } = await renderHook(() => useCreateReview());

        const response = await result.current.createReview(
            "toilet-1",
            5,
            "This is a valid review text."
        );

        expect(response).toBeNull();

        expect(global.fetch).not.toHaveBeenCalled();
    });

    test("creates a review successfully", async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue({
                review: {
                    _id: "review-1",
                    text: "This is a valid review text.",
                    rating: 5,
                },
                ratingSummary: {
                    average: 5,
                    count: 1,
                },
            }),
        });

        const { result } = await renderHook(() => useCreateReview());

        const response = await result.current.createReview(
            "toilet-1",
            5,
            "This is a valid review text."
        );

        expect(response).not.toBeNull();

        expect(global.fetch).toHaveBeenCalled();

        expect(mockSetSelectedToilet).toHaveBeenCalled();

        expect(mockEndWaiting).toHaveBeenCalledWith(123);
    });

    test("handles a rejected review response", async () => {
        global.fetch.mockResolvedValue({
            ok: false,
            status: 400,
            json: jest.fn().mockResolvedValue({
                error: "Invalid review",
            }),
        });

        const { result } = await renderHook(() => useCreateReview());

        const response = await result.current.createReview(
            "toilet-1",
            5,
            "This is a valid review text."
        );

        expect(response).toBeNull();

        expect(mockSetSelectedToilet).not.toHaveBeenCalled();
        expect(mockEndWaiting).toHaveBeenCalledWith(123);
    });

    test("handles a review request error", async () => {
        global.fetch.mockRejectedValue(new Error("Network error"));

        const { result } = await renderHook(() => useCreateReview());

        const response = await result.current.createReview(
            "toilet-1",
            5,
            "This is a valid review text."
        );

        expect(response).toBeNull();

        expect(mockSetSelectedToilet).not.toHaveBeenCalled();
        expect(mockEndWaiting).toHaveBeenCalledWith(123);
    });
});