import React, { forwardRef, useMemo, useCallback } from "react";
import { Text } from "react-native";
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop, } from "@gorhom/bottom-sheet";
import GlassBackground from "../../components/blur/blurView";
import { BlurView } from "expo-blur";



const ToiletInfo = forwardRef((props, ref) => {
    const snapPoints = useMemo(() => ["50%", "80%"], []);

    const handleSheetChanges = useCallback((index) => {
        console.log(index);
    }, []);

    const renderBackdrop = useCallback(
        (props) => (

            <BottomSheetBackdrop
                {...props}
                opacity={0.3}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                pressBehavior="close"
            />
        ),
        []
    );

    return (
        <BottomSheetModal
            ref={ref}
            snapPoints={snapPoints}
            enableDynamicSizing={false}
            onChange={handleSheetChanges}
            backdropComponent={renderBackdrop}
            backgroundComponent={(props) => (
                <GlassBackground {...props} />
            )}
            handleStyle={{
                backgroundColor: "transparent",
            }}
            handleIndicatorStyle={{
                backgroundColor: "rgba(255,255,255,0.6)",
                width: 50,
                height: 5,
            }}
        >
            <BottomSheetView
                style={{
                    flex: 1,
                    padding: 24,
                    backgroundColor: "transparent",
                }}
            >
                <Text style={{ color: "white" }}>
                    Toilet info
                </Text>
            </BottomSheetView>
        </BottomSheetModal>
    );
});

export default ToiletInfo;