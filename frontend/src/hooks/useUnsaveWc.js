import { useWcDataStore } from "../../store/wcDataStore";
import { useUserStore } from "../../store/userStore";
import { API_URL } from "../config/api";

export const useUnsaveWc = () => {
    const toilet = useWcDataStore((state) => state.selectedToilet);
    const user = useUserStore((state) => state.user);
    const token = user?.token;

    const unsaveWc = async () => {
        if (!token || !toilet?._id) return false;

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

            console.log("UNSAVE STATUS:", response.status);

            if (!response.ok) {
                const errorText = await response.text();

                console.log("UNSAVE FAILED:", errorText);

                return false;
            }

            console.log("UNSAVE SUCCESS:", toilet._id);

            return true;

        } catch (error) {
            console.log("Error unsaving WC:", error);
            return false;
        }
    };

    return unsaveWc;
};