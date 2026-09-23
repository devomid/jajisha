import { useTopSheetStore } from "../../src/store/menuStore";

describe("menuStore", () => {
    beforeEach(() => {
        useTopSheetStore.setState({
            isOpen: false,
        });
    });

    test("starts closed", () => {
        expect(useTopSheetStore.getState().isOpen).toBe(false);
    });

    test("open opens the top sheet", () => {
        useTopSheetStore.getState().open();

        expect(useTopSheetStore.getState().isOpen).toBe(true);
    });

    test("close closes the top sheet", () => {
        useTopSheetStore.getState().open();

        useTopSheetStore.getState().close();

        expect(useTopSheetStore.getState().isOpen).toBe(false);
    });

    test("toggle opens a closed top sheet", () => {
        useTopSheetStore.getState().toggle();

        expect(useTopSheetStore.getState().isOpen).toBe(true);
    });

    test("toggle closes an open top sheet", () => {
        useTopSheetStore.getState().open();

        useTopSheetStore.getState().toggle();

        expect(useTopSheetStore.getState().isOpen).toBe(false);
    });
});