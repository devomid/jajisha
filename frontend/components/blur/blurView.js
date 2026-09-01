import React from "react";
import { StyleSheet } from "react-native";
import { BottomSheetBackgroundProps } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";


const GlassBackground = ({ style, theme }) => {
    console.log(theme.colors.primary);
    return (
        <BlurView
            intensity={15}
            tint="systemUltraThinMaterialLight"
            style={[
                style,
                {
                    borderRadius: 30,
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: theme.colors.primaryLighter + '80',
                    backgroundColor: theme.colors.primary + '30'
                }
            ]}
        />
    );
};


export default GlassBackground;