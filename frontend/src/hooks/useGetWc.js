import { useEffect } from "react";
import { useWcDataStore } from "../../store/wcDataStore";
import { API_URL } from "../config/api";
import useWaitingSystemStore from "../../store/waitingSystemStore";

export const useGetWc = () => {

    const setGetWcsWaiting = useWaitingSystemStore(state => state.setGetWcsWaiting);
    const setGetWcsEndWaiting = useWaitingSystemStore(state => state.setGetWcsEndWaiting);
    const setToilets = useWcDataStore(state => state.setToilets);
    const startWaiting = useWaitingSystemStore(state => state.startWaiting);
    const updateWaiting = useWaitingSystemStore(state => state.updateWaiting);
    const endWaiting = useWaitingSystemStore(state => state.endWaiting);

    useEffect(() => {
        getWc()
    }, [])

    const getWc = async () => {

        const waitingId = startWaiting("Finding toilets near you...");

        try {

            const response = await fetch(`${API_URL}/api/toilets`, {
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

                return null;
            }

        } catch (error) {
            console.log("Error get all WCs", error);
            return null;
        } finally {
            endWaiting(waitingId);
        }
    };

    const getWcReviews = async (toiletId) => {

        const waitingId = startWaiting("Loading things...");

        try {

            const response = await fetch(`${API_URL}/api/toilets/reviews/${toiletId}`, {
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
        } finally {
            endWaiting(waitingId);
        }
    }
    return ({
        getWc,
        getWcReviews
    });
}