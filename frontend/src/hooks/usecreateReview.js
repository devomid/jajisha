import { useTranslation } from "react-i18next";
import { useToast } from "react-native-toast-notifications";

import { API_URL } from "../config/api";
import { useWcDataStore } from "../../store/wcDataStore";
import { useUserStore } from "../../store/userStore";
import useWaitingSystemStore from "../../store/waitingSystemStore";
import logger from "../utils/logger";


export const useCreateReview = () => {

    const { t } = useTranslation();

    const toast = useToast();

    const toiletId = useWcDataStore((state) => state.selectedToilet?._id);
    const user = useUserStore((state) => state.user);
    const startWaiting = useWaitingSystemStore(state => state.startWaiting);
    const endWaiting = useWaitingSystemStore(state => state.endWaiting);


    const createReview = async ({ reviewText, ratings }) => {

        const waitingId = startWaiting(t("waitingSystem.creatingReview"));

        try {

            if (!user?.token) {
                logger.warn("Create review attempted without authentication");
                if (toast?.show) {
                    toast.show(t("toast.useCreateReview.userNotFound"), {
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
                    toast.show(t("toast.useCreateReview.toiletNotFound"), {
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
                logger.warn("Create review request failed", {
                    status: response.status,
                    createReviewError: errorRes
                });


                if (response.status === 409) {

                    logger.debug("409 recieved", {
                        status: response.status,
                        createReviewError: errorRes
                    });

                    if (toast?.show) {
                        toast.show(t("toast.useCreateReview.noOkRes1"), {
                            type: "custom",
                            data: {
                                type: "error",
                                text2: t("toast.useCreateReview.noOkRes2"),
                            },
                        })
                    };
                } else {

                    if (toast?.show) {
                        toast.show(t("toast.useCreateReview.noOkRes3"), {
                            type: "custom",
                            data: {
                                type: "error",
                                text2: t("toast.useCreateReview.noOkRes4")
                            },
                        })
                    };
                }


                return null;
            }
            const jsonRes = await response.json();
            logger.info("Review created successfully", {
                toiletId,
                reviewId: jsonRes.review?._id,
            });

            return jsonRes.review;

        } catch (error) {
            logger.error("Create review request error", {
                error: error.message,
                toiletId,
            });
            if (toast?.show) {
                toast.show(t("toast.useCreateReview.catch1"), {
                    type: "custom",
                    data: {
                        type: "error",
                        text2: t("toast.useCreateReview.catch2")
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