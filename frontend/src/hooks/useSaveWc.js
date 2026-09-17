import { useWcDataStore } from "../../store/wcDataStore";
import { useUserStore } from "../../store/userStore";
import { API_URL } from "../config/api";
import useWaitingSystemStore from "../../store/waitingSystemStore";

export const useSaveWc = () => {
    const toilet = useWcDataStore((state) => state.selectedToilet);
    const user = useUserStore((state) => state.user);
    const setSaveWcWaiting = useWaitingSystemStore(state => state.setSaveWcWaiting);
    const setSaveWcEndWaiting = useWaitingSystemStore(state => state.setSaveWcEndWaiting);
    const token = user?.token;

    const saveWc = async () => {
        if (!token || !toilet?._id) return false;

        try {
            setSaveWcWaiting();
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

            console.log("SAVE STATUS:", response.status);

            if (!response.ok) {
                const errorText = await response.text();

                console.log("SAVE FAILED:", errorText);

                return false;
            }

            console.log("SAVE SUCCESS:", toilet._id);

            return true;

        } catch (error) {
            console.log("Error saving WC:", error);
            return false;
        } finally {
            setSaveWcEndWaiting();
        }
    };

    return saveWc;
};