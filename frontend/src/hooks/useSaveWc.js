import { useWcDataStore } from "../../store/wcDataStore";
import { useUserStore } from '../../store/userStore';
import { API_URL } from "../config/api";

export const useSaveWc = () => {
    const toilet = useWcDataStore((state) => state.selectedToilet);
    const user = useUserStore((state) => state.user);
    const token = user?.token;
    
    const saveWc = async () => {
        if (!token) return null;

        try {
            const response = await fetch(
                `${API_URL }/api/managment/saveToilets/${toilet._id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
            if (!response.ok) {
                console.log("Response is not OK");
                console.log("Status:", response.status);
                console.log(await response.text());
                return false;
            }

            return true;

        } catch (error) {
            console.log("Error saving WC:", error);
            return false;
        }
    }
    return saveWc;
}
