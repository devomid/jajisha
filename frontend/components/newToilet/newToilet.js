import { View, Pressable, Text } from "react-native";
import { router } from "expo-router";
import { TextInput, List } from "react-native-paper";
import { useState } from "react";
import { Checkbox } from 'expo-checkbox';
import { ChevronDown, ChevronUp } from "lucide-react-native";
import Rating from "./starRating";
import { useTranslation } from "react-i18next";



export default function NewToilet({ theme }) {
    const { t } = useTranslation();
    const [text, setText] = useState('');
    const [isChecked, setChecked] = useState(true);
    const [expanded, setExpanded] = useState(true);

    const handlePress = () => setExpanded(!expanded);

    const amenities = [
        { label: t("newToilet.western") },
        { label: t("newToilet.iranian"), },
        { label: t("newToilet.wheelchairAccess"), },
        { label: t("newToilet.babyChange"), },
        { label: t('newToilet.handDryer'), },
        { label: t('newToilet.warmWater'), },
        // { label: 'Baby Changing', value: baby, setValue: setBaby },
    ];

    const ratings = [
        {}
    ]
    const [rating, setRating] = useState(0);


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
                    value={text}
                    onChangeText={(text) => setText(text)}
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
                <Pressable style={({ pressed }) => ({
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

            <View style={{ marginTop: 20, gap: 20 }}>
                <Text>
                    {t("newToilet.location")}:
                </Text>
                <Text>
                    {t("newToilet.address")}:
                </Text>
            </View>

            <View style={{ marginTop: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ width: '30%', flexDirection: 'row', alignItems: 'center', }}>
                    <Checkbox
                        style={{ margin: 10 }}
                        value={isChecked}
                        onValueChange={setChecked}
                        color={isChecked ? theme.colors.primary : theme.colors.secondaryLight}
                    />
                    <Text >
                        {t("newToilet.free")}
                    </Text>
                </View>

                <View style={{ width: '55%' }}>
                    <TextInput
                        label={t("newToilet.price")}
                        multiline
                        editable={!isChecked}
                        disabled={isChecked}
                        value={text}
                        onChangeText={(text) => setText(text)}
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
                    expanded={expanded}
                    onPress={handlePress}
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
                        expanded ? (
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
                                    value={item.value}
                                    onValueChange={item.setValue}
                                    color={isChecked ? theme.colors.primary : theme.colors.secondaryLight}

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
                    expanded={expanded}
                    onPress={handlePress}
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
                        expanded ? (
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
                        <Rating theme={theme} />
                    </View>
                </List.Accordion>
            </View>

            <View style={{ marginTop: 30, }}>
                <TextInput
                    label={t("newToilet.description")}
                    multiline
                    value={text}
                    onChangeText={(text) => setText(text)}
                    mode="flat"
                    textColor={theme.colors.text}
                    selectionColor={theme.colors.primaryDarker}
                    underlineColor={theme.colors.secondaryLight}
                    activeUnderlineColor={theme.colors.secondary}
                    style={{ backgroundColor: 'transparent' }}
                />
            </View>

        </View>
    );
}


