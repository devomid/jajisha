import { useEffect } from "react";
import { useWcDataStore } from "../../store/wcDataStore";
import { API_URL } from "../config/api";
import useWaitingSystemStore from "../../store/waitingSystemStore";
import { useToast } from "react-native-toast-notifications";
import * as ToastNotifications from "react-native-toast-notifications";


export const useGetWc = () => {

    const toast = useToast();

    const setGetWcsWaiting = useWaitingSystemStore(state => state.setGetWcsWaiting);
    const setGetWcsEndWaiting = useWaitingSystemStore(state => state.setGetWcsEndWaiting);
    const setToilets = useWcDataStore(state => state.setToilets);
    const startWaiting = useWaitingSystemStore(state => state.startWaiting);
    const updateWaiting = useWaitingSystemStore(state => state.updateWaiting);
    const endWaiting = useWaitingSystemStore(state => state.endWaiting);

    useEffect(() => {
        if (!toast?.show) {
            return;
        }
        getWc();
    }, [toast])

    const getWc = async () => {

        const waitingId = startWaiting("Finding toilets near you...");

        try {

            const response = await fetch(`${API_URL}/api/toilets`, {
                method: "GET",
                headers: { "Content-Type": 'application/json' },
            });

            if (!response.ok) {
                // console.log('respons is not OK');
                // console.log("Status:", response.status);
                // const error = await response.text();
                // console.log(error);

                if (toast?.show) {
                    toast.show("Could not get toilets", {
                        type: "custom",
                        data: {
                            type: "error",
                            text2: "Try again a few moments later or check connection.",
                        },
                    })
                };
                return null;
            };
            const jsonRes = await response.json();
            setToilets(jsonRes.toilets);
            return jsonRes.toilets;

        } catch (error) {
            // console.log("Error get all WCs", error);
            if (toast?.show) {
                toast.show("Something went wrong getting WC!", {
                    type: "custom",
                    data: {
                        type: "error",
                        text2: "It can be our servers or your connection. \nCheck and try again.",
                    },
                })
            };
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

            if (!response.ok) {
                // console.log('respons is not OK');
                // console.log("Status:", response.status);
                // const error = await response.text();
                // console.log(error);
                if (toast?.show) {
                    toast.show("Could not get toilets", {
                        type: "custom",
                        data: {
                            type: "error",
                            text2: "Try again a few moments later or check connection.",
                        },
                    })
                };
                return null;
            };

            const jsonRes = await response.json();
            return jsonRes.reviews;


        } catch (error) {
            // console.log("Error get WC reviews", error);
            if (toast?.show) {
                toast.show("Something went wrong getting WC!", {
                    type: "custom",
                    data: {
                        type: "error",
                        text2: "It can be our servers or your connection. \nCheck and try again.",
                    },
                })
            };

        } finally {
            endWaiting(waitingId);
        }
    }
    return ({
        getWc,
        getWcReviews
    });
}