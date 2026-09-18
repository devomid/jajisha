import { useWcDataStore } from "../../store/wcDataStore";
import { useUserStore } from "../../store/userStore";
import { API_URL } from "../config/api";
import useWaitingSystemStore from "../../store/waitingSystemStore";
import { useToast } from "react-native-toast-notifications";

export const useUnsaveWc = () => {
    const toast = useToast();

    const startWaiting = useWaitingSystemStore(state => state.startWaiting);
    const updateWaiting = useWaitingSystemStore(state => state.updateWaiting);
    const endWaiting = useWaitingSystemStore(state => state.endWaiting);
    const toilet = useWcDataStore((state) => state.selectedToilet);
    const user = useUserStore((state) => state.user);
    const token = user?.token;

    const unsaveWc = async () => {

        if (!token) {
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
                // const errorText = await response.text();
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
            return;

        } catch (error) {
            // console.log("Error unsaving WC:", error);
            if (toast?.show) {
                toast.show("Something went wrong unsaving WC!", {
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

    return unsaveWc;
};