import { View, Text } from "react-native";
import { useMemo } from "react";
import StarRating from "react-native-star-rating-widget";
import { useTranslation } from "react-i18next";

export default function Rating({ setWcData, ratings }) {
    const { t } = useTranslation();

    const averageRating = useMemo(() => {
        const values = Object.values(ratings);
        return values.reduce((sum, value) => sum + value, 0) / values.length;
    }, [ratings]);

    const updateRating = (field, value) => {
        setWcData((prev) => ({
            ...prev,
            ratings: {
                ...prev.ratings,
                [field]: value,
            },
        }));
    };

    return (
        <View>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
                {t("starRating.overall")}
            </Text>

            <StarRating
                rating={averageRating}
                onChange={() => { }}
                enableSwiping={false}
                step="quarter"
            />

            <Text style={{ marginBottom: 24 }}>
                {averageRating.toFixed(1)} / 5
            </Text>

            <Text>{t("starRating.cleanliness")}</Text>
            <StarRating
                rating={ratings.cleanliness}
                onChange={(value) => updateRating("cleanliness", value)}
                style={{ marginBottom: 12 }}
                step="full"
            />

            <Text>{t("starRating.odor")}</Text>
            <StarRating
                rating={ratings.odor}
                onChange={(value) => updateRating("odor", value)}
                style={{ marginBottom: 12 }}
                step="full"
            />

            <Text>{t("starRating.amenitiesHealth")}</Text>
            <StarRating
                rating={ratings.amenitiesHealth}
                onChange={(value) => updateRating("amenitiesHealth", value)}
                style={{ marginBottom: 12 }}
                step="full"
            />

            <Text>{t("starRating.light")}</Text>
            <StarRating
                rating={ratings.light}
                onChange={(value) => updateRating("light", value)}
                style={{ marginBottom: 12 }}
                step="full"
            />

            <Text>{t("starRating.privacy")}</Text>
            <StarRating
                rating={ratings.privacy}
                onChange={(value) => updateRating("privacy", value)}
                style={{ marginBottom: 12 }}
                step="full"
            />

            <Text>{t("starRating.crowd")}</Text>
            <StarRating
                rating={ratings.crowd}
                onChange={(value) => updateRating("crowd", value)}
                style={{ marginBottom: 12 }}
                step="full"
            />
        </View>
    );
}