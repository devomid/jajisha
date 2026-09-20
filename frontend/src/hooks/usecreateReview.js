import { API_URL } from "../config/api";
import { useWcDataStore } from "../../store/wcDataStore";
import { useUserStore } from "../../store/userStore";
import useWaitingSystemStore from "../../store/waitingSystemStore";
import { useToast } from "react-native-toast-notifications";


export const useCreateReview = () => {

    const toast = useToast();

    const toiletId = useWcDataStore((state) => state.selectedToilet?._id);
    const user = useUserStore((state) => state.user);
    const startWaiting = useWaitingSystemStore(state => state.startWaiting);
    const updateWaiting = useWaitingSystemStore(state => state.updateWaiting);
    const endWaiting = useWaitingSystemStore(state => state.endWaiting);


    const createReview = async ({ reviewText, ratings }) => {

        const waitingId = startWaiting("You really reviewd a Toilet? Just wait...");

        try {

            if (!user?.token) {
                logger.warn("Create review attempted without authentication");
                if (toast?.show) {
                    toast.show("User not found!", {
                        type: "custom",
                        data: {
                            type: "error",
                        },
                    })
                };

                return null;
            }

            if (!toiletId) {
                logger.warn("Create review attempted without selected toilet");
                if (toast?.show) {
                    toast.show("Toilet not found!", {
                        type: "custom",
                        data: {
                            type: "error",
                        },
                    })
                };
                return null;
            }

            const response = await fetch(
                `${API_URL}/api/managment/toiletManagement/${toiletId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    },
                    body: JSON.stringify({
                        reviewText,
                        ratings
                    })
                }
            );

            if (!response.ok) {
                const errorRes = await response.json();
                logger.warn("Sign in request failed", {
                    status: response.status,
                    createToiletError: errorRes
                });

                if (toast?.show) {
                    toast.show("Could not add review", {
                        type: "custom",
                        data: {
                            type: "error",
                            text2: "Try again a few moments later.",
                        },
                    })
                };

                return null;
            }
            logger.info("Review created successfully", {
                toiletId,
                reviewId: jsonRes.review?._id,
            });
            const jsonRes = await response.json();

            return jsonRes.review;

        } catch (error) {
            logger.error("Create review request error", {
                error: error.message,
                toiletId,
            });
            if (toast?.show) {
                toast.show("Something went wrong adding review!", {
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

    return createReview;
};