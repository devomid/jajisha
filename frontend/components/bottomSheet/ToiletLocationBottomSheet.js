import { forwardRef, useMemo, useCallback, useState, useEffect } from "react";
import { Text, useTheme, SegmentedButtons } from "react-native-paper";
import { View, Pressable, Share as RNShare } from "react-native";
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetScrollView, } from "@gorhom/bottom-sheet";
import GlassBackground from "../../components/blur/blurView";
import { BlurView } from "expo-blur";
import { useTranslation } from "react-i18next";
import { useWcDataStore } from "../../store/wcDataStore";
import { Bookmark, Share, Navigation, Toilet, BookmarkCheck } from "lucide-react-native";
import StarRating from "react-native-star-rating-widget";
import PhotoGallery from "../photoGallery/photoGallery";
import MapView, { Marker } from "react-native-maps";
import { DynamicColorIOS } from 'react-native';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import Review from "../reviews/reviews";
import { useUserStore } from "../../store/userStore";
import { router } from "expo-router";
import ButtonComponent from "../Button/Button";
import { useSaveWc } from "../../src/hooks/useSaveWc";
import { useUnsaveWc } from "../../src/hooks/useUnsaveWc";
import { useAuth } from "../../src/hooks/useAuth";


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

    const snapPoints = useMemo(() => ["28%", "57%", "85%"], []);

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
                            paddingHorizontal: 24,
                            paddingBottom: 10,
                        }}
                    >
                        <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            variant="headlineLarge"
                            style={{ color: theme.colors.secondaryDarker, width: 195 }}
                        >
                            {toilet.name}
                        </Text>

                        <View
                            style={{
                                paddingVertical: 5,
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 1,
                                marginTop: 8,
                            }}
                        >
                            <Text
                                style={{
                                    color: theme.colors.text,
                                }}
                                variant="bodySmall"
                            >
                                {toilet.ratingSummary.average.toFixed(1)} / 5
                            </Text>

                            <StarRating
                                rating={toilet.ratingSummary.average}
                                onChange={() => { }}
                                enableSwiping={false}
                                step="quarter"
                                starSize={15}
                                emptyColor={theme.colors.unfocused}
                                color={theme.colors.primaryDarker}
                                StarIconComponent={Toilet}
                            />

                            <Text
                                style={{
                                    color: theme.colors.text,
                                }}
                                variant="bodySmall"
                            >
                                ({toilet.ratingSummary.count} vote)
                            </Text>

                            {formattedDistance && (
                                <Text
                                    style={{
                                        position: "absolute",
                                        right: 10,
                                        color: theme.colors.text,
                                    }}
                                    variant="bodySmall"
                                >
                                    {formattedDistance}
                                </Text>
                            )}
                            <Text
                                style={{
                                    position: "absolute",
                                    right: 70,
                                    color: theme.colors.text,
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
                                gap: 30,
                            }}
                        >
                            <Pressable
                                onPress={handleSave}
                            >
                                {({ pressed }) => (
                                    isSaved ? (
                                        <BookmarkCheck style={{
                                            transform: [{ scale: pressed ? 0.85 : 1 }],

                                        }}
                                            color={theme.colors.secondary} />
                                    ) : (
                                        <Bookmark style={{
                                            transform: [{
                                                scale: pressed ? 0.85 : 1
                                            }],

                                        }}
                                            color={theme.colors.secondary} />
                                    )
                                )}
                            </Pressable>
                            <Pressable
                                onPress={handleShare}
                            >
                                {({ pressed }) => (
                                    <Share style={{
                                        transform: [{ scale: pressed ? 0.85 : 1 }],

                                    }}
                                        color={theme.colors.secondary} />
                                )}
                            </Pressable>
                        </View>

                        <ButtonComponent
                            onPress={() => {
                                ref.current?.dismiss();
                                setNavigationTarget(toilet);
                            }}
                            backgroundColor={theme.colors.nav + '60'}
                            borderColor={theme.colors.secondaryLighter + '80'}
                            style={{
                                width: '100%',
                                marginTop: 10
                            }}
                        >
                            <Text style={{ color: theme.colors.surface, }}>
                                Show route to WC
                            </Text>
                        </ButtonComponent>

                        <View>
                            <Text
                                numberOfLines={2}
                                style={{
                                    color: theme.colors.secondaryDarker,
                                    marginTop: 10,
                                    paddingRight: 24
                                }}
                            >
                                {toilet.address}
                            </Text>

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