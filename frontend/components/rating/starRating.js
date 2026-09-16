import { View } from "react-native";
import { Text } from "react-native-paper";
import { useMemo } from "react";
import StarRating from "react-native-star-rating-widget";
import { useTranslation } from "react-i18next";

export default function Rating({ theme, setWcData, ratings }) {
    const { t } = useTranslation();

    const starColor = theme.colors.secondaryLight;
    const emptyStarColor = starColor + "70";

    const averageRating = useMemo(() => {
        const values = Object.values(ratings);

        if (!values.length) return 0;

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

    const RatingRow = ({ label, field }) => (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                marginLeft:19
            }}
        >
            <Text
                variant="bodySmall"
                style={{
                    width: 105,
                    marginRight: 5,
                }}
                numberOfLines={1}
            >
                {t(label)}
            </Text>

            <StarRating
                starSize={23}
                rating={ratings[field]}
                onChange={(value) => updateRating(field, value)}
                style={{ marginBottom: 12 }}
                step="full"
                color={starColor}
                emptyColor={emptyStarColor}
            />
        </View>
    );

    return (
        <View
            style={{
                width: "100%",
                gap: 14,
            }}
        >
            {/* Overall */}
            <View
                style={{
                    marginTop:10,
                    flexDirection: "row",
                    alignItems: "center",
                    width: "100%",
                    marginLeft: 19
                }}
            >
                <Text
                    style={{
                        width: 105,
                        marginRight: 5,
                        fontSize: 18,
                        fontWeight: "bold",
                        marginBottom: 5,
                    }}
                >
                    {t("starRating.overall")}
                </Text>

                <StarRating
                    starSize={23}
                    rating={averageRating}
                    onChange={() => {}}
                    enableSwiping={false}
                    step="quarter"
                    color={starColor}
                    emptyColor={emptyStarColor}
                />

                <Text
                    style={{
                        marginLeft: 5,
                        color: theme.colors.text + "95",
                    }}
                >
                    {averageRating.toFixed(1)} / 5
                </Text>
            </View>

            <RatingRow
                label="starRating.cleanliness"
                field="cleanliness"
            />

            <RatingRow
                label="starRating.odor"
                field="odor"
            />

            <RatingRow
                label="starRating.amenitiesHealth"
                field="amenitiesHealth"
            />

            <RatingRow
                label="starRating.light"
                field="light"
            />

            <RatingRow
                label="starRating.privacy"
                field="privacy"
            />

            <RatingRow
                label="starRating.crowd"
                field="crowd"
            />
        </View>
    );
}