import { renderHook } from "@testing-library/react-native";

import { useManagingWc } from "../../src/hooks/useManagingWc";

const mockStartWaiting = jest.fn();
const mockUpdateWaiting = jest.fn();
const mockEndWaiting = jest.fn();
const mockAddToilet = jest.fn();
const mockSetToilets = jest.fn();
const mockToastShow = jest.fn();

let mockUser = {
    token: "test-token",
};

let mockWcData = {
    name: "Test Toilet",
    location: {
        coordinates: [51.4, 35.7],
    },
};

let mockSelectedToilet = {
    _id: "toilet-1",
};

let mockCurrentToilets = [];

const mockWcStoreState = () => ({
    wcData: mockWcData,
    addToilet: mockAddToilet,
    setToilets: mockSetToilets,
    selectedToilet: mockSelectedToilet,
    toilets: mockCurrentToilets,
});

jest.mock("../../src/store/wcDataStore", () => ({
    useWcDataStore: Object.assign(
        (selector) => selector(mockWcStoreState()),
        {
            getState: () => mockWcStoreState(),
        }
    ),
}));

jest.mock("../../src/store/userStore", () => ({
    useUserStore: (selector) =>
        selector({
            user: mockUser,
        }),
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

describe("useManagingWc", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        global.fetch = jest.fn();

        mockUser = {
            token: "test-token",
        };

        mockWcData = {
            name: "Test Toilet",
            location: {
                coordinates: [51.4, 35.7],
            },
        };

        mockSelectedToilet = {
            _id: "toilet-1",
        };

        mockCurrentToilets = [];

        mockStartWaiting.mockReturnValue(123);

        mockSetToilets.mockImplementation((updater) => {
            mockCurrentToilets =
                typeof updater === "function"
                    ? updater(mockCurrentToilets)
                    : updater;
        });
    });

    describe("addWc", () => {
        test("returns null without authentication", async () => {
            mockUser = null;

            const { result } = await renderHook(() => useManagingWc());

            const response = await result.current.addWc();

            expect(response).toBeNull();
            expect(global.fetch).not.toHaveBeenCalled();
            expect(mockStartWaiting).not.toHaveBeenCalled();
        });

        test("adds and returns a valid toilet on success", async () => {
            const newToilet = {
                _id: "new-toilet",
                name: "New Toilet",
            };

            global.fetch.mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue(newToilet),
            });

            const { result } = await renderHook(() => useManagingWc());

            const response = await result.current.addWc();

            expect(response).toEqual(newToilet);
            expect(mockAddToilet).toHaveBeenCalledWith(newToilet);
            expect(mockStartWaiting).toHaveBeenCalled();
            expect(mockUpdateWaiting).toHaveBeenCalled();
            expect(mockEndWaiting).toHaveBeenCalledWith(123);
            expect(mockToastShow).toHaveBeenCalled();
        });

        test("returns null when add request is rejected", async () => {
            global.fetch.mockResolvedValue({
                ok: false,
                status: 400,
                json: jest.fn().mockResolvedValue({
                    message: "Invalid toilet",
                }),
            });

            const { result } = await renderHook(() => useManagingWc());

            const response = await result.current.addWc();

            expect(response).toBeNull();
            expect(mockAddToilet).not.toHaveBeenCalled();
            expect(mockToastShow).toHaveBeenCalled();
            expect(mockEndWaiting).toHaveBeenCalledWith(123);
        });

        test("returns null when successful response has invalid data", async () => {
            global.fetch.mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue({
                    name: "Invalid Toilet",
                }),
            });

            const { result } = await renderHook(() => useManagingWc());

            const response = await result.current.addWc();

            expect(response).toBeNull();
            expect(mockAddToilet).not.toHaveBeenCalled();
            expect(mockToastShow).toHaveBeenCalled();
            expect(mockEndWaiting).toHaveBeenCalledWith(123);
        });

        test("returns null when add request throws", async () => {
            global.fetch.mockRejectedValue(
                new Error("Network error")
            );

            const { result } = await renderHook(() => useManagingWc());

            const response = await result.current.addWc();

            expect(response).toBeNull();
            expect(mockToastShow).toHaveBeenCalled();
            expect(mockEndWaiting).toHaveBeenCalledWith(123);
        });
    });

    describe("getWc", () => {
        test("fetches toilets and returns them", async () => {
            const toilets = [
                { _id: "toilet-1" },
                { _id: "toilet-2" },
            ];

            global.fetch.mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue({
                    toilets,
                }),
            });

            const { result } = await renderHook(() => useManagingWc());

            const response = await result.current.getWc();

            expect(response).toEqual(toilets);
            expect(mockCurrentToilets).toEqual(toilets);
            expect(mockEndWaiting).toHaveBeenCalledWith(123);
        });

        test("preserves toilets added while the request was in flight", async () => {
            mockCurrentToilets = [
                {
                    _id: "existing-toilet",
                },
            ];

            global.fetch.mockImplementation(async () => {
                mockCurrentToilets = [
                    ...mockCurrentToilets,
                    {
                        _id: "added-during-request",
                    },
                ];

                return {
                    ok: true,
                    json: jest.fn().mockResolvedValue({
                        toilets: [
                            {
                                _id: "server-toilet",
                            },
                        ],
                    }),
                };
            });

            const { result } = await renderHook(() => useManagingWc());

            const response = await result.current.getWc();

            expect(response).toEqual([
                {
                    _id: "server-toilet",
                },
            ]);

            expect(mockCurrentToilets).toEqual([
                {
                    _id: "server-toilet",
                },
                {
                    _id: "added-during-request",
                },
            ]);
        });

        test("does not duplicate a toilet added during the request if it is also returned by the server", async () => {
            global.fetch.mockImplementation(async () => {
                mockCurrentToilets = [
                    {
                        _id: "server-toilet",
                    },
                ];

                return {
                    ok: true,
                    json: jest.fn().mockResolvedValue({
                        toilets: [
                            {
                                _id: "server-toilet",
                            },
                        ],
                    }),
                };
            });

            const { result } = await renderHook(() => useManagingWc());

            await result.current.getWc();

            expect(mockCurrentToilets).toEqual([
                {
                    _id: "server-toilet",
                },
            ]);
        });

        test("returns an empty array when response has no valid toilets array", async () => {
            global.fetch.mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue({}),
            });

            const { result } = await renderHook(() => useManagingWc());

            const response = await result.current.getWc();

            expect(response).toEqual([]);
            expect(mockCurrentToilets).toEqual([]);
        });

        test("returns null when get request is rejected", async () => {
            global.fetch.mockResolvedValue({
                ok: false,
                status: 500,
                json: jest.fn().mockResolvedValue({
                    message: "Server error",
                }),
            });

            const { result } = await renderHook(() => useManagingWc());

            const response = await result.current.getWc();

            expect(response).toBeNull();
            expect(mockToastShow).toHaveBeenCalled();
            expect(mockEndWaiting).toHaveBeenCalledWith(123);
        });

        test("returns null when get request throws", async () => {
            global.fetch.mockRejectedValue(
                new Error("Network error")
            );

            const { result } = await renderHook(() => useManagingWc());

            const response = await result.current.getWc();

            expect(response).toBeNull();
            expect(mockToastShow).toHaveBeenCalled();
            expect(mockEndWaiting).toHaveBeenCalledWith(123);
        });
    });

    describe("getWcReviews", () => {
        test("returns reviews and user review on success", async () => {
            const reviews = [
                {
                    _id: "review-1",
                    rating: 5,
                },
            ];

            global.fetch.mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue({
                    reviews,
                    userReview: {
                        _id: "review-1",
                    },
                }),
            });

            const { result } = await renderHook(() => useManagingWc());

            const response =
                await result.current.getWcReviews("toilet-1");

            expect(response).toEqual({
                reviews,
                userReview: {
                    _id: "review-1",
                },
            });

            expect(mockEndWaiting).toHaveBeenCalledWith(123);
        });

        test("returns safe defaults for malformed review data", async () => {
            global.fetch.mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue({
                    reviews: "invalid",
                }),
            });

            const { result } = await renderHook(() => useManagingWc());

            const response =
                await result.current.getWcReviews("toilet-1");

            expect(response).toEqual({
                reviews: [],
                userReview: null,
            });
        });

        test("returns null when review request is rejected", async () => {
            global.fetch.mockResolvedValue({
                ok: false,
                status: 500,
                json: jest.fn().mockResolvedValue({
                    message: "Server error",
                }),
            });

            const { result } = await renderHook(() => useManagingWc());

            const response =
                await result.current.getWcReviews("toilet-1");

            expect(response).toBeNull();
            expect(mockToastShow).toHaveBeenCalled();
            expect(mockEndWaiting).toHaveBeenCalledWith(123);
        });

        test("returns null when review request throws", async () => {
            global.fetch.mockRejectedValue(
                new Error("Network error")
            );

            const { result } = await renderHook(() => useManagingWc());

            const response =
                await result.current.getWcReviews("toilet-1");

            expect(response).toBeNull();
            expect(mockToastShow).toHaveBeenCalled();
            expect(mockEndWaiting).toHaveBeenCalledWith(123);
        });
    });

    describe("saveWc", () => {
        test("returns null without authentication", async () => {
            mockUser = null;

            const { result } = await renderHook(() => useManagingWc());

            const response = await result.current.saveWc();

            expect(response).toBeNull();
            expect(global.fetch).not.toHaveBeenCalled();
        });

        test("returns null without a selected toilet", async () => {
            mockSelectedToilet = null;

            const { result } = await renderHook(() => useManagingWc());

            const response = await result.current.saveWc();

            expect(response).toBeNull();
            expect(global.fetch).not.toHaveBeenCalled();
        });

        test("returns true when saving succeeds", async () => {
            global.fetch.mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue({}),
            });

            const { result } = await renderHook(() => useManagingWc());

            const response = await result.current.saveWc();

            expect(response).toBe(true);
            expect(global.fetch).toHaveBeenCalledWith(
                "http://test-api/api/managment/saveToilets/toilet-1",
                expect.objectContaining({
                    method: "PATCH",
                })
            );
            expect(mockEndWaiting).toHaveBeenCalledWith(123);
        });

        test("returns null when save request is rejected", async () => {
            global.fetch.mockResolvedValue({
                ok: false,
                status: 500,
                json: jest.fn().mockResolvedValue({
                    message: "Server error",
                }),
            });

            const { result } = await renderHook(() => useManagingWc());

            const response = await result.current.saveWc();

            expect(response).toBeNull();
            expect(mockToastShow).toHaveBeenCalled();
            expect(mockEndWaiting).toHaveBeenCalledWith(123);
        });

        test("returns null when save request throws", async () => {
            global.fetch.mockRejectedValue(
                new Error("Network error")
            );

            const { result } = await renderHook(() => useManagingWc());

            const response = await result.current.saveWc();

            expect(response).toBeNull();
            expect(mockToastShow).toHaveBeenCalled();
            expect(mockEndWaiting).toHaveBeenCalledWith(123);
        });
    });

    describe("unsaveWc", () => {
        test("returns null without authentication", async () => {
            mockUser = null;

            const { result } = await renderHook(() => useManagingWc());

            const response = await result.current.unsaveWc();

            expect(response).toBeNull();
            expect(global.fetch).not.toHaveBeenCalled();
        });

        test("returns null without a selected toilet", async () => {
            mockSelectedToilet = null;

            const { result } = await renderHook(() => useManagingWc());

            const response = await result.current.unsaveWc();

            expect(response).toBeNull();
            expect(global.fetch).not.toHaveBeenCalled();
        });

        test("returns true when unsaving succeeds", async () => {
            global.fetch.mockResolvedValue({
                ok: true,
                json: jest.fn().mockResolvedValue({}),
            });

            const { result } = await renderHook(() => useManagingWc());

            const response = await result.current.unsaveWc();

            expect(response).toBe(true);
            expect(global.fetch).toHaveBeenCalledWith(
                "http://test-api/api/managment/unSavedToilets/toilet-1",
                expect.objectContaining({
                    method: "DELETE",
                })
            );
            expect(mockEndWaiting).toHaveBeenCalledWith(123);
        });

        test("returns null when unsave request is rejected", async () => {
            global.fetch.mockResolvedValue({
                ok: false,
                status: 500,
                json: jest.fn().mockResolvedValue({
                    message: "Server error",
                }),
            });

            const { result } = await renderHook(() => useManagingWc());

            const response = await result.current.unsaveWc();

            expect(response).toBeNull();
            expect(mockToastShow).toHaveBeenCalled();
            expect(mockEndWaiting).toHaveBeenCalledWith(123);
        });

        test("returns null when unsave request throws", async () => {
            global.fetch.mockRejectedValue(
                new Error("Network error")
            );

            const { result } = await renderHook(() => useManagingWc());

            const response = await result.current.unsaveWc();

            expect(response).toBeNull();
            expect(mockToastShow).toHaveBeenCalled();
            expect(mockEndWaiting).toHaveBeenCalledWith(123);
        });
    });
});