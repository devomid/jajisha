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


export default function NewToilet({ theme, }) {

    const isPickingLocation =
        useWcDataStore(state => state.isPickingLocation);

    const wcData = useWcDataStore((state) => state.wcData);
    const setWcData = useWcDataStore((state) => state.setWcData);

    const startPickingLocation =
        useWcDataStore(state => state.startPickingLocation);
    console.log("Picking:", isPickingLocation);

    const handleChooseOnMap = () => {
        console.log("Pressed");
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
            <View style={{ marginTop: 30, }}>
                <TextInput
                    label={t("newToilet.toiletName")}
                    value={wcData.name}
                    onChangeText={(text) =>
                        setWcData(prev => ({
                            ...prev,
                            name: text,
                        }))
                    }
                    mode="flat"
                    textColor={theme.colors.text}
                    selectionColor={theme.colors.primaryDarker}
                    underlineColor={theme.colors.secondaryLight}
                    activeUnderlineColor={theme.colors.secondary}
                    style={{ backgroundColor: 'transparent' }}
                />
            </View>

            <View style={{
                marginTop: 50,
                width: '100%',

            }}>
                <Pressable
                    onPress={handleChooseOnMap}
                    style={({ pressed }) => ({
                        width: '100%',
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 20,
                        },
                        shadowOpacity: 0.7,
                        shadowRadius: 15,
                        elevation: 10,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: 30,
                        borderRadius: 34,
                        borderWidth: 1,
                        borderColor: theme.colors.secondary + 40,
                        backgroundColor: pressed ? theme.colors.secondary + 70 : theme.colors.secondary + 50, // darker when pressed
                        transform: [{ scale: pressed ? 0.95 : 1 }], // zoom out
                    })}>
                    <Text style={{ color: theme.colors.surface }}>
                        {t("newToilet.chooseOnMap")}
                    </Text>
                </Pressable>
            </View>

            <View style={{ marginTop: 30, }}>
                <Text>
                    {`${t("newToilet.location")}:  `}
                    {/* {`\n`} */}
                    {wcData.location && (
                        <Text style={{ color: theme.colors.secondary }}>
                            {
                                `${wcData.location.latitude.toFixed(6)},  ${wcData.location.longitude.toFixed(6)}`
                            }
                        </Text>
                    )}
                </Text>
                <View
                    style={{
                        width: '100%',
                        marginLeft: -17
                    }}
                >
                    <TextInput
                        label={t("newToilet.address")}
                        value={wcData.address}
                        onChangeText={(text) =>
                            setWcData(prev => ({
                                ...prev,
                                address: text,
                            }))
                        }
                        mode="flat"
                        textColor={theme.colors.secondary}
                        selectionColor={theme.colors.primaryDarker}
                        underlineColor={theme.colors.secondaryLight}
                        activeUnderlineColor={theme.colors.secondary}
                        style={{ backgroundColor: 'transparent' }}
                    />
                </View>
            </View>

            <View style={{ marginTop: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
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
                        onChangeText={(text) =>
                            setWcData(prev => ({
                                ...prev,
                                price: text.replace(/\D/g, ""), // keep only 0-9
                            }))
                        }
                        mode="flat"
                        textColor={theme.colors.text}
                        selectionColor={theme.colors.primaryDarker}
                        underlineColor={theme.colors.secondaryLight}
                        activeUnderlineColor={theme.colors.secondary}
                        style={{ backgroundColor: 'transparent' }}
                    />
                </View>
            </View>

            <View style={{ marginTop: 30 }}>
                <List.Accordion
                    title={t("newToilet.amenities")}
                    expanded={expandedAmenities}
                    onPress={handlePressAmenities}
                    style={{
                        backgroundColor: 'transparent',
                        borderWidth: 0.5,
                        borderColor: theme.colors.secondary + 90,
                        borderRadius: 18,
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
                    titleStyle={{ color: theme.colors.text }}
                    right={() => null} // remove default arrow
                    left={() =>
                        expandedAmenities ? (
                            <ChevronUp size={20} color={theme.colors.text} />
                        ) : (
                            <ChevronDown size={20} color={theme.colors.text} />
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
                        backgroundColor: 'transparent',
                        borderWidth: 0.5,
                        borderColor: theme.colors.secondary + 90,
                        borderRadius: 18,
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
                    titleStyle={{ color: theme.colors.text }}
                    right={() => null} // remove default arrow
                    left={() =>
                        expandedRatings ? (
                            <ChevronUp size={20} color={theme.colors.text} />
                        ) : (
                            <ChevronDown size={20} color={theme.colors.text} />
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

            <View style={{ marginTop: 30, }}>
                <TextInput
                    label={t("newToilet.description")}
                    value={wcData.description}
                    onChangeText={(text) =>
                        setWcData(prev => ({
                            ...prev,
                            description: text,
                        }))
                    }
                    mode="flat"
                    textColor={theme.colors.text}
                    selectionColor={theme.colors.primaryDarker}
                    underlineColor={theme.colors.secondaryLight}
                    activeUnderlineColor={theme.colors.secondary}
                    style={{
                        backgroundColor: 'transparent'
                    }}
                />
            </View>

        </View>
    );
}

