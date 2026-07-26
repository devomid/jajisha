import { View, Pressable, Text } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import StarRating from 'react-native-star-rating-widget';
import { useTranslation } from "react-i18next";


export default function Rating({ theme, setWcData, ratings }) {

    const { t } = useTranslation();


    return (
        <View>
            <Text>
                {t("starRating.cleanliness")}
            </Text>
            <StarRating
                style={{ marginBottom: 12 }}
                rating={ratings.cleanliness}
                onChange={(value) =>
                    setWcData(prev => ({
                        ...prev,
                        ratings: {
                            ...prev.ratings,
                            cleanliness: value,
                        },
                    }))
                }
                step="full"
            />
            <Text>
                {t("starRating.odor")}
            </Text>
            <StarRating
                style={{ marginBottom: 12 }}
                rating={ratings.odor}
                onChange={(value) =>
                    setWcData(prev => ({
                        ...prev,
                        ratings: {
                            ...prev.ratings,
                            odor: value,
                        },
                    }))
                }
                step="full"
            />
            <Text>
                {t("starRating.amenitiesHealth")}
            </Text>
            <StarRating
                style={{ marginBottom: 12 }}
                rating={ratings.amenitiesHealth}
                onChange={(value) =>
                    setWcData(prev => ({
                        ...prev,
                        ratings: {
                            ...prev.ratings,
                            amenitiesHealth: value,
                        },
                    }))
                }
                step="full"
            />
            <Text>
                {t("starRating.light")}
            </Text>
            <StarRating
                style={{ marginBottom: 12 }}
                rating={ratings.light}
                onChange={(value) =>
                    setWcData(prev => ({
                        ...prev,
                        ratings: {
                            ...prev.ratings,
                            light: value,
                        },
                    }))
                }
                step="full"
            />
            <Text>
                {t("starRating.privacy")}
            </Text>
            <StarRating
                style={{ marginBottom: 12 }}
                rating={ratings.privacy}
                onChange={(value) =>
                    setWcData(prev => ({
                        ...prev,
                        ratings: {
                            ...prev.ratings,
                            privacy: value,
                        },
                    }))
                }
                step="full"
            />
            <Text>
                {t("starRating.crowd")}
            </Text>
            <StarRating
                style={{ marginBottom: 12 }}
                rating={ratings.crowd}
                onChange={(value) =>
                    setWcData(prev => ({
                        ...prev,
                        ratings: {
                            ...prev.ratings,
                            crowd: value,
                        },
                    }))
                }
                step="full"
            />
        </View>
    );
}


