import { useWcDataStore } from "../../store/wcDataStore";


export const useAddWc = () => {

    const wcData = useWcDataStore((state) => state.wcData);
    const addToilet = useWcDataStore(state => state.addToilet);

    const addWc = async function () {
        try {
            // console.log(wcData);
            //loading state update

            const averageRating =
                Object.values(wcData.ratings).reduce((sum, value) => sum + value, 0) /
                Object.values(wcData.ratings).length;

            const toiletData = {
                ...wcData,
                ratings: {
                    ...wcData.ratings,
                    averageRating,
                },
            };


            const response = await fetch("http://192.168.43.42:3001/api/toilets", {
                method: "POST",
                headers: { "Content-Type": 'application/json' },
                body: JSON.stringify({
                    wcData: toiletData,
                })
            });
            if (response.ok) {
                const jsonRes = await response.json();
                addToilet(jsonRes)
                return jsonRes;
            } else {
                console.log('respons is not OK');
                console.log("Status:", response.status);

                const error = await response.text();
                console.log(error);

                return;
            }
        } catch (error) {
            console.log('error adding WC', error);
        }
    }
    return ({ addWc });
}