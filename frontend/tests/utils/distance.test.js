import { formatDistance } from "../../src/utils/distance";

const t = key => key;

describe("formatDistance", () => {
    test("returns -- for invalid distance", () => {
        expect(formatDistance(null, "Metric", t)).toBe("--");
    });

    test("formats metric meters", () => {
        expect(formatDistance(250, "Metric", t)).toBe(
            "250 components.ToiletLocationBottomSheet.m"
        );
    });

    test("formats metric kilometers", () => {
        expect(formatDistance(1500, "Metric", t)).toBe(
            "1.5 components.ToiletLocationBottomSheet.km"
        );
    });

    test("formats imperial feet", () => {
        expect(formatDistance(100, "Imperial", t)).toBe(
            "328 components.ToiletLocationBottomSheet.ft"
        );
    });

    test("formats imperial miles", () => {
        expect(formatDistance(1609.344, "Imperial", t)).toBe(
            "1.0 components.ToiletLocationBottomSheet.mile"
        );
    });
});