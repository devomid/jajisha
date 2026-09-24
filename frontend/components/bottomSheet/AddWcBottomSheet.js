import React, { forwardRef, useMemo, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { View, Text } from "react-native";
import { useTheme } from "react-native-paper";
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";

import { useWcDataStore } from "../../src/store/wcDataStore";
import { useManagingWc } from "../../src/hooks/useManagingWc";

import ButtonComponent from "../Button/Button";
import NewToilet from "../newToilet/newToilet";
import GlassBackground from "../../components/blur/blurView";

const AddWc = forwardRef((props, ref) => {
    const { t } = useTranslation();

    const isPickingLocation = useWcDataStore(state => state.isPickingLocation);
    const theme = useTheme();
    const snapPoints = useMemo(() => ["86%"], []);
    const { addWc } = useManagingWc();
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
    }, []);

    const renderBackdrop = useCallback(
        (props) => (
            <BottomSheetBackdrop
                {...props}
                opacity={0.3}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                pressBehavior="close"
                style={{ backgroundColor: theme.colors.primaryLighter + '60' }}
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
            containerStyle={{
                borderRadius: 48,
                marginBottom: 12,
                marginHorizontal: 12,
                overflow: "hidden",
            }}
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
                    paddingHorizontal: 24,
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
                        marginBottom: 20
                    }}
                >
                    <ButtonComponent
                        onPress={handleCancel}
                        backgroundColor={theme.colors.error + '15'}
                        borderColor={theme.colors.error + '50'}
                        style={{
                            width: '30%',
                        }}
                    >
                        <Text style={{
                            color: theme.colors.error +'99'
                        }}>
                            {t("components.addWcBottomSheet.cancelAddWcBtn")}
                        </Text>
                    </ButtonComponent>

                    <ButtonComponent
                        onPress={handleAdd}
                        backgroundColor={theme.colors.secondary + '15'}
                        borderColor={theme.colors.secondaryLight + '50'}
                        style={{
                            width: '70%',
                        }}
                    >
                        <Text style={{
                            color: theme.colors.secondary
                        }}>{
                                t("components.addWcBottomSheet.addWcBtn")}
                        </Text>
                    </ButtonComponent>

                </View>
            </View>

        </BottomSheetModal >
    );
});

export default AddWc;