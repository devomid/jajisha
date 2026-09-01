import { useWcDataStore } from "../../store/wcDataStore";
import { useUserStore } from '../../store/userStore';

export const useSaveWc = () => {
    const toilet = useWcDataStore((state) => state.selectedToilet);
    const user = useUserStore((state) => state.user);
    const saveWc = async () => {
        try {
            const response = await fetch(
                `http://192.168.43.42:3001/api/user/${user._id}/savedToilets/${toilet._id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
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
