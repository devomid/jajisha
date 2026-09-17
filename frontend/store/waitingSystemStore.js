import { create } from "zustand";

const useWaitingSystemStore = create(set => ({

    signinWaiting: false,
    signupWaiting: false,
    deleteUserWaiting: false,
    logoutWaiting: false,

    addWcWaiting: false,
    restoreUserWaiting: false,
    createReviewWaiting: false,

    getCurrentLocationWaiting: false,
    getWcsWaiting: false,

    saveWcWaiting: false,
    unsaveWcWaiting: false,

    getWcReviewWaiting: false,

    calculatingDistanceWaiting: false,


    setCalculatingDistanceWaiting: () =>
        set({ calculatingDistanceWaiting: true }),

    setCalculatingDistanceEndWaiting: () =>
        set({ calculatingDistanceWaiting: false }),

    setGetWcReviewWaiting: () =>
        set({ getWcReviewWaiting: true }),

    setGetWcReviewEndWaiting: () =>
        set({ getWcReviewWaiting: false }),


    setSigninWaiting: () =>
        set({ signinWaiting: true }),

    setSigninEndWaiting: () =>
        set({ signinWaiting: false }),


    setSignupWaiting: () =>
        set({ signupWaiting: true }),

    setSignupEndWaiting: () =>
        set({ signupWaiting: false }),


    setDeleteUserWaiting: () =>
        set({ deleteUserWaiting: true }),

    setDeleteUserEndWaiting: () =>
        set({ deleteUserWaiting: false }),


    setLogoutWaiting: () =>
        set({ logoutWaiting: true }),

    setLogoutEndWaiting: () =>
        set({ logoutWaiting: false }),


    setAddWcWaiting: () =>
        set({ addWcWaiting: true }),

    setAddWcEndWaiting: () =>
        set({ addWcWaiting: false }),


    setRestoreUserWaiting: () =>
        set({ restoreUserWaiting: true }),

    setRestoreUserEndWaiting: () =>
        set({ restoreUserWaiting: false }),


    setCreateReviewWaiting: () =>
        set({ createReviewWaiting: true }),

    setCreateReviewEndWaiting: () =>
        set({ createReviewWaiting: false }),


    setGetCurrentLocationWaiting: () =>
        set({ getCurrentLocationWaiting: true }),

    setGetCurrentLocationEndWaiting: () =>
        set({ getCurrentLocationWaiting: false }),


    setGetWcsWaiting: () =>
        set({ getWcsWaiting: true }),

    setGetWcsEndWaiting: () =>
        set({ getWcsWaiting: false }),


    setSaveWcWaiting: () =>
        set({ saveWcWaiting: true }),

    setSaveWcEndWaiting: () =>
        set({ saveWcWaiting: false }),


    setUnsaveWcWaiting: () =>
        set({ unsaveWcWaiting: true }),

    setUnsaveWcEndWaiting: () =>
        set({ unsaveWcWaiting: false }),

}));

export default useWaitingSystemStore;