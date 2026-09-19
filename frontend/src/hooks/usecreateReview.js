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
                // console.log("Cannot create review: user is not authenticated");

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
                // console.log("Response is not OK");
                // console.log("Status:", response.status);
                // console.log(await response.text());

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

            return;

        } catch (error) {
            // console.log("Error saving review:", error);
            if (toast?.show) {
                toast.show("Something went wrong adding review!", {
                    type: "custom",
                    data: {
                        type: "error",
                        text2: "It can be our servers or your connection. Check and try again.",
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