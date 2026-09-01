import { View, Pressable, Text } from "react-native";
import { router } from "expo-router";
import { TextInput, List } from "react-native-paper";
import { useState, useMemo, useEffect } from "react";
import { Checkbox } from 'expo-checkbox';
import { ChevronDown, ChevronUp } from "lucide-react-native";
import Rating from "./starRating";
import { useTranslation } from "react-i18next";
import { TextInput as RNTextInput } from "react-native";
import { useWcDataStore } from "../../store/wcDataStore";
import ButtonComponent from "../Button/Button";
import PhotoGallery from '../photoGallery/photoGallery';


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
            <View >
                <TextInput
                    label={t("newToilet.toiletName")}
                    value={wcData.name}
                    mode="outlined"
                    outlineColor={theme.colors.secondaryLight + '80'}
                    activeOutlineColor={theme.colors.secondary + '80'}
                    textColor={theme.colors.text}
                    selectionColor={theme.colors.primaryDarker}
                    outlineStyle={{ borderRadius: 14, }}
                    theme={{
                        colors: {
                            onSurfaceVariant: theme.colors.secondary + '70',
                            primary: theme.colors.white,
                        },
                    }}
                    onChangeText={(text) =>
                        setWcData(prev => ({
                            ...prev,
                            name: text,
                        }))
                    }
                    style={{
                        backgroundColor: theme.colors.secondaryLight + "30",
                        height: 44,
                    }}
                />
            </View>
            <ButtonComponent
                onPress={handleChooseOnMap}
                backgroundColor={theme.colors.secondary + '30'}
                borderColor={theme.colors.secondaryLighter + '80'}
                style={{
                    width: '100%',
                    marginTop: 25,
                }}
            >
                <Text style={{ color: theme.colors.primaryLighter }}>
                    {t("newToilet.chooseOnMap")}
                </Text>
            </ButtonComponent>

            <View style={{ marginTop: 25, }}>
                <View style={{ width: '100%', }}>
                    <TextInput
                        label={t("newToilet.address")}
                        value={wcData.address}
                        mode="outlined"
                        textColor={theme.colors.secondary}
                        outlineColor={theme.colors.secondaryLight + '80'}
                        activeOutlineColor={theme.colors.secondary + '80'}
                        selectionColor={theme.colors.primaryDarker}
                        outlineStyle={{ borderRadius: 14, }}
                        theme={{
                            colors: {
                                onSurfaceVariant: theme.colors.secondary + '70',
                                primary: theme.colors.white,
                            },
                        }}
                        onChangeText={(text) =>
                            setWcData(prev => ({
                                ...prev,
                                address: text,
                            }))
                        }
                        style={{
                            backgroundColor: theme.colors.secondaryLight + "30",
                            height: 44
                        }} />
                </View>
            </View>

            <View style={{ marginTop: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ width: '30%', flexDirection: 'row', alignItems: 'center', }}>
                    <Checkbox
                        style={{ margin: 10 }}
                        value={wcData.isFree}
                        onValueChange={(value) =>
                            setWcData(prev => ({
                                ...prev,
                                isFree: value,
                            }))
                        }
                        color={
                            wcData.isFree
                                ? theme.colors.primary
                                : theme.colors.secondaryLight
                        } />
                    <Text >
                        {t("newToilet.free")}
                    </Text>
                </View>

                <View style={{ width: '55%' }}>
                    <TextInput
                        label={t("newToilet.price")}
                        keyboardType="numeric"
                        editable={!wcData.isFree}
                        disabled={wcData.isFree}
                        value={wcData.price}
                        mode="outlined"
                        textColor={theme.colors.secondary}
                        outlineColor={theme.colors.secondaryLight + '80'}
                        activeOutlineColor={theme.colors.secondaryDarker}
                        selectionColor={theme.colors.primaryDarker}
                        outlineStyle={{ borderRadius: 14, }}
                        theme={{
                            colors: {
                                onSurfaceVariant: theme.colors.secondary + '70',
                                primary: theme.colors.white,
                            },
                        }}
                        onChangeText={(text) =>
                            setWcData(prev => ({
                                ...prev,
                                price: text.replace(/\D/g, ""), // keep only 0-9
                            }))
                        }
                        style={{
                            backgroundColor: theme.colors.secondaryLight + "30",
                            height: 44
                        }} />
                </View>
            </View>

            <View style={{ marginTop: 30 }}>
                <List.Accordion
                    title={t("newToilet.amenities")}
                    expanded={expandedAmenities}
                    onPress={handlePressAmenities}
                    style={{
                        height:44,
                        backgroundColor: theme.colors.secondaryLight + "30",
                        borderWidth: 0.5,
                        borderColor: theme.colors.secondary + 90,
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
                        marginBottom: 20,
                    }}
                    theme={{
                        colors: {
                            background: 'transparent',
                            surface: 'transparent',
                        },
                    }}
                    titleStyle={{ color: theme.colors.secondary, transform: [{ translateY: -3 }] }}
                    right={() => null} // remove default arrow
                    left={() =>
                        expandedAmenities ? (
                            <ChevronUp size={20} color={theme.colors.secondary} />
                        ) : (
                                <ChevronDown size={20} color={theme.colors.secondary} />
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
                                            ? theme.colors.primary
                                            : theme.colors.secondaryLight
                                    }
                                />
                                <Text style={{ marginLeft: 12, marginRight: 15 }}>{item.label}</Text>
                            </View>
                        ))}
                    </View>
                </List.Accordion>
            </View>

            <View>
                <List.Accordion
                    title={t("newToilet.rating")}
                    expanded={expandedRatings}
                    onPress={handlePressRatings}
                    style={{
                        height: 44,
                        backgroundColor: theme.colors.secondaryLight + "30",
                        borderWidth: 0.5,
                        borderColor: theme.colors.secondary + 90,
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
                        marginBottom: 20
                    }}
                    theme={{
                        colors: {
                            background: 'transparent',
                            surface: 'transparent',
                        },
                    }}
                    titleStyle={{ color: theme.colors.secondary, transform: [{ translateY: -3 }] }}
                    right={() => null} // remove default arrow
                    left={() =>
                        expandedRatings ? (
                            <ChevronUp size={20} color={theme.colors.secondary} />
                        ) : (
                            <ChevronDown size={20} color={theme.colors.secondary} />
                        )
                    }
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                        }}
                    >
                        <Rating
                            theme={theme}
                            setWcData={setWcData}
                            ratings={wcData.ratings}
                        />
                    </View>
                </List.Accordion>
            </View>

            <ButtonComponent
                // onPress={handleChooseOnMap}
                backgroundColor={theme.colors.secondary + '40'}
                borderColor={theme.colors.secondaryLighter + '80'}
                style={{
                    width: '100%',
                    marginTop: 15,
                }}
            >
                <Text style={{ color: theme.colors.primaryLighter }}>
                    Add photo
                </Text>
            </ButtonComponent>

            <PhotoGallery/>

        </View>
    );
}

