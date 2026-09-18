import { create } from "zustand";

const useWaitingSystemStore = create(set => ({

    signinWaiting: false,
    signinWaitingText: "",

    signupWaiting: false,
    signupWaitingText: "",

    deleteUserWaiting: false,
    deleteUserWaitingText: "",

    logoutWaiting: false,
    logoutWaitingText: "",


    addWcWaiting: false,
    addWcWaitingText: "",

    restoreUserWaiting: false,
    restoreUserWaitingText: "",

    createReviewWaiting: false,
    createReviewWaitingText: "",


    getCurrentLocationWaiting: false,
    getCurrentLocationWaitingText: "",

    getWcsWaiting: false,
    getWcsWaitingText: "",

    saveWcWaiting: false,
    saveWcWaitingText: "",

    unsaveWcWaiting: false,
    unsaveWcWaitingText: "",

    getWcReviewWaiting: false,
    getWcReviewWaitingText: "",

    calculatingDistanceWaiting: false,
    calculatingDistanceWaitingText: "",


    setCalculatingDistanceWaiting: (text = "") =>
        set({
            calculatingDistanceWaiting: true,
            calculatingDistanceWaitingText: text
        }),

    setCalculatingDistanceEndWaiting: () =>
        set({
            calculatingDistanceWaiting: false,
            calculatingDistanceWaitingText: ""
        }),


    setGetWcReviewWaiting: (text = "") =>
        set({
            getWcReviewWaiting: true,
            getWcReviewWaitingText: text
        }),

    setGetWcReviewEndWaiting: () =>
        set({
            getWcReviewWaiting: false,
            getWcReviewWaitingText: ""
        }),


    setSigninWaiting: (text = "") =>
        set({
            signinWaiting: true,
            signinWaitingText: text
        }),

    setSigninEndWaiting: () =>
        set({
            signinWaiting: false,
            signinWaitingText: ""
        }),


    setSignupWaiting: (text = "") =>
        set({
            signupWaiting: true,
            signupWaitingText: text
        }),

    setSignupEndWaiting: () =>
        set({
            signupWaiting: false,
            signupWaitingText: ""
        }),


    setDeleteUserWaiting: (text = "") =>
        set({
            deleteUserWaiting: true,
            deleteUserWaitingText: text
        }),

    setDeleteUserEndWaiting: () =>
        set({
            deleteUserWaiting: false,
            deleteUserWaitingText: ""
        }),


    setLogoutWaiting: (text = "") =>
        set({
            logoutWaiting: true,
            logoutWaitingText: text
        }),

    setLogoutEndWaiting: () =>
        set({
            logoutWaiting: false,
            logoutWaitingText: ""
        }),


    setAddWcWaiting: (text = "") =>
        set({
            addWcWaiting: true,
            addWcWaitingText: text
        }),

    setAddWcEndWaiting: () =>
        set({
            addWcWaiting: false,
            addWcWaitingText: ""
        }),


    setRestoreUserWaiting: (text = "") =>
        set({
            restoreUserWaiting: true,
            restoreUserWaitingText: text
        }),

    setRestoreUserEndWaiting: () =>
        set({
            restoreUserWaiting: false,
            restoreUserWaitingText: ""
        }),


    setCreateReviewWaiting: (text = "") =>
        set({
            createReviewWaiting: true,
            createReviewWaitingText: text
        }),

    setCreateReviewEndWaiting: () =>
        set({
            createReviewWaiting: false,
            createReviewWaitingText: ""
        }),


    setGetCurrentLocationWaiting: (text = "") =>
        set({
            getCurrentLocationWaiting: true,
            getCurrentLocationWaitingText: text
        }),

    setGetCurrentLocationEndWaiting: () =>
        set({
            getCurrentLocationWaiting: false,
            getCurrentLocationWaitingText: ""
        }),


    setGetWcsWaiting: (text = "") =>
        set({
            getWcsWaiting: true,
            getWcsWaitingText: text
        }),

    setGetWcsEndWaiting: () =>
        set({
            getWcsWaiting: false,
            getWcsWaitingText: ""
        }),


    setSaveWcWaiting: (text = "") =>
        set({
            saveWcWaiting: true,
            saveWcWaitingText: text
        }),

    setSaveWcEndWaiting: () =>
        set({
            saveWcWaiting: false,
            saveWcWaitingText: ""
        }),


    setUnsaveWcWaiting: (text = "") =>
        set({
            unsaveWcWaiting: true,
            unsaveWcWaitingText: text
        }),

    setUnsaveWcEndWaiting: () =>
        set({
            unsaveWcWaiting: false,
            unsaveWcWaitingText: ""
        }),

}));

export default useWaitingSystemStore;