import { forwardRef, useMemo, useCallback, useState, useEffect } from "react";
import { View, Pressable, Share as RNShare } from "react-native";
import { router } from "expo-router";
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetScrollView, } from "@gorhom/bottom-sheet";
import { useWcDataStore } from "../../store/wcDataStore";
import { useUserStore } from "../../store/userStore";
import { useSaveWc } from "../../src/hooks/useSaveWc";
import { useUnsaveWc } from "../../src/hooks/useUnsaveWc";
import { useAuth } from "../../src/hooks/useAuth";
import { useTranslation } from "react-i18next";

import GlassBackground from "../../components/blur/blurView";
import StarRating from "react-native-star-rating-widget";
import PhotoGallery from "../photoGallery/photoGallery";
import Review from "../reviews/reviews";
import ButtonComponent from "../Button/Button";

import { BlurView } from "expo-blur";
import { Save, Share2, Toilet, SaveCheck, Star, MapPin, Road, Route } from "lucide-react-native";
import { Text, useTheme, SegmentedButtons } from "react-native-paper";


const ToiletInfo = forwardRef(({ curentLocation, onPresent }, ref) => {
    const { restoreUser } = useAuth();
    const user = useUserStore((state) => state.user);
    const saveWc = useSaveWc();
    const unsave = useUnsaveWc();
    const [isSaved, setIsSaved] = useState(false);
    const [value, setValue] = useState('');
    const { t } = useTranslation();
    const theme = useTheme();
    const toilet = useWcDataStore((state) => state.selectedToilet);
    const setNavigationTarget = useWcDataStore(state => state.setNavigationTarget);
    const navigation = useWcDataStore(state => state.navigation);
    const { distance, duration, status, } = navigation;

    const snapPoints = useMemo(() => ["33%", "62%", "85%"], []);

    useEffect(() => {
        restoreUser()
    }, [])
    const handleSheetChanges = useCallback((index) => {
        console.log(index);
        onPresent?.(index);
    }, [onPresent]);

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


    const formattedDistance = toilet
        ? distance < 1000
            ? `${distance} m`
            : `${(distance / 1000).toFixed(1)} km`
        : "--";

    const formatDuration = () => {

        if (duration == null) {
            return "--";
        }

        const minutes = Math.round(duration / 60);

        if (minutes < 60) {
            return `${minutes} min`;
        }

        const hours = Math.floor(minutes / 60);

        const remainingMinutes =
            minutes % 60;

        return `${hours}h ${remainingMinutes}min`;

    };

    const handleSave = async () => {
        if (!user) {
            ref.current?.dismiss();
            router.push("/SignIn");
            return;
        }

        try {
            if (isSaved) {
                // It's currently saved → unsave it
                const success = await unsave();

                if (success) {
                    setIsSaved(false);
                    console.log("WC unsaved");
                }
            } else {
                // It's currently not saved → save it
                const success = await saveWc();

                if (success) {
                    setIsSaved(true);
                    console.log("WC saved");
                }
            }
        } catch (error) {
            console.log("Save/unsave error:", error);
        }
    };

    const handleShare = async () => {
        try {
            const coordinates = toilet?.location?.coordinates;

            if (
                !coordinates ||
                coordinates.length !== 2 ||
                coordinates[0] == null ||
                coordinates[1] == null
            ) {
                return;
            }

            const [longitude, latitude] = coordinates;
            const message = [`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`]
                .filter(Boolean)
                .join("\n");

            await RNShare.share({
                title: toilet.name,
                message,
            });

        } catch (error) {
            console.log("Share error:", error);
        }
    };

    return (
        <BottomSheetModal
            onPresent={() => {
                console.log("TOILET INFO >>> PRESENTED");
                onPresent?.();
            }}
            
            containerStyle={{
                borderRadius: 48,
                marginBottom: 12,
                marginHorizontal: 12,
                overflow: "hidden",
            }}
            onDismiss={() => {
                console.log("TOILET INFO >>> DISMISSED");
            }}
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
            {toilet && (

                <View
                    style={{
                        flex: 1,
                        backgroundColor: "transparent",
                    }}
                >
                    {/* FIXED HEADER */}
                    <View
                        style={{
                            paddingLeft: 20,
                            paddingBottom: 10,
                            paddingRight: 40
                        }}
                    >
                        <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            variant="headlineLarge"
                            style={{
                                color: theme.colors.secondaryDarker + '99',
                                width: 195
                            }}
                        >
                            {toilet.name}
                        </Text>

                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 15
                            }}>
                            <MapPin
                                size={18}
                                color={theme.colors.text + '70'}
                                strokeWidth={2} />
                            <Text
                                numberOfLines={1}
                                style={{
                                    color: theme.colors.text + '90',
                                    marginTop: 10,
                                    paddingRight: 24,
                                    marginBottom: 10
                                }}
                            >
                                {toilet.address}
                            </Text>
                        </View>

                        <View
                            style={{
                                width: '100%',
                                paddingVertical: 5,
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 15,
                                marginTop: 8,
                            }}
                        >
                            <Road
                                size={18}
                                color={theme.colors.secondaryLight + '90'}
                                strokeWidth={2} />
                            {formattedDistance && (
                                <Text
                                    style={{
                                        color: theme.colors.secondaryLight + '90',
                                        marginRight: 30
                                    }}
                                    variant="bodySmall"
                                >
                                    {formattedDistance}
                                </Text>
                            )}
                            <Text
                                style={{
                                    color: theme.colors.secondaryLight + '90',
                                }}
                                variant="bodySmall"
                            >
                                {formatDuration()}
                            </Text>
                        </View>

                        <View
                            style={{
                                position: "absolute",
                                right: 24,
                                top: 10,
                                flexDirection: "row",
                                gap: 10,
                            }}
                        >
                            <Star
                                size={18}
                                color={theme.colors.secondaryLight}
                                strokeWidth={2}
                            />
                            <Text
                                style={{
                                    color: theme.colors.text,
                                    fontWeight: 800,
                                }}
                                variant="bodySmall"
                            >
                                {toilet.ratingSummary.average.toFixed(1)}
                            </Text>

                            <Text
                                style={{
                                    color: theme.colors.text + '99',
                                }}
                                variant="bodySmall"
                            >
                                ({toilet.ratingSummary.count} vote)
                            </Text>
                        </View>

                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 7
                            }}>
                            <ButtonComponent
                                onPress={() => {
                                    ref.current?.dismiss();
                                    setNavigationTarget(toilet);
                                }} backgroundColor={theme.colors.nav + '15'}
                                borderColor={theme.colors.secondaryLighter + '80'}
                                style={{
                                    width: '52%',
                                    marginTop: 10
                                }}
                            >
                                <View
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexDirection: 'row', gap: 15
                                    }}
                                >
                                    <Route
                                        size={15}
                                        color={theme.colors.nav}
                                        strokeWidth={2} />
                                    <Text style={{ color: theme.colors.nav + '99', }}>
                                        Show route
                                    </Text>
                                </View>
                            </ButtonComponent>
                            <ButtonComponent
                                onPress={handleShare}
                                backgroundColor={theme.colors.secondaryLight + '14'}
                                borderColor={theme.colors.secondaryLighter + '80'}
                                style={{
                                    width: '25%',
                                    marginTop: 10
                                }}
                            >
                                <View
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexDirection: 'row', gap: 15
                                    }}
                                >
                                    <Share2
                                        size={15}
                                        color={theme.colors.secondaryLight}
                                        strokeWidth={2} />
                                    <Text
                                        style={{
                                            color: theme.colors.secondaryLight,
                                            fontSize: 15,
                                            fontWeight: "500",
                                        }}
                                    >
                                        Share
                                    </Text>
                                </View>
                            </ButtonComponent>
                            <ButtonComponent
                                onPress={handleSave}
                                backgroundColor={theme.colors.secondary + '15'}
                                borderColor={theme.colors.secondaryLighter + '80'}
                                style={{
                                    width: '25%',
                                    marginTop: 10
                                }}
                            >
                                <View
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexDirection: 'row', gap: 15
                                    }}
                                >
                                    <Save
                                        size={15}
                                        color={theme.colors.secondaryLight}
                                        strokeWidth={2} />
                                    <Text
                                        style={{
                                            color: theme.colors.secondaryLight,
                                            fontSize: 15,
                                            fontWeight: "500",
                                        }}
                                    >
                                        Save
                                    </Text>
                                </View>
                            </ButtonComponent>
                        </View>


                    </View>

                    {/* SCROLLABLE CONTENT */}
                    <BottomSheetScrollView
                        contentContainerStyle={{
                            paddingHorizontal: 24,
                            paddingBottom: 40,
                        }}
                        showsVerticalScrollIndicator={false}
                    >
                        <View
                            style={{
                                width: '100%',
                                height: 65,
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent:'space-around',
                                marginBottom:10
                            }}
                        >
                            <BlurView
                                intensity={15}
                                tint="light"
                                style={{
                                    borderRadius: 14,
                                    overflow: "hidden",
                                    width: "19%",
                                }}
                            >
                                <View
                                    style={{
                                        height: 55,
                                        borderRadius: 14,
                                        borderWidth: 0.5,
                                        borderColor: theme.colors.secondaryLight + '50',
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: theme.colors.surface + '50',
                                    }}
                                >
                                    <Text>sldfieijf</Text>
                                </View>
                            </BlurView>
                            <BlurView
                                intensity={15}
                                tint="light"
                                style={{
                                    borderRadius: 14,
                                    overflow: "hidden",
                                    width: "19%",
                                }}
                            >
                                <View
                                    style={{
                                        height: 55,
                                        borderRadius: 14,
                                        borderWidth: 0.5,
                                        borderColor: theme.colors.secondaryLight + '50',
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: theme.colors.surface + '50',
                                    }}
                                >
                                    <Text>sldfieijf</Text>
                                </View>
                            </BlurView>
                            <BlurView
                                intensity={15}
                                tint="light"
                                style={{
                                    borderRadius: 14,
                                    overflow: "hidden",
                                    width: "19%",
                                }}
                            >
                                <View
                                    style={{
                                        // width: "20%",
                                        height: 55,
                                        borderRadius: 14,
                                        borderWidth: 0.5,
                                        borderColor: theme.colors.secondaryLight + '50',
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: theme.colors.surface + '50',
                                    }}
                                >
                                    <Text>sldfieijf</Text>
                                </View>
                            </BlurView>
                            <BlurView
                                intensity={15}
                                tint="light"
                                style={{
                                    borderRadius: 14,
                                    overflow: "hidden",
                                    width: "19%",
                                }}
                            >
                                <View
                                    style={{
                                        // width: "20%",
                                        height: 55,
                                        borderRadius: 14,
                                        borderWidth: 0.5,
                                        borderColor: theme.colors.secondaryLight + '50',
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: theme.colors.surface + '50',
                                    }}
                                >
                                    <Text>sldfieijf</Text>
                                </View>
                            </BlurView>
                            <BlurView
                                intensity={15}
                                tint="light"
                                style={{
                                    borderRadius: 14,
                                    overflow: "hidden",
                                    width: "19%",
                                }}
                            >
                                <View
                                    style={{
                                        height: 55,
                                        borderRadius: 14,
                                        borderWidth: 0.5,
                                        borderColor: theme.colors.secondaryLight + '50',
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: theme.colors.surface + '50',
                                    }}
                                >
                                    <Text>sldfieijf</Text>
                                </View>
                            </BlurView>
                        </View>
                        <View>
                            <PhotoGallery />
                        </View>

                        <View>
                            <SegmentedButtons
                                value={value}
                                onValueChange={setValue}
                                buttons={[
                                    {
                                        value: 'review',
                                        label: 'Reviews',
                                    },
                                    {
                                        value: 'amenities',
                                        label: 'Amenities'
                                    },
                                    {
                                        value: 'ratings',
                                        label: 'Ratings',
                                    },
                                ]}
                            />
                        </View>

                        <View
                            theme={theme}
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Review />
                            <Review />
                            <Review />
                        </View>
                    </BottomSheetScrollView>
                </View>
            )}
        </BottomSheetModal>
    );
});

export default ToiletInfo;