import { useWcDataStore } from "../../store/wcDataStore";
import { useUserStore } from "../../store/userStore";
import { API_URL } from "../config/api";
import useWaitingSystemStore from "../../store/waitingSystemStore";

export const useUnsaveWc = () => {
    const startWaiting = useWaitingSystemStore(state => state.startWaiting);
    const updateWaiting = useWaitingSystemStore(state => state.updateWaiting);
    const endWaiting = useWaitingSystemStore(state => state.endWaiting);
    const toilet = useWcDataStore((state) => state.selectedToilet);
    const user = useUserStore((state) => state.user);
    const token = user?.token;

    const unsaveWc = async () => {
        if (!token || !toilet?._id) return false;

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
                const errorText = await response.text();
                return;
            }
            return true;

        } catch (error) {
            console.log("Error unsaving WC:", error);
            return;

        } finally {
            endWaiting(waitingId);
        }
    };

    return unsaveWc;
};