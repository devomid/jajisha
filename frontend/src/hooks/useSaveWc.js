import { useWcDataStore } from "../../store/wcDataStore";
import { useUserStore } from "../../store/userStore";
import { API_URL } from "../config/api";
import useWaitingSystemStore from "../../store/waitingSystemStore";

export const useSaveWc = () => {
    const toilet = useWcDataStore((state) => state.selectedToilet);
    const user = useUserStore((state) => state.user);
    const startWaiting = useWaitingSystemStore(state => state.startWaiting);
    const updateWaiting = useWaitingSystemStore(state => state.updateWaiting);
    const endWaiting = useWaitingSystemStore(state => state.endWaiting);
    const token = user?.token;

    const saveWc = async () => {
        if (!token || !toilet?._id) return false;

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
                const errorText = await response.text();

                console.log("SAVE FAILED:", errorText);

                return false;
            }

            return true;

        } catch (error) {
            console.log("Error saving WC:", error);
            return false;
        } finally {
            endWaiting(waitingId);
        }
    };

    return saveWc;
};