import { API_URL } from "../config/api";
import { useWcDataStore } from "../../store/wcDataStore";
import { useUserStore } from "../../store/userStore";
import useWaitingSystemStore from "../../store/waitingSystemStore";

export const useCreateReview = () => {
    const toiletId = useWcDataStore((state) => state.selectedToilet?._id);
    const user = useUserStore((state) => state.user);
    const setCreateReviewWaiting = useWaitingSystemStore(state => state.setCreateReviewWaiting);
    const setCreateReviewEndWaiting = useWaitingSystemStore(state => state.setCreateReviewEndWaiting);

    const createReview = async ({ reviewText, ratings }) => {


        try {
            setCreateReviewWaiting();

            if (!user?.token) {
                console.log("Cannot create review: user is not authenticated");
                return false;
            }

            if (!toiletId) {
                console.log("Cannot create review: toilet ID is missing");
                return false;
            }

            const response = await fetch(
                `${API_URL}/api/managment/toiletManagement/${toiletId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    },
                    body: JSON.stringify({
                        reviewText,
                        ratings
                    })
                }
            );

            if (!response.ok) {
                console.log("Response is not OK");
                console.log("Status:", response.status);
                console.log(await response.text());
                return false;
            }

            return true;

        } catch (error) {
            console.log("Error saving review:", error);
            return false;
        } finally {
            setCreateReviewEndWaiting();
        }
    };

    return createReview;
};