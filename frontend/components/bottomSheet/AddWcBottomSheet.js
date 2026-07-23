import React, { forwardRef, useMemo, useCallback } from "react";
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import GlassBackground from "../../components/blur/blurView";
import NewToilet from "../newToilet/newToilet";
import { useTheme } from "react-native-paper";
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { View, Pressable, Text } from "react-native";
import { BlurView } from "expo-blur";
import { useTranslation } from "react-i18next";



const AddWc = forwardRef((props, ref) => {
    const theme = useTheme();
    const snapPoints = useMemo(() => ["85%"], []);
    const handleSheetChanges = useCallback((index) => {
        // console.log(index);
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

    const { t } = useTranslation();


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
            <BottomSheetScrollView
                contentContainerStyle={{
                    padding: 24,
                    paddingBottom: 40,
                }}
            >
                <NewToilet theme={theme} />
            </BottomSheetScrollView>

            <View
                pointerEvents="box-none"
                style={{
                    position: 'absolute',
                    left: 24,
                    right: 24,
                    bottom: 90,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        gap: 10
                    }}
                >
                    <Pressable style={{ flex: 1 }}>
                        {({ pressed }) => (
                            <BlurView
                                intensity={15}
                                tint="extraLight"
                                style={{
                                    borderRadius: 34,
                                    overflow: 'hidden',
                                    transform: [{ scale: pressed ? 0.95 : 1 }],
                                }}
                            >
                                <View
                                    style={{
                                        justifyContent: 'center',
                                        borderRadius: 38,
                                        borderWidth: 0.5,
                                        borderColor: theme.colors.success,
                                        alignItems: 'center',
                                        paddingVertical: 30,
                                        backgroundColor:
                                            pressed
                                                ? theme.colors.success + '70'
                                                : theme.colors.success + '45',
                                    }}
                                >
                                    <Text>{t("AddWcBottomSheet.add")}</Text>
                                </View>
                            </BlurView>
                        )}
                    </Pressable>

                    <Pressable style={{ flex: 1 }}>
                        {({ pressed }) => (
                            <BlurView
                                intensity={15}
                                tint="extraLight"
                                style={{
                                    borderRadius: 34,
                                    overflow: 'hidden',
                                    transform: [{ scale: pressed ? 0.95 : 1 }],
                                }}
                            >
                                <View
                                    style={{
                                        justifyContent: 'center',
                                        borderRadius: 38,
                                        borderWidth: 0.5,
                                        borderColor: theme.colors.error,
                                        alignItems: 'center',
                                        paddingVertical: 30,
                                        backgroundColor:
                                            pressed
                                                ? theme.colors.error + '70'
                                                : theme.colors.error + '45',
                                    }}
                                >
                                    <Text>{t("AddWcBottomSheet.cancel")}</Text>
                                </View>
                            </BlurView>
                        )}
                    </Pressable>
                </View>
            </View>

        </BottomSheetModal >
    );
});

export default AddWc;