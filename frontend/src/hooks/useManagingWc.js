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

        const waitingId = startWaiting("Checking if the toilet is real...");

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

            updateWaiting(
                waitingId,
                "Map is having a new WC..."
            );

            if (!response.ok) {
                const errorRes = await response.json();
                logger.warn("Add toilet request failed", {
                    status: response.status,
                    addToiletError: errorRes
                });

                if (toast?.show) {
                    toast.show("Could not add toilet", {
                        type: "custom",
                        data: {
                            type: "error",
                            text2: "Try again a few moments later.",
                        },
                    })
                };

                return null;
            };

            const newToilet = await response.json();
            addToilet(newToilet);

            logger.info("Toilet added successfully", {
                toiletId: newToilet?._id,
            });
            if (toast?.show) {
                toast.show("Toilet added to map", {
                    type: "custom",
                    data: {
                        type: "success",
                        text2: "Thanks for expanding our data.",
                    },
                })
            };
            return newToilet;

        } catch (error) {
            logger.error("Add toilet request error", {
                error: error.message,
            });
            if (toast?.show) {
                toast.show("Something went wrong adding WC!", {
                    type: "custom",
                    data: {
                        type: "error",
                        text2: "It can be our servers or your connection. \nCheck and try again.",
                    },
                })
            };
            return null;

        } finally {
            endWaiting(waitingId);
        }
    };

    const getWc = async () => {
        const waitingId = startWaiting("Finding toilets near you...");

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
                    toast.show("Could not get toilets", {
                        type: "custom",
                        data: {
                            type: "error",
                            text2: "Try again a few moments later or check connection.",
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
                toast.show("Something went wrong getting WC!", {
                    type: "custom",
                    data: {
                        type: "error",
                        text2: "It can be our servers or your connection. \nCheck and try again.",
                    },
                });
            }

            return null;
        } finally {
            endWaiting(waitingId);
        }
    };

    const getWcReviews = async (toiletId) => {

        const waitingId = startWaiting("Loading things...");

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
                    toast.show("Could not get toilets", {
                        type: "custom",
                        data: {
                            type: "error",
                            text2: "Try again a few moments later or check connection.",
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
                toast.show("Something went wrong getting WC!", {
                    type: "custom",
                    data: {
                        type: "error",
                        text2: "It can be our servers or your connection. \nCheck and try again.",
                    },
                })
            };

        } finally {
            endWaiting(waitingId);
        }
    }

    const saveWc = async () => {

        if (!token) {
            logger.warn("Save toilet attempted without authentication");
            if (toast?.show) {
                toast.show("You can not save places!", {
                    type: "custom",
                    data: {
                        type: "warning",
                        text2: "Sign in or create an account.",
                    },
                })
            };
            return null;
        }
        if (!toilet?._id) {
            logger.warn("Save toilet attempted without selected toilet");
            if (toast?.show) {
                toast.show("This toilet can not be saved!", {
                    type: "custom",
                    data: {
                        type: "warning",
                        text2: "Something's wrong that you can't do anything about it.",
                    },
                })
            };
            return null;
        }
        const waitingId = startWaiting("Saving to favorites");

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
                logger.warn("Save toilet request failed", {
                    status: response.status,
                    saveToietError: errorRes
                });
                if (toast?.show) {
                    toast.show("Could not save toilet", {
                        type: "custom",
                        data: {
                            type: "error",
                            text2: "Try again a few moments later.",
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
                toast.show("Something went wrong saving WC!", {
                    type: "custom",
                    data: {
                        type: "error",
                        text2: "It can be our servers or your connection. \nCheck and try again.",
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
                toast.show("You can not save places!", {
                    type: "custom",
                    data: {
                        type: "warning",
                        text2: "Sign in or create an account.",
                    },
                })
            };
            return null;
        }
        if (!toilet?._id) {
            logger.warn("Unsave toilet attempted without selected toilet");
            if (toast?.show) {
                toast.show("This toilet can not be saved!", {
                    type: "custom",
                    data: {
                        type: "warning",
                        text2: "Something's wrong that you can't do anything about it.",
                    },
                })
            };
            return null;
        }
        const waitingId = startWaiting("Removing from favorites...");

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
                    toast.show("Could not unsave toilet", {
                        type: "custom",
                        data: {
                            type: "error",
                            text2: "Try again a few moments later.",
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
                toast.show("Something went wrong unsaving WC!", {
                    type: "custom",
                    data: {
                        type: "error",
                        text2: "It can be our servers or your connection. \nCheck and try again.",
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