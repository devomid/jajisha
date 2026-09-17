import { View, Pressable, } from "react-native";
import { router } from "expo-router";
import { TextInput, List, Text } from "react-native-paper";
import { useState, useMemo, useEffect } from "react";
import { Checkbox } from 'expo-checkbox';
import { ChevronDown, ChevronUp, Toilet, MapPin, DollarSign, ShowerHead, Star } from "lucide-react-native";
import Rating from "../rating/starRating";
import { useTranslation } from "react-i18next";
import { TextInput as RNTextInput } from "react-native";
import { useWcDataStore } from "../../store/wcDataStore";
import ButtonComponent from "../Button/Button";
import PhotoGallery from '../photoGallery/photoGallery';
import FormInput from "../inpuField/formInput";


export default function NewToilet({ theme, }) {

    const isPickingLocation =
        useWcDataStore(state => state.isPickingLocation);

    const wcData = useWcDataStore((state) => state.wcData);
    const setWcData = useWcDataStore((state) => state.setWcData);

    const startPickingLocation =
        useWcDataStore(state => state.startPickingLocation);
    // console.log("Picking:", isPickingLocation);

    const handleChooseOnMap = () => {
        // console.log("Pressed");
        startPickingLocation();
    };

    // console.log('test');

    const { t } = useTranslation();

    const [expandedAmenities, setExpandedAmenities] = useState(false);
    const [expandedRatings, setExpandedRatings] = useState(false);


    const handlePressAmenities = () => setExpandedAmenities(!expandedAmenities);
    const handlePressRatings = () => setExpandedRatings(!expandedRatings);

    const amenities = useMemo(() => [
        { key: "western", label: t("newToilet.western") },
        { key: "iranian", label: t("newToilet.iranian") },
        { key: "wheelchairAccessible", label: t("newToilet.wheelchairAccess") },
        { key: "babyChanging", label: t("newToilet.babyChange") },
        { key: "handDryer", label: t("newToilet.handDryer") },
        { key: "warmWater", label: t("newToilet.warmWater") },
        { key: "soap", label: t("newToilet.soap") },
        { key: "toiletPaper", label: t("newToilet.toiletPaper") },
    ], [t]);

    const ratings = [
        {}
    ]
    // const [rating, setRating] = useState(0);

    const updateAmenity = (key, value) => {
        setWcData(prev => ({
            ...prev,
            amenities: {
                ...prev.amenities,
                [key]: value,
            },
        }));
    };

    // useEffect(() => {
    //     console.log("Mounted");

    //     return () => {
    //         console.log("Unmounted");
    //     };
    // }, []);


    return (
        <View
            style={{
                width: '100%',
                paddingHorizontal: 5,
                paddingBottom: 80,
            }}
        >
            <Text
                variant="titleMedium"
                style={{
                    alignSelf: 'center',
                    color: theme.colors.secondaryDarker + '90',
                    marginBottom: 14
                }}>
                Add a new toilet
            </Text>

            <FormInput
                label={t("newToilet.toiletName")}
                icon={Toilet}
                value={wcData.name}
                onChangeText={(text) =>
                    setWcData((prev) => ({
                        ...prev,
                        name: text,
                    }))
                }
                theme={theme}
            />

            <ButtonComponent
                onPress={handleChooseOnMap}
                backgroundColor={theme.colors.nav + '13'}
                borderColor={theme.colors.secondaryLight + '80'}
                style={{
                    width: '100%',
                    marginTop: 9,
                    marginBottom: 9,
                }}
            >
                <Text style={{ color: theme.colors.nav + '99' }}>
                    {t("newToilet.chooseOnMap")}
                </Text>
            </ButtonComponent>

            <FormInput
                label={t("newToilet.address")}
                icon={MapPin}
                value={wcData.address}
                onChangeText={(text) =>
                    setWcData((prev) => ({
                        ...prev,
                        address: text,
                    }))
                }
                theme={theme}
            />

            <View
                style={{
                    marginTop: 3,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <View
                    style={{
                        width: "30%",
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <Checkbox
                        style={{
                            margin: 10,
                            width: 17,
                            height: 17,
                        }}
                        value={wcData.isFree}
                        onValueChange={(value) =>
                            setWcData((prev) => ({
                                ...prev,
                                isFree: value,
                            }))
                        }
                        color={
                            wcData.isFree
                                ? theme.colors.primary
                                : theme.colors.secondaryLight
                        }
                    />

                    <Text>
                        {t("newToilet.free")}
                    </Text>
                </View>

                <FormInput
                    label={t("newToilet.price")}
                    icon={DollarSign}
                    value={wcData.price}
                    onChangeText={(text) =>
                        setWcData((prev) => ({
                            ...prev,
                            price: text.replace(/\D/g, ""),
                        }))
                    }
                    theme={theme}
                    keyboardType="numeric"
                    editable={!wcData.isFree}
                    disabled={wcData.isFree}
                    style={{
                        width: "55%",
                        marginTop: 8
                    }}
                />
            </View>

            <View style={{ marginTop: 15 }}>
                <List.Accordion
                    title={t("newToilet.amenities")}
                    expanded={expandedAmenities}
                    onPress={handlePressAmenities}
                    style={{
                        height: 44,
                        backgroundColor: theme.colors.primaryLighter + "25",
                        borderWidth: 0.5,
                        borderColor: theme.colors.surface + '99',
                        borderRadius: 14,
                        paddingHorizontal: 10,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 20,
                        },
                        shadowOpacity: 0.7,
                        shadowRadius: 15,
                        elevation: 10,
                        marginBottom: 5,
                    }}
                    theme={{
                        colors: {
                            background: 'transparent',
                            surface: 'transparent',
                        },
                    }}
                    titleStyle={{ color: theme.colors.secondary + '99', transform: [{ translateY: -8 }], fontSize: 14 }}
                    left={() => (<ShowerHead
                        size={18}
                        color={theme.colors.secondary + '95'}
                    />)} // remove default arrow
                    right={() =>
                        expandedAmenities ? (
                            <ChevronUp size={20} color={theme.colors.secondary} style={{ transform: [{ translateY: -4 }] }} />
                        ) : (
                            <ChevronDown size={20} color={theme.colors.secondary} style={{ transform: [{ translateY: -4 }] }} />
                        )
                    }
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                        }}
                    >
                        {amenities.map((item) => (
                            <View
                                key={item.label}
                                style={{
                                    width: '50%',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginBottom: 13,

                                }}
                            >
                                <Checkbox
                                    value={wcData.amenities[item.key]}
                                    onValueChange={(value) => updateAmenity(item.key, value)}
                                    color={
                                        wcData.amenities[item.key]
                                            ? theme.colors.primaryDark
                                            : theme.colors.secondaryLight + '99'
                                    }
                                    style={{
                                        width: 17,
                                        height: 17
                                    }}
                                />
                                <Text variant="bodySmall" style={{
                                    marginLeft: 12,
                                    marginRight: 15,
                                    color: theme.colors.text
                                }}>{item.label}</Text>
                            </View>
                        ))}
                    </View>
                </List.Accordion>
            </View>

            <View style={{
                width: '100%',
            }}>
                <List.Accordion
                    title={t("newToilet.rating")}
                    expanded={expandedRatings}
                    onPress={handlePressRatings}
                    style={{
                        height: 44,
                        backgroundColor: theme.colors.primaryLighter + "25",
                        borderWidth: 0.5,
                        borderColor: theme.colors.surface + '99',
                        borderRadius: 14,
                        paddingHorizontal: 10,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 20,
                        },
                        shadowOpacity: 0.7,
                        shadowRadius: 15,
                        elevation: 10,
                        marginBottom: 5,
                    }}
                    theme={{
                        colors: {
                            background: 'transparent',
                            surface: 'transparent',
                        },
                    }}
                    titleStyle={{ color: theme.colors.secondary + '99', transform: [{ translateY: -8 }], fontSize: 14 }}
                    left={() => (<Star
                        size={18}
                        color={theme.colors.secondary + '95'}
                    />)} // remove default arrow
                    right={() =>
                        expandedRatings ? (
                            <ChevronUp size={20} color={theme.colors.secondary} style={{ transform: [{ translateY: -4 }] }} />
                        ) : (
                            <ChevronDown size={20} color={theme.colors.secondary} style={{ transform: [{ translateY: -4 }] }} />
                        )
                    }
                >
                    <Rating
                        myTheme={theme.colors}
                        setWcData={setWcData}
                        ratings={wcData.ratings}
                    />

                </List.Accordion>
            </View>

            <PhotoGallery />

        </View>
    );
}

