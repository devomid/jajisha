import React, { forwardRef, useMemo, useCallback, useEffect } from "react";
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import GlassBackground from "../../components/blur/blurView";
import NewToilet from "../newToilet/newToilet";
import { useTheme } from "react-native-paper";
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { View, Pressable, Text } from "react-native";
import { BlurView } from "expo-blur";
import { useTranslation } from "react-i18next";
import { useAddWc } from "../../src/hooks/useAddWc";
import { useWcDataStore } from "../../store/wcDataStore";


const AddWc = forwardRef((props, ref) => {
    const { t } = useTranslation();

    const isPickingLocation = useWcDataStore(state => state.isPickingLocation);
    const theme = useTheme();
    const snapPoints = useMemo(() => ["85%"], []);
    const { addWc } = useAddWc();
    const wcData = useWcDataStore((state) => state.wcData);
    const setWcData = useWcDataStore((state) => state.setWcData);
    const resetWcData = useWcDataStore(state => state.resetWcData);

    const handleAdd = async () => {
        const success = await addWc(wcData);

        if (!success) return;

        ref.current?.dismiss();   // close sheet
        resetWcData();            // clear form

    };

    const handleCancel = () => {
        ref.current?.dismiss();
        resetWcData();
    };

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


    useEffect(() => {
        if (isPickingLocation) {
            // ref.current?.dismiss();
            // ref.current?.snapToIndex(0);
            ref.current?.forceClose();
        }
    }, [isPickingLocation]);


    return (
        <BottomSheetModal
            ref={ref}
            snapPoints={snapPoints}
            enableDynamicSizing={false}
            onChange={handleSheetChanges}
            backdropComponent={renderBackdrop}
            backgroundComponent={(props) => (
                <GlassBackground {...props} theme={theme} />
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
                <NewToilet
                    theme={theme}
                />
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
                    <Pressable
                        style={{ flex: 1 }}
                        onPress={handleAdd}
                    >
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

                    <Pressable
                        style={{ flex: 1 }}
                        onPress={handleCancel}
                    >
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