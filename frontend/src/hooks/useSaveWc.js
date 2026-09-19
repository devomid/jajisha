import { useWcDataStore } from "../../store/wcDataStore";
import { useUserStore } from "../../store/userStore";
import { API_URL } from "../config/api";
import useWaitingSystemStore from "../../store/waitingSystemStore";
import { useToast } from "react-native-toast-notifications";


export const useSaveWc = () => {

    const toast = useToast();

    const toilet = useWcDataStore((state) => state.selectedToilet);
    const user = useUserStore((state) => state.user);
    const startWaiting = useWaitingSystemStore(state => state.startWaiting);
    const updateWaiting = useWaitingSystemStore(state => state.updateWaiting);
    const endWaiting = useWaitingSystemStore(state => state.endWaiting);
    const token = user?.token;

    const saveWc = async () => {

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
                // const errorText = await response.text();
                // console.log("SAVE FAILED:", errorText);
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

            return true;

        } catch (error) {

            // console.log("Error saving WC:", error);
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

    return saveWc;
};