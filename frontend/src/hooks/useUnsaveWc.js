import { useWcDataStore } from "../../store/wcDataStore";
import { useUserStore } from '../../store/userStore';
import { API_URL } from "../config/api";

export const useUnsaveWc = () => {
    const toilet = useWcDataStore((state) => state.selectedToilet);
    const user = useUserStore((state) => state.user);
    const token = user?.token;
    
    const unsaveWc = async () => {
                if (!token) return null;

        try {
            const response = await fetch(
                `${API_URL }/api/managment/unSaveToilets/${toilet._id}`,
                {
                    method: "Delete",
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
            console.log("Error insaving WC:", error);
            return false;
        }
    }
    return unsaveWc;
}
