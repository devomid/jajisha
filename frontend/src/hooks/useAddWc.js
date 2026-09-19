import { useWcDataStore } from "../../store/wcDataStore";
import { useUserStore } from "../../store/userStore";
import { API_URL } from "../config/api";
import useWaitingSystemStore from '../../store/waitingSystemStore';
import { useToast } from "react-native-toast-notifications";


export const useAddWc = () => {
    const toast = useToast();

    const wcData = useWcDataStore((state) => state.wcData);
    const addToilet = useWcDataStore((state) => state.addToilet);
    const user = useUserStore((state) => state.user);
    const token = user?.token

    const startWaiting = useWaitingSystemStore(state => state.startWaiting);
    const updateWaiting = useWaitingSystemStore(state => state.updateWaiting);
    const endWaiting = useWaitingSystemStore(state => state.endWaiting);

    const addWc = async () => {

        if (!token) return null;

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
                        wcData,
                    }),
                }
            );

            updateWaiting(
                waitingId,
                "Map is having a new WC..."
            );

            if (!response.ok) {
                console.log("Response is not OK");
                console.log("Status:", response.status);
                console.log(await response.text());

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
            // console.log("Error adding WC:", error);
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

    return { addWc };
};