import { useWcDataStore } from "../../store/wcDataStore";
import { useUserStore } from "../../store/userStore";
import { API_URL } from "../config/api";
import useWaitingSystemStore from '../../store/waitingSystemStore';

export const useAddWc = () => {
    const wcData = useWcDataStore((state) => state.wcData);
    const addToilet = useWcDataStore((state) => state.addToilet);
    const user = useUserStore((state) => state.user);
    const setSaveWcWaiting = useWaitingSystemStore(state => state.setSaveWcWaiting);
    const setSaveWcEndWaiting = useWaitingSystemStore(state => state.setSaveWcEndWaiting);
    const token = user?.token

    const addWc = async () => {

        if (!token) return null;
        setSaveWcWaiting();
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

            if (!response.ok) {
                console.log("Response is not OK");
                console.log("Status:", response.status);
                console.log(await response.text());
                return null;
            }

            const newToilet = await response.json();

            addToilet(newToilet);

            return newToilet;
        } catch (error) {
            console.log("Error adding WC:", error);
            return null;
        } finally {
            setSaveWcEndWaiting();
        }
    };

    return { addWc };
};