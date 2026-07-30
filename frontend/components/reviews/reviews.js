import { View, Pressable, Text } from "react-native";
import { router } from "expo-router";
import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useWcDataStore } from "../../store/wcDataStore";
import StarRating from "react-native-star-rating-widget";
import { useTheme } from "react-native-paper";


export default function Review() {

    const wcData = useWcDataStore((state) => state.wcData);
    const { t } = useTranslation();
    const toilet = useWcDataStore((state) => state.selectedToilet);
    const theme = useTheme();


    return (
        <View
            style={{
                width: '80%',
                height: 150,
                marginTop: 24,
                padding:15,
                borderWidth: 0.7,
                borderColor: theme.colors.secondary,
                borderRadius:20
            }}
        >
            <Text>
                {toilet.name}
            </Text>
        </View>
    )

}