import { useUserStore } from "../../src/store/userStore";

describe("userStore", () => {
    beforeEach(() => {
        useUserStore.setState({
            user: null,
        });
    });

    test("starts with no user", () => {
        expect(useUserStore.getState().user).toBeNull();
    });

    test("setUser stores the user", () => {
        const user = {
            _id: "user-1",
            username: "omid",
            token: "token-123",
        };

        useUserStore.getState().setUser(user);

        expect(useUserStore.getState().user).toEqual(user);
    });

    test("logout clears the user", () => {
        useUserStore.getState().setUser({
            _id: "user-1",
            username: "omid",
            token: "token-123",
        });

        useUserStore.getState().logout();

        expect(useUserStore.getState().user).toBeNull();
    });
});