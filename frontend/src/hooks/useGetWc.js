import { useEffect } from "react";
import { useWcDataStore } from "../../store/wcDataStore";
import { API_URL } from "../config/api";

export const useGetWc = () => {

    const setToilets = useWcDataStore(state => state.setToilets);

    useEffect(() => {
        getWc()
    }, [])

    const getWc = async () => {

        try {

            const response = await fetch(`${API_URL }/api/toilets`, {
                method: "GET",
                headers: { "Content-Type": 'application/json' },
            });

            if (response.ok) {
                const jsonRes = await response.json();
                setToilets(jsonRes.toilets);
                return jsonRes.toilets;
            } else {
                console.log('respons is not OK');
                console.log("Status:", response.status);

                const error = await response.text();
                console.log(error);

                return;
            }

        } catch (error) {
            console.log("Error get all WCs", error);
        }
    };

    const getWcReviews = async (toiletId) => {
        try {
            const response = await fetch(`${API_URL }/api/toilets/reviews/${toiletId}`, {
                method: "GET",
                headers: { "Content-Type": 'application/json' },
            });

            if (response.ok) {
                const jsonRes = await response.json();
                return jsonRes.reviews;

            } else {
                console.log('respons is not OK');
                console.log("Status:", response.status);

                const error = await response.text();
                console.log(error);

                return null;
            }

        } catch (error) {
            console.log("Error get WC reviews", error);
        }
    }
    return ({
        getWc,
        getWcReviews
    });
}