import { useWcDataStore } from "../../store/wcDataStore";
import { useUserStore } from "../../store/userStore";

export const useAddWc = () => {
    const wcData = useWcDataStore((state) => state.wcData);
    const addToilet = useWcDataStore((state) => state.addToilet);
        const user = useUserStore((state) => state.user);
    

    const addWc = async () => {
        try {
            const response = await fetch(
                `http://192.168.43.42:3001/api/toilets/${user._id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
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
        }
    };

    return { addWc };
};