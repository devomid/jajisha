import { useWcDataStore } from "../../store/wcDataStore";
import { useUserStore } from "../../store/userStore";
import { API_URL } from "../config/api";
import useWaitingSystemStore from '../../store/waitingSystemStore';

export const useAddWc = () => {
    const wcData = useWcDataStore((state) => state.wcData);
    const addToilet = useWcDataStore((state) => state.addToilet);
    const user = useUserStore((state) => state.user);
    const token = user?.token

    const setAddWcWaiting = useWaitingSystemStore(state => state.setAddWcWaiting);
    const setAddWcEndWaiting = useWaitingSystemStore(state => state.setAddWcEndWaiting);

    const addWc = async () => {
        setAddWcWaiting("Checking if the toilet is real...")
        if (!token) return null;
        setAddWcWaiting();
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
            setAddWcWaiting("Map is having a new WC...")
            if (!response.ok) {
                console.log("Response is not OK");
                console.log("Status:", response.status);
                console.log(await response.text());
                return null;
            }

            const newToilet = await response.json();

            addToilet(newToilet);
            setAddWcWaiting("Toilet is online now!")
            return newToilet;
        } catch (error) {
            console.log("Error adding WC:", error);
            return null;
        } finally {
            setAddWcEndWaiting();
        }
    };

    return { addWc };
};