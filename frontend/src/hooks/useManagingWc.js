import { useWcDataStore } from "../../store/wcDataStore";
import { useUserStore } from "../../store/userStore";
import { API_URL } from "../config/api";
import useWaitingSystemStore from '../../store/waitingSystemStore';
import { useToast } from "react-native-toast-notifications";


export const useManagingWc = () => {
    const toast = useToast();
    const wcData = useWcDataStore((state) => state.wcData);
    const addToilet = useWcDataStore((state) => state.addToilet);
    const user = useUserStore((state) => state.user);
    const token = user?.token
    const startWaiting = useWaitingSystemStore(state => state.startWaiting);
    const updateWaiting = useWaitingSystemStore(state => state.updateWaiting);
    const endWaiting = useWaitingSystemStore(state => state.endWaiting);
    const setToilets = useWcDataStore(state => state.setToilets);
    const toilet = useWcDataStore((state) => state.selectedToilet);

    const addWc = async () => {

        if (!token) return null;

        const waitingId = startWaiting("Checking if the toilet is real...");

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
                        wcData: {
                            ...wcData,
                            location: {
                                latitude: wcData.location.coordinates[1],
                                longitude: wcData.location.coordinates[0],
                            },
                        },
                    }),
                }
            );

            updateWaiting(
                waitingId,
                "Map is having a new WC..."
            );

            if (!response.ok) {
                // console.log("Response is not OK");
                // console.log("Status:", response.status);
                // console.log(await response.text());

                if (toast?.show) {
                    toast.show("Could not add toilet", {
                        type: "custom",
                        data: {
                            type: "error",
                            text2: "Try again a few moments later.",
                        },
                    })
                };

                return null;
            };

            const newToilet = await response.json();
            addToilet(newToilet);

            if (toast?.show) {
                toast.show("Toilet added to map", {
                    type: "custom",
                    data: {
                        type: "success",
                        text2: "Thanks for expanding our data.",
                    },
                })
            };
            return newToilet;

        } catch (error) {
            // console.log("Error adding WC:", error);
            if (toast?.show) {
                toast.show("Something went wrong adding WC!", {
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

    const saveWc = async () => {

        if (!token) {
            if (toast?.show) {
                toast.show("You can not save places!", {
                    type: "custom",
                    data: {
                        type: "warning",
                        text2: "Sign in or create an account.",
                    },
                })
            };
            return null;
        }
        if (!toilet?._id) {
            if (toast?.show) {
                toast.show("This toilet can not be saved!", {
                    type: "custom",
                    data: {
                        type: "warning",
                        text2: "Something's wrong that you can't do anything about it.",
                    },
                })
            };
            return null;
        }
        const waitingId = startWaiting("Saving to favorites");

        try {
            const response = await fetch(
                `${API_URL}/api/managment/saveToilets/${toilet._id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                // const errorText = await response.text();
                // console.log("SAVE FAILED:", errorText);
                if (toast?.show) {
                    toast.show("Could not save toilet", {
                        type: "custom",
                        data: {
                            type: "error",
                            text2: "Try again a few moments later.",
                        },
                    })
                };

                return null;
            }

            return true;

        } catch (error) {

            // console.log("Error saving WC:", error);
            if (toast?.show) {
                toast.show("Something went wrong saving WC!", {
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

    const unsaveWc = async () => {

        if (!token) {
            if (toast?.show) {
                toast.show("You can not save places!", {
                    type: "custom",
                    data: {
                        type: "warning",
                        text2: "Sign in or create an account.",
                    },
                })
            };
            return null;
        }
        if (!toilet?._id) {
            if (toast?.show) {
                toast.show("This toilet can not be saved!", {
                    type: "custom",
                    data: {
                        type: "warning",
                        text2: "Something's wrong that you can't do anything about it.",
                    },
                })
            };
            return null;
        }
        const waitingId = startWaiting("Removing from favorites...");

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

            if (!response.ok) {
                // const errorText = await response.text();
                if (toast?.show) {
                    toast.show("Could not unsave toilet", {
                        type: "custom",
                        data: {
                            type: "error",
                            text2: "Try again a few moments later.",
                        },
                    })
                };
                return null;
            }
            return true;

        } catch (error) {
            // console.log("Error unsaving WC:", error);
            if (toast?.show) {
                toast.show("Something went wrong unsaving WC!", {
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

    return (
        addWc,
        getWc,
        getWcReviews,
        saveWc,
        unsaveWc
    )
};