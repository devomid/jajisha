
export function formatDistance(meters, unit, t) {

    if (typeof meters !== "number") {
        return "--";
    }

    if (unit === "Imperial") {
        const feet = meters * 3.28084;

        if (feet < 1000) {
            return `${Math.round(feet)} ${t("components.ToiletLocationBottomSheet.ft")}`;
        }

        const miles = meters / 1609.344;

        return `${miles.toFixed(1)} ${t("components.ToiletLocationBottomSheet.mile")}`;
    }

    if (meters < 1000) {
        return `${Math.round(meters)} ${t("components.ToiletLocationBottomSheet.m")}`;
    }

    const kilometers = meters / 1000;

    return `${kilometers.toFixed(1)} ${t("components.ToiletLocationBottomSheet.km")}`;
}