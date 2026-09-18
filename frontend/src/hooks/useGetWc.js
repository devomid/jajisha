import { useEffect } from "react";
import { useWcDataStore } from "../../store/wcDataStore";
import { API_URL } from "../config/api";
import useWaitingSystemStore from "../../store/waitingSystemStore";

export const useGetWc = () => {

    const setGetWcsWaiting = useWaitingSystemStore(state => state.setGetWcsWaiting);
    const setGetWcsEndWaiting = useWaitingSystemStore(state => state.setGetWcsEndWaiting);
    const setToilets = useWcDataStore(state => state.setToilets);
    const setGetWcReviewWaiting = useWaitingSystemStore(state => state.setGetWcReviewWaiting);
    const setGetWcReviewEndWaiting = useWaitingSystemStore(state => state.setGetWcReviewEndWaiting);

    useEffect(() => {
        getWc()
    }, [])

    const getWc = async () => {

        try {
            setGetWcsWaiting("Finding toilets near you...");
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
            setGetWcsEndWaiting();
        }
    };

    const getWcReviews = async (toiletId) => {


        try {

            setGetWcReviewWaiting();
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
            setGetWcReviewEndWaiting();
        }
    }
    return ({
        getWc,
        getWcReviews
    });
}