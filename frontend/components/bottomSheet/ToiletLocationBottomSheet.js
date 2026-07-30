import React, { forwardRef, useMemo, useCallback, useState } from "react";
import { Text, useTheme, SegmentedButtons } from "react-native-paper";
import { View, Pressable, Image } from "react-native";
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetScrollView, } from "@gorhom/bottom-sheet";
import GlassBackground from "../../components/blur/blurView";
import { BlurView } from "expo-blur";
import { useTranslation } from "react-i18next";
import { useWcDataStore } from "../../store/wcDataStore";
import { Bookmark, Share, Navigation, Toilet } from "lucide-react-native";
import StarRating from "react-native-star-rating-widget";
import { getDistance } from "geolib";
import PhotoGallery from "../photoGallery/photoGallery";
import MapView, { Marker } from "react-native-maps";
import { DynamicColorIOS } from 'react-native';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import Review from "../reviews/reviews";


const ToiletInfo = forwardRef(({ location }, ref) => {

    const [value, setValue] = useState('');
    const { t } = useTranslation();
    const theme = useTheme();
    const toilet = useWcDataStore((state) => state.selectedToilet);

    const snapPoints = useMemo(() => ["22%", "50%", "80%"], []);

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

    if (!toilet) return null;

    const distance = getDistance(
        {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        },
        {
            latitude: toilet.location.coordinates[1],
            longitude: toilet.location.coordinates[0],
        }
    );

    const formattedDistance =
        distance < 1000
            ? `${distance} m`
            : `${(distance / 1000).toFixed(1)} km`;


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
                        style={{ color: theme.colors.surface, width: 195 }}
                    >
                        {toilet.name}
                    </Text>
                    <View
                        style={{
                            paddingVertical: 5,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 1,
                            marginTop: 8
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
                            emptyColor={theme.colors.secondaryLight}
                            color={theme.colors.secondaryDarker}
                        // StarIconComponent={Toilet}
                        />

                        <Text
                            style={{
                                color: theme.colors.text,
                            }}
                            variant="bodySmall"
                        >
                            {toilet.ratingSummary.count}
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
                        <Navigation color={theme.colors.secondary} />
                        <Bookmark color={theme.colors.secondary} />
                        <Share color={theme.colors.secondary} />
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
                        <Text
                            numberOfLines={2}
                            style={{
                                color: theme.colors.secondaryLight,
                                paddingTop: 7,
                                paddingRight: 24
                            }}
                        >
                            {toilet.address}
                        </Text>

                    </View>

                    <View style={{ marginTop: -20 }}>
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
                            justifyContent:'center'
                        }}
                        >
                        <Review/>
                        <Review/>
                        <Review/>
                    </View>
                </BottomSheetScrollView>
            </View>
        </BottomSheetModal>
    );
});

export default ToiletInfo;