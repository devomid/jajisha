import {
    forwardRef,
    useMemo,
    useCallback,
    useState,
    useEffect,
    useRef
} from "react";

import {
    View,
    Pressable,
    Share as RNShare,
    Animated,
    Easing
} from "react-native";

import { router } from "expo-router";

import {
    BottomSheetModal,
    BottomSheetBackdrop,
    BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

import { useWcDataStore } from "../../store/wcDataStore";
import { useUserStore } from "../../store/userStore";
import { useSaveWc } from "../../src/hooks/useSaveWc";
import { useUnsaveWc } from "../../src/hooks/useUnsaveWc";
import { useAuth } from "../../src/hooks/useAuth";
import { useTranslation } from "react-i18next";

import GlassBackground from "../../components/blur/blurView";
import PhotoGallery from "../photoGallery/photoGallery";
import ButtonComponent from "../Button/Button";

import { BlurView } from "expo-blur";

import {
    Save,
    SaveCheck,
    Share2,
    Star,
    MapPin,
    Road,
    Route,
    Timer,
    Ellipsis,
    Baby,
    Accessibility,
    Toilet,
    Droplets,
    SoapDispenserDroplet,
    Wind
} from "lucide-react-native";

import {
    Text,
    useTheme,
    SegmentedButtons
} from "react-native-paper";

import CommentSection from "../comments/commentGallery";
import CommentComponent from "../cards/commentCardComponentSmall";
import RateAndCommentSheet from "../rating/rateAndCommentSheet";


const ToiletInfo = forwardRef(({ curentLocation, onPresent }, ref) => {

    const { restoreUser } = useAuth();

    const user = useUserStore((state) => state.user);

    const saveWc = useSaveWc();
    const unsave = useUnsaveWc();

    const [sheetIndex, setSheetIndex] = useState(0);
    const [isAtAmenitiesHeight, setIsAtAmenitiesHeight] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [showAllAmenities, setShowAllAmenities] = useState(false);
    const [value, setValue] = useState("");
    const [saving, setSaving] = useState(false);
    const [iscommenting, setIscommenting] = useState(false);
    const [iscommentsOpen, setIscommentsOpen] = useState(false);

    const { t } = useTranslation();
    const theme = useTheme();

    const toilet = useWcDataStore((state) => state.selectedToilet);
    const setNavigationTarget = useWcDataStore(
        state => state.setNavigationTarget
    );

    const toiletRouteInfo = useWcDataStore(
        state => state.toiletRouteInfo
    );

    const { distance, duration } = toiletRouteInfo;

    const snapPoints = useMemo(
        () => ["39.5%", "48%", "65%", "86%"],
        []
    );

    const lastStableIndexRef = useRef(0);

    const programmaticAmenitiesHeightRef = useRef(false);

    const amenitiesAnimation = useRef(
        new Animated.Value(0)
    ).current;

    useEffect(() => {
        Animated.timing(amenitiesAnimation, {
            toValue: showAllAmenities ? 1 : 0,
            duration: 600,
            easing: Easing.bezier(
                0.25,
                0.1,
                0.25,
                1
            ),
            useNativeDriver: false,
        }).start();
    }, [showAllAmenities]);


    const extraAmenitiesAnimatedStyle = {
        maxHeight: amenitiesAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 130],
        }),

        opacity: amenitiesAnimation.interpolate({
            inputRange: [0, 0.35, 1],
            outputRange: [0, 0.2, 1],
        }),

        marginBottom: amenitiesAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 10],
        }),

        overflow: "hidden",
    };


    /*
     * ---------------------------------------------------------
     * SAVED STATE
     * ---------------------------------------------------------
     */

    useEffect(() => {
        if (!toilet?._id || !user?.favoriteToilets) {
            setIsSaved(false);
            return;
        }

        const saved = user.favoriteToilets.some(
            favorite =>
                String(favorite._id) === String(toilet._id)
        );

        setIsSaved(saved);
    }, [toilet, user]);


    useEffect(() => {
        restoreUser();
    }, []);


    /*
     * ---------------------------------------------------------
     * SHEET INDEX
     * ---------------------------------------------------------
     */

    const handleSheetChanges = useCallback(
        (index) => {

            /*
             * 44% is a protected temporary snap point.
             *
             * It can only be reached programmatically
             * by the More button.
             */

            if (index === 1) {

                if (
                    programmaticAmenitiesHeightRef.current
                ) {

                    programmaticAmenitiesHeightRef.current = false;

                    setSheetIndex(1);

                    onPresent?.(1);

                    return;
                }


                /*
                 * User manually dragged to 44%.
                 * Return to the last legitimate snap point.
                 */

                const previousStableIndex =
                    lastStableIndexRef.current;

                requestAnimationFrame(() => {
                    ref.current?.snapToIndex(
                        previousStableIndex
                    );
                });

                return;
            }


            /*
             * Legitimate snap point:
             *
             * 0 = 34%
             * 2 = 63%
             * 3 = 86%
             */

            lastStableIndexRef.current = index;

            setSheetIndex(index);

            if (index !== 1) {
                setIsAtAmenitiesHeight(false);
            }

            onPresent?.(index);
        },
        [onPresent, ref]
    );


    /*
     * ---------------------------------------------------------
     * BACKDROP
     * ---------------------------------------------------------
     */

    const renderBackdrop = useCallback(
        (props) => (
            <BottomSheetBackdrop
                {...props}
                opacity={0.3}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                pressBehavior="close"
                style={{
                    backgroundColor:
                        theme.colors.primaryLighter + "60"
                }}
            />
        ),
        [theme]
    );


    /*
     * ---------------------------------------------------------
     * AMENITIES
     * ---------------------------------------------------------
     */

    const amenitiesIcon = () => {

        const amenities = [
            {
                key: "western",
                name: "western",
                Icon: Toilet
            },
            {
                key: "iranian",
                name: "iranian",
                Icon: Toilet
            },
            {
                key: "babyChanging",
                name: "Baby Room",
                Icon: Baby
            },
            {
                key: "wheelchairAccessible",
                name: "Accessibility",
                Icon: Accessibility
            },
            {
                key: "handDryer",
                name: "Hand dryer",
                Icon: Wind
            },
            {
                key: "soap",
                name: "soap",
                Icon: SoapDispenserDroplet
            },
            {
                key: "toiletPaper",
                name: "Toilet paper",
                Icon: Toilet
            },
            {
                key: "Warm water",
                name: "warmWater",
                Icon: Droplets
            },
        ];

        return amenities.filter(
            amenity =>
                toilet?.amenities?.[amenity.key]
        );
    };


    /*
     * ---------------------------------------------------------
     * DISTANCE / DURATION
     * ---------------------------------------------------------
     */

    const formattedDistance =
        typeof distance === "number"
            ? distance < 1000
                ? `${Math.round(distance)} m`
                : `${(distance / 1000).toFixed(1)} km`
            : "--";


    const formatDuration = () => {

        if (typeof duration !== "number") {
            return "--";
        }

        const minutes = Math.round(
            duration / 60
        );

        if (minutes < 60) {
            return `${minutes} min`;
        }

        const hours = Math.floor(
            minutes / 60
        );

        const remainingMinutes =
            minutes % 60;

        return `${hours}h ${remainingMinutes}min`;
    };


    /*
     * ---------------------------------------------------------
     * MORE / LESS
     * ---------------------------------------------------------
     */

    const handleMore = () => {

        setShowAllAmenities(true);

        /*
         * Only move the sheet if it is currently
         * at the smallest 34% position.
         *
         * If the user is already at 63% or 86%,
         * don't interrupt their position.
         */

        if (lastStableIndexRef.current === 0) {

            setIsAtAmenitiesHeight(true);

            programmaticAmenitiesHeightRef.current = true;

            requestAnimationFrame(() => {
                ref.current?.snapToIndex(1);
            });
        }
    };


    const handleLess = () => {

        setShowAllAmenities(false);

        setIsAtAmenitiesHeight(false);

        /*
         * If we are at the temporary 44% position,
         * return to 34%.
         */

        if (sheetIndex === 1) {

            programmaticAmenitiesHeightRef.current = false;

            requestAnimationFrame(() => {
                ref.current?.snapToIndex(0);
            });

            return;
        }
    };


    /*
     * ---------------------------------------------------------
     * SAVE
     * ---------------------------------------------------------
     */

    const handleSave = async () => {

        if (!user) {

            ref.current?.dismiss();

            router.push("/SignIn");

            return;
        }


        if (
            saving ||
            !toilet?._id
        ) {
            return;
        }


        setSaving(true);

        try {

            if (isSaved) {

                console.log(
                    "Trying to UNSAVE:",
                    toilet._id
                );

                const success =
                    await unsave();

                console.log(
                    "UNSAVE RESULT:",
                    success
                );

                if (success) {

                    setIsSaved(false);

                    await restoreUser();

                    console.log(
                        "WC unsaved"
                    );
                }

            } else {

                console.log(
                    "Trying to SAVE:",
                    toilet._id
                );

                const success =
                    await saveWc();

                console.log(
                    "SAVE RESULT:",
                    success
                );

                if (success) {

                    setIsSaved(true);

                    await restoreUser();

                    console.log(
                        "WC saved"
                    );
                }
            }

        } catch (error) {

            console.log(
                "Save/unsave error:",
                error
            );

        } finally {

            setSaving(false);
        }
    };


    /*
     * ---------------------------------------------------------
     * SHARE
     * ---------------------------------------------------------
     */

    const handleShare = async () => {

        try {

            const coordinates =
                toilet?.location?.coordinates;

            if (
                !coordinates ||
                coordinates.length !== 2 ||
                coordinates[0] == null ||
                coordinates[1] == null
            ) {
                return;
            }


            const [
                longitude,
                latitude
            ] = coordinates;


            const message = [
                `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
            ]
                .filter(Boolean)
                .join("\n");


            await RNShare.share({
                title: toilet.name,
                message,
            });

        } catch (error) {

            console.log(
                "Share error:",
                error
            );
        }
    };


    /*
     * ---------------------------------------------------------
     * AMENITIES DATA
     * ---------------------------------------------------------
     */

    const amenities = amenitiesIcon();

    const visibleAmenities =
        amenities.slice(0, 3);

    const hasMoreAmenities =
        amenities.length > 3;


    /*
     * ---------------------------------------------------------
     * RENDER
     * ---------------------------------------------------------
     */

    return (

        <BottomSheetModal

            onPresent={() => {
                onPresent?.();
            }}

            containerStyle={{
                borderRadius: 48,
                marginBottom: 12,
                marginHorizontal: 12,
                overflow: "hidden",
            }}

            onDismiss={() => {

                setShowAllAmenities(false);
                setIsAtAmenitiesHeight(false);
                setIscommenting(false);
                setIscommentsOpen(false);
                setSheetIndex(0);

                lastStableIndexRef.current = 0;

                programmaticAmenitiesHeightRef.current =
                    false;

                amenitiesAnimation.setValue(0);
            }}

            ref={ref}

            snapPoints={snapPoints}

            enableDynamicSizing={false}

            onChange={handleSheetChanges}

            backdropComponent={renderBackdrop}

            backgroundComponent={(props) => (
                <GlassBackground
                    {...props}
                    theme={theme}
                />
            )}

            handleStyle={{
                backgroundColor: "transparent",
            }}

            handleIndicatorStyle={{
                backgroundColor:
                    "rgba(255,255,255,0.6)",
                width: 50,
                height: 5,
            }}
        >

            {iscommenting || iscommentsOpen ? (

                <View style={{
                    paddingHorizontal: 15,
                    height: '100%'
                }} >
                    <RateAndCommentSheet theme={theme} toilet={toilet} iscommenting={iscommenting} iscommentsOpen={iscommentsOpen} setIscommenting={setIscommenting} setIscommentsOpen={setIscommentsOpen} />
                </View>

            ) : (

                toilet && (

                    <View
                        style={{
                            flex: 1,
                            backgroundColor: "transparent",
                        }}
                    >

                        <View
                            style={{
                                marginHorizontal: 24,
                                marginBottom: 15,
                                marginTop: 10,
                                gap: 4,
                            }}
                        >

                            <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                variant="headlineLarge"
                                style={{
                                    color:
                                        theme.colors.text +
                                        "99",
                                }}
                            >
                                {toilet.name}
                            </Text>


                            <View
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    gap: 10,
                                    marginRight: 35,
                                }}
                            >

                                <MapPin
                                    size={18}
                                    color={
                                        theme.colors.text +
                                        "70"
                                    }
                                    strokeWidth={2}
                                />

                                <Text
                                    numberOfLines={1}
                                    style={{
                                        color:
                                            theme.colors.text +
                                            "90",
                                    }}
                                >
                                    {toilet.address}
                                </Text>

                            </View>


                            <View
                                style={{
                                    width: "100%",
                                    paddingVertical: 5,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 15,
                                    marginTop: 8,
                                    justifyContent: "center",
                                }}
                            >

                                <Road
                                    size={18}
                                    color={
                                        theme.colors.secondaryLight +
                                        "90"
                                    }
                                    strokeWidth={2}
                                />

                                {formattedDistance && (

                                    <Text
                                        style={{
                                            color:
                                                theme.colors.secondaryDark +
                                                "99",
                                            marginRight: 30,
                                        }}
                                        variant="bodySmall"
                                    >
                                        {formattedDistance}
                                    </Text>

                                )}


                                <Timer
                                    size={18}
                                    color={
                                        theme.colors.secondaryLight +
                                        "90"
                                    }
                                    strokeWidth={2}
                                />


                                <Text
                                    style={{
                                        color:
                                            theme.colors.secondaryDark +
                                            "99",
                                    }}
                                    variant="bodySmall"
                                >
                                    {formatDuration()}
                                </Text>

                            </View>


                            {/* RATING */}

                            <View
                                style={{
                                    height: 44,
                                    width: "100%",
                                    flexDirection: "row",
                                    gap: 10,
                                    borderRadius: 14,
                                    borderWidth: 0.5,
                                    backgroundColor:
                                        theme.colors.surface +
                                        "35",
                                    borderColor:
                                        theme.colors.secondaryLight +
                                        "50",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >

                                <Star
                                    size={18}
                                    color={
                                        theme.colors.secondaryLight
                                    }
                                    strokeWidth={2}
                                />

                                <Text
                                    style={{
                                        color:
                                            theme.colors.text,
                                        fontWeight: 800,
                                    }}
                                    variant="bodySmall"
                                >
                                    {toilet.ratingSummary.average.toFixed(1)}
                                </Text>


                                <Text
                                    style={{
                                        color:
                                            theme.colors.text +
                                            "99",
                                    }}
                                    variant="bodySmall"
                                >
                                    (
                                    {toilet.ratingSummary.count}
                                    {" "}
                                    vote
                                    )
                                </Text>

                            </View>


                            {/* BUTTONS */}

                            <View
                                style={{
                                    flexDirection: "row",
                                    gap: 7,
                                    width: "100%",
                                }}
                            >

                                <ButtonComponent
                                    onPress={() => {

                                        ref.current?.dismiss();

                                        setNavigationTarget(
                                            toilet
                                        );
                                    }}
                                    backgroundColor={
                                        theme.colors.nav +
                                        "15"
                                    }
                                    borderColor={
                                        theme.colors.secondaryLighter +
                                        "80"
                                    }
                                    style={{
                                        flex: 1,
                                        marginTop: 10,
                                    }}
                                >

                                    <View
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexDirection: "row",
                                            gap: 15,
                                        }}
                                    >

                                        <Route
                                            size={15}
                                            color={
                                                theme.colors.nav
                                            }
                                            strokeWidth={2}
                                        />

                                        <Text
                                            style={{
                                                color:
                                                    theme.colors.nav +
                                                    "99",
                                            }}
                                        >
                                            Show route
                                        </Text>

                                    </View>

                                </ButtonComponent>


                                <ButtonComponent
                                    onPress={handleShare}
                                    backgroundColor={
                                        theme.colors.secondaryLight +
                                        "14"
                                    }
                                    borderColor={
                                        theme.colors.secondaryLighter +
                                        "80"
                                    }
                                    style={{
                                        flex: 0.35,
                                        marginTop: 10,
                                    }}
                                >

                                    <View
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >

                                        <Share2
                                            size={18}
                                            color={
                                                theme.colors.secondaryLight
                                            }
                                            strokeWidth={2}
                                        />

                                    </View>

                                </ButtonComponent>


                                <ButtonComponent
                                    onPress={handleSave}
                                    backgroundColor={
                                        theme.colors.secondary +
                                        "15"
                                    }
                                    borderColor={
                                        theme.colors.secondaryLighter +
                                        "80"
                                    }
                                    style={{
                                        flex: 0.35,
                                        marginTop: 10,
                                    }}
                                >

                                    <View
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >

                                        {isSaved ? (

                                            <SaveCheck
                                                size={18}
                                                color={
                                                    theme.colors.secondaryLight
                                                }
                                                strokeWidth={2}
                                            />

                                        ) : (

                                            <Save
                                                size={18}
                                                color={
                                                    theme.colors.secondaryLight
                                                }
                                                strokeWidth={2}
                                            />

                                        )}

                                    </View>

                                </ButtonComponent>

                            </View>

                        </View>


                        {/* ==============================
                            SCROLLABLE CONTENT
                        ============================== */}

                        <BottomSheetScrollView
                            contentContainerStyle={{
                                paddingHorizontal: 24,
                                paddingBottom: 40,
                            }}
                            showsVerticalScrollIndicator={false}
                        >

                            {/* ==============================
                                FIRST AMENITIES ROW
                            ============================== */}

                            <View
                                style={{
                                    width: "100%",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-around",
                                }}
                            >

                                {visibleAmenities.map(
                                    ({
                                        key,
                                        name,
                                        Icon
                                    }) => (

                                        <BlurView
                                            key={key}
                                            intensity={15}
                                            tint="light"
                                            style={{
                                                borderRadius: 14,
                                                overflow: "hidden",
                                                width: "23%",
                                                gap: 5,
                                            }}
                                        >

                                            <View
                                                style={{
                                                    height: 45,
                                                    borderRadius: 14,
                                                    borderWidth: 0.5,
                                                    borderColor:
                                                        theme.colors.secondaryLight +
                                                        "50",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    backgroundColor:
                                                        theme.colors.surface +
                                                        "35",
                                                }}
                                            >

                                                <Icon
                                                    size={18}
                                                    color={
                                                        theme.colors.secondaryLight
                                                    }
                                                    strokeWidth={1.8}
                                                />

                                            </View>


                                            <Text
                                                variant="bodySmall"
                                                style={{
                                                    alignSelf: "center",
                                                    fontSize: 10,
                                                }}
                                                numberOfLines={1}
                                            >
                                                {t(name)}
                                            </Text>

                                        </BlurView>

                                    )
                                )}


                                {/* MORE / LESS */}

                                {hasMoreAmenities && (

                                    <Pressable
                                        onPress={
                                            showAllAmenities
                                                ? handleLess
                                                : handleMore
                                        }
                                        style={{
                                            width: "23%",
                                            gap: 5,
                                        }}
                                    >

                                        <View
                                            style={{
                                                height: 45,
                                                borderRadius: 14,
                                                borderWidth: 0.5,
                                                borderColor:
                                                    theme.colors.secondaryLight +
                                                    "50",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                backgroundColor:
                                                    theme.colors.surface +
                                                    "35",
                                            }}
                                        >

                                            <Ellipsis
                                                size={18}
                                                color={
                                                    theme.colors.secondaryLight
                                                }
                                                strokeWidth={1.8}
                                            />

                                        </View>


                                        <Text
                                            variant="bodySmall"
                                            style={{
                                                alignSelf: "center",
                                                fontSize: 10,
                                            }}
                                        >
                                            {showAllAmenities
                                                ? t("less")
                                                : t("more")}
                                        </Text>

                                    </Pressable>

                                )}

                            </View>


                            {/* ==============================
                                EXTRA AMENITIES
                            ============================== */}

                            {hasMoreAmenities && (

                                <Animated.View
                                    style={
                                        extraAmenitiesAnimatedStyle
                                    }
                                >

                                    <View
                                        style={{
                                            width: "100%",
                                            flexDirection: "row",
                                            justifyContent: "flex-start",
                                            gap: 10,
                                            marginTop: 7,
                                        }}
                                    >

                                        {amenities
                                            .slice(3)
                                            .map(
                                                ({
                                                    key,
                                                    name,
                                                    Icon
                                                }) => (

                                                    <BlurView
                                                        key={key}
                                                        intensity={15}
                                                        tint="light"
                                                        style={{
                                                            borderRadius: 14,
                                                            overflow: "hidden",
                                                            width: "23%",
                                                            gap: 5,
                                                        }}
                                                    >

                                                        <View
                                                            style={{
                                                                height: 45,
                                                                borderRadius: 14,
                                                                borderWidth: 0.5,
                                                                borderColor:
                                                                    theme.colors.secondaryLight +
                                                                    "50",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                backgroundColor:
                                                                    theme.colors.surface +
                                                                    "35",
                                                            }}
                                                        >

                                                            <Icon
                                                                size={18}
                                                                color={
                                                                    theme.colors.secondaryLight
                                                                }
                                                                strokeWidth={1.8}
                                                            />

                                                        </View>


                                                        <Text
                                                            variant="bodySmall"
                                                            style={{
                                                                alignSelf: "center",
                                                                fontSize: 10,
                                                            }}
                                                            numberOfLines={1}
                                                        >
                                                            {t(name)}
                                                        </Text>

                                                    </BlurView>

                                                )
                                            )}

                                    </View>

                                </Animated.View>

                            )}

                            {user ? (
                                <>
                                    <View
                                        theme={theme}
                                        style={{
                                            width: "100%",
                                            alignItems: "flex-start",
                                            marginBottom: 8,
                                        }}
                                    >
                                        <CommentSection
                                            theme={theme}
                                            iscommenting={iscommenting}
                                            setIscommenting={setIscommenting}
                                            iscommentsOpen={iscommentsOpen}
                                            setIscommentsOpen={setIscommentsOpen}
                                            />
                                            
                                        <ButtonComponent
                                            onPress={() => {
                                                setIscommenting(true);
                                            }}
                                            backgroundColor={theme.colors.secondary + '30'}
                                            borderColor={theme.colors.secondaryLighter + '80'}
                                            style={{
                                                width: '100%',
                                                marginTop: 15
                                            }}
                                        >
                                            <Text style={{ color: theme.colors.surface, }}>
                                                rate and write a review
                                            </Text>
                                        </ButtonComponent>

                                    </View>

                                    <View>
                                        <PhotoGallery />
                                    </View>
                                </>

                            ) : (
                                <View style={{
                                    height: '150%',
                                    width: '100%',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <Text style={{ color: theme.colors.secondaryDark }}>
                                        sign in to see photos and reviews
                                    </Text>
                                    <ButtonComponent
                                        onPress={() => {
                                            router.push('/SignIn');
                                        }}
                                        backgroundColor={theme.colors.secondary + '30'}
                                        borderColor={theme.colors.secondaryLighter + '80'}
                                        style={{
                                            width: '100%',
                                            marginTop: 15
                                        }}
                                    >
                                        <Text style={{ color: theme.colors.surface, }}>
                                            Sign In
                                        </Text>
                                    </ButtonComponent>

                                    <ButtonComponent
                                        onPress={() => {
                                            router.push('/SignUp');
                                        }}
                                        backgroundColor={theme.colors.secondary + '30'}
                                        borderColor={theme.colors.secondaryLighter + '80'}
                                        style={{
                                            width: '100%',
                                            marginTop: 15
                                        }}
                                    >
                                        <Text style={{ color: theme.colors.surface, }}>
                                            Sign Up
                                        </Text>
                                    </ButtonComponent>
                                </View>
                            )}

                        </BottomSheetScrollView>

                    </View>

                )

            )}

        </BottomSheetModal >
    );
});


export default ToiletInfo;