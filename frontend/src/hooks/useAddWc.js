export const useAddWc = () => {
    const addWc = async function (wcData) {
        try {
            // console.log(wcData);
            //loading state update

            const response = await fetch("http://localhost:3001/api/toilets", {
                method: "POST",
                headers: { "Content-Type": 'application/json' },
                body: JSON.stringify({ wcData })
            });
            if (response.ok) {
                const jsonRes = await response.json();
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