export const useCreateReview = () => {
    const toiletId = useWcDataStore((state) => state.selectedToilet._id);
    const userId = useUserStore((state) => state.user._id);

    const createReview = async ({ reviewText }) => {
        try {
            const response = await fetch(
                `http://192.168.43.42:3001/api/managment/${userId}/toiletManagement/${toiletId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: {
                        reviewText
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
    return createReview;
}