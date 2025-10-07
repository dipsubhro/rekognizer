const API_ENDPOINT = "https://2kp8bnydjd.execute-api.ap-south-1.amazonaws.com/v1/analyze";

export const analyzeImage = async (base64Image) => {
    try {
        const response = await fetch(API_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ image: base64Image }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};
