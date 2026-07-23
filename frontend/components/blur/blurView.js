import React from "react";
import { StyleSheet } from "react-native";
import { BottomSheetBackgroundProps } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";

const GlassBackground = ({ style }) => {
    return (
        <BlurView
            intensity={30}
            tint="extraLight"
            style={[
                style,
                styles.background,
            ]}
        />
    );
};

const styles = StyleSheet.create({
    background: {
        borderRadius: 30,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.3)",
        backgroundColor: "rgba(251, 238, 62, 0.25)",
    },
});

export default GlassBackground;