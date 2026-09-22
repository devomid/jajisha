import { useWcDataStore } from "../../store/wcDataStore";
import { useUserStore } from "../../store/userStore";
import { API_URL } from "../config/api";
import useWaitingSystemStore from '../../store/waitingSystemStore';
import { useToast } from "react-native-toast-notifications";
import logger from "../utils/logger";
import { useTranslation } from "react-i18next";


export const useManagingWc = () => {
    const { t } = useTranslation();

    const toast = useToast();
    const wcData = useWcDataStore((state) => state.wcData);
    const addToilet = useWcDataStore((state) => state.addToilet);
    const user = useUserStore((state) => state.user);
    const token = user?.token
    const startWaiting = useWaitingSystemStore(state => state.startWaiting);
    const updateWaiting = useWaitingSystemStore(state => state.updateWaiting);
    const endWaiting = useWaitingSystemStore(state => state.endWaiting);
    const setToilets = useWcDataStore(state => state.setToilets);
    const toilet = useWcDataStore((state) => state.selectedToilet);

    const addWc = async () => {

        if (!token) {
            logger.warn("Add toilet attempted without authentication");
            return null;
        }

        const waitingId = startWaiting(t("waitingSystem.checkingToilet"));

        try {
            const response = await fetch(
                `${API_URL}/api/toilets`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        wcData: {
                            ...wcData,
                            location: {
                                latitude: wcData.location.coordinates[1],
                                longitude: wcData.location.coordinates[0],
                            },
                        },
                    }),
                }
            );

            if (!response.ok) {
                const errorRes = await response.json();
                logger.warn("Add toilet request failed", {
                    status: response.status,
                    addToiletError: errorRes
                });

                if (toast?.show) {
                    toast.show(t("toast.useManagingWc.addWc.noOkRes1"), {
                        type: "custom",
                        data: {
                            type: "error",
                            text2: t("toast.useManagingWc.addWc.noOkRes2")
                        },
                    })
                };


                return null;
            };
            updateWaiting(
                waitingId,
                t("waitingSystem.newToiletAdded")
            );

            const newToilet = await response.json();
            addToilet(newToilet);

            logger.info("Toilet added successfully", {
                toiletId: newToilet?._id,
            });
            if (toast?.show) {
                toast.show(t("toast.useManagingWc.addWc.success1"), {
                    type: "custom",
                    data: {
                        type: "success",
                        text2: t("toast.useManagingWc.addWc.success2")
                    },
                })
            };
            return newToilet;

        } catch (error) {
            logger.error("Add toilet request error", {
                error: error.message,
            });
            if (toast?.show) {
                toast.show(t("toast.useManagingWc.addWc.catch1"), {
                    type: "custom",
                    data: {
                        type: "error",
                        text2: t("toast.useManagingWc.addWc.catch2"),
                    },
                })
            };
            return null;

        } finally {
            endWaiting(waitingId);
        }
    };

    const getWc = async () => {
        const waitingId = startWaiting(t("waitingSystem.findingNearbyToilets"));

        const requestStartedWith = new Set(
            useWcDataStore.getState().toilets.map(toilet => toilet._id)
        );

        try {
            const response = await fetch(`${API_URL}/api/toilets`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                const errorRes = await response.json();
                logger.warn("Fetch toilet request failed", {
                    status: response.status,
                    getToietError: errorRes
                });
                if (toast?.show) {
                    toast.show(t("toast.useManagingWc.getWc.noOkRes1"), {
                        type: "custom",
                        data: {
                            type: "error",
                            text2: t("toast.useManagingWc.getWc.noOkRes2")
                        },
                    });
                }

                return null;
            }


            const jsonRes = await response.json();

            logger.info("Toilets fetched successfully", {
                count: jsonRes.toilets?.length ?? 0,
            });
            setToilets(currentToilets => {
                const fetchedIds = new Set(
                    jsonRes.toilets.map(toilet => toilet._id)
                );

                const addedDuringRequest = currentToilets.filter(
                    toilet =>
                        !requestStartedWith.has(toilet._id) &&
                        !fetchedIds.has(toilet._id)
                );

                return [...jsonRes.toilets, ...addedDuringRequest];
            });

            return jsonRes.toilets;

        } catch (error) {
            logger.error("Fetch toilets request error", {
                error: error.message,
            });
            if (toast?.show) {
                toast.show(t("toast.useManagingWc.getWc.catch1"), {
                    type: "custom",
                    data: {
                        type: "error",
                        text2: t("toast.useManagingWc.getWc.catch2")
                    },
                });
            }

            return null;
        } finally {
            endWaiting(waitingId);
        }
    };

    const getWcReviews = async (toiletId) => {

        const waitingId = startWaiting(t("waitingSystem.loadingThings"));

        try {

            const response = await fetch(`${API_URL}/api/toilets/reviews/${toiletId}`, {
                method: "GET",
                headers: { "Content-Type": 'application/json' },
            });

            if (!response.ok) {
                const errorRes = await response.json();
                logger.warn("Fetch toilet reviews request failed", {
                    status: response.status,
                    getToietReviewsError: errorRes
                });
                if (toast?.show) {
                    toast.show(t("toast.useManagingWc.getWcReviews.noOkRes1"), {
                        type: "custom",
                        data: {
                            type: "error",
                            text2: t("toast.useManagingWc.getWcReviews.noOkRes2")
                        },
                    })
                };
                return null;
            };

            const jsonRes = await response.json();
            logger.info("Toilet reviews fetched successfully", {
                toiletId,
                count: jsonRes.reviews?.length ?? 0,
            });

            return {
                reviews: jsonRes.reviews,
                userReview: jsonRes.userReview,
            };


        } catch (error) {
            logger.error("Fetch toilet reviews error", {
                error: error.message,
                toiletId,
            });
            if (toast?.show) {
                toast.show(t("toast.useManagingWc.getWcReviews.catch1"), {
                    type: "custom",
                    data: {
                        type: "error",
                        text2: t("toast.useManagingWc.getWcReviews.catch2")
                    },
                })
            };
            return null;

        } finally {
            endWaiting(waitingId);
        }
    }

    const saveWc = async () => {

        if (!token) {
            logger.warn("Save toilet attempted without authentication");
            if (toast?.show) {
                toast.show(t("toast.useManagingWc.saveWc.noToken1"), {
                    type: "custom",
                    data: {
                        type: "warning",
                        text2: t("toast.useManagingWc.saveWc.noToken2")
                    },
                })
            };
            return null;
        }
        if (!toilet?._id) {
            logger.warn("Save toilet attempted without selected toilet");
            if (toast?.show) {
                toast.show(t("toast.useManagingWc.saveWc.noToilet1"), {
                    type: "custom",
                    data: {
                        type: "warning",
                        text2: t("toast.useManagingWc.saveWc.noTilet2")
                    },
                })
            };
            return null;
        }

        const waitingId = startWaiting(t("waitingSystem.savingToFavorites"));
        try {
            const response = await fetch(
                `${API_URL}/api/managment/saveToilets/${toilet._id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const errorRes = await response.json();
                logger.warn("Saving toilet rejected", {
                    status: response.status,
                    saveToietError: errorRes
                });
                if (toast?.show) {
                    toast.show(t("toast.useManagingWc.saveWc.noOkRes2"), {
                        type: "custom",
                        data: {
                            type: "error",
                            text2: t("toast.useManagingWc.saveWc.noOkRes1")
                        },
                    })
                };

                return null;
            }
            logger.info("Toilet saved successfully", {
                toiletId: toilet._id,
            });
            return true;

        } catch (error) {

            logger.error("Save toilet request error", {
                error: error.message,
                toiletId: toilet._id,
            });
            if (toast?.show) {
                toast.show(t("toast.useManagingWc.saveWc.catch1"), {
                    type: "custom",
                    data: {
                        type: "error",
                        text2: t("toast.useManagingWc.saveWc.catch2")
                    },
                })
            };
            return null;
        } finally {
            endWaiting(waitingId);
        }
    };

    const unsaveWc = async () => {


        if (!token) {
            logger.warn("Unsave toilet attempted without authentication");
            if (toast?.show) {
                toast.show(t("toast.useManagingWc.unsaveWc.noToken1"), {
                    type: "custom",
                    data: {
                        type: "warning",
                        text2: t("toast.useManagingWc.unsaveWc.noToken2")
                    },
                })
            };
            return null;
        }
        if (!toilet?._id) {
            logger.warn("Unsave toilet attempted without selected toilet");
            if (toast?.show) {
                toast.show(t("toast.useManagingWc.unsaveWc.Toilet1"), {
                    type: "custom",
                    data: {
                        type: "warning",
                        text2: t("toast.useManagingWc.unsaveWc.noToilet2")
                    },
                })
            };
            return null;
        }
        const waitingId = startWaiting(t("waitingSystem.unsavingFromFavorites"));

        try {
            const response = await fetch(
                `${API_URL}/api/managment/unSavedToilets/${toilet._id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const errorRes = await response.json();
                logger.warn("Unsave toilet request failed", {
                    status: response.status,
                    unsaveToietError: errorRes
                });
                if (toast?.show) {
                    toast.show(t("toast.useManagingWc.unsaveWc.noOkRes1"), {
                        type: "custom",
                        data: {
                            type: "error",
                            text2: t("toast.useManagingWc.unsaveWc.noOkRes2")
                        },
                    })
                };
                return null;
            }
            logger.info("Toilet unsaved successfully", {
                toiletId: toilet._id,
            });
            return true;

        } catch (error) {
            logger.error("Unsave toilet request error", {
                error: error.message,
                toiletId: toilet._id,
            });
            if (toast?.show) {
                toast.show(t("toast.useManagingWc.unsaveWc.catch1"), {
                    type: "custom",
                    data: {
                        type: "error",
                        text2: t("toast.useManagingWc.unsaveWc.catch2")
                    },
                })
            };
            return null;

        } finally {
            endWaiting(waitingId);
        }
    };

    return ({
        addWc,
        getWc,
        getWcReviews,
        saveWc,
        unsaveWc
    })
};