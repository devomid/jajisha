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
import ButtonComponent from "../Button/Button";


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
                        gap: 10,
                        marginBottom:10
                    }}
                >
                    <ButtonComponent
                        onPress={handleAdd}
                        backgroundColor={theme.colors.success + '50'}
                        borderColor={theme.colors.success + '80'}
                        style={{
                            width: '50%',
                        }}
                    >
                        <Text style={{color:theme.colors.secondary}}>{t("AddWcBottomSheet.add")}</Text>
                    </ButtonComponent>

                    <ButtonComponent
                        onPress={handleCancel}
                        backgroundColor={theme.colors.error + '80'}
                        borderColor={theme.colors.error + '80'}
                        style={{
                            width: '50%',
                        }}
                    >
                        <Text style={{ color: theme.colors.secondary }}>{t("AddWcBottomSheet.cancel")}</Text>
                    </ButtonComponent>
                </View>
            </View>

        </BottomSheetModal >
    );
});

export default AddWc;