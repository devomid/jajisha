export function formatDistance(meters, unit = "Metric") {
    if (meters == null || Number.isNaN(Number(meters))) {
        return "";
    }

    const distance = Number(meters);

    if (unit === "Imperial") {
        const feet = distance * 3.28084;

        if (feet < 5280) {
            return `${Math.round(feet)} ft`;
        }

        const miles = feet / 5280;

        return `${miles < 10 ? miles.toFixed(1) : Math.round(miles)} mi`;
    }

    if (distance < 1000) {
        return `${Math.round(distance)} m`;
    }

    const kilometers = distance / 1000;

    return `${kilometers < 10 ? kilometers.toFixed(1) : Math.round(kilometers)} km`;
}