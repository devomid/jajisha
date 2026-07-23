import { View, Pressable, Text } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import StarRating from 'react-native-star-rating-widget';
import { useTranslation } from "react-i18next";


export default function Rating({ theme }) {

    const { t } = useTranslation();

    const [rating, setRating] = useState(0);


    return (
        <View>
            <Text>
                {t("starRating.cleaness")}
            </Text>
            <StarRating
                style={{ marginBottom: 12 }}
                rating={rating}
                onChange={setRating}
                step="full"
            />
            <Text>
                {t("starRating.odor")}
            </Text>
            <StarRating
                style={{ marginBottom: 12 }}
                rating={rating}
                onChange={setRating}
                step="full"
            />
            <Text>
                {t("starRating.amenitiesHealth")}
            </Text>
            <StarRating
                style={{ marginBottom: 12 }}
                rating={rating}
                onChange={setRating}
                step="full"
            />
            <Text>
                {t("starRating.light")}
            </Text>
            <StarRating
                style={{ marginBottom: 12 }}
                rating={rating}
                onChange={setRating}
                step="full"
            />
            <Text>
                {t("starRating.privacy")}
            </Text>
            <StarRating
                style={{ marginBottom: 12 }}
                rating={rating}
                onChange={setRating}
                step="full"
            />
            <Text>
                {t("starRating.crowd")}
            </Text>
            <StarRating
                style={{ marginBottom: 12 }}
                rating={rating}
                onChange={setRating}
                step="full"
            />
        </View>
    );
}


