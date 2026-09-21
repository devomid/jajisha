import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ChevronDown, ChevronUp, Star } from "lucide-react-native";
import { List } from "react-native-paper";
import { View, TextInput } from "react-native";
import Rating from "../rating/starRating";

import { useWcDataStore } from "../../store/wcDataStore";


export default function WriteCommandAndRate({ theme }) {

    const { t } = useTranslation();

    const [expandedRatings, setExpandedRatings] = useState(false);
    const wcData = useWcDataStore((state) => state.wcData);
    const setWcData = useWcDataStore((state) => state.setWcData);

    const handlePressRatings = () => setExpandedRatings(!expandedRatings);


    return (
        <View style={{
            flexDirection: 'column',
            flex: 1,
            marginTop: 24,
        }}>

            <TextInput
                editable
                multiline
                numberOfLines={8}
                maxLength={200}
                placeholder={t("components.writeCommentAndRate.reviewInputText")}
                placeholderTextColor={theme.colors.text + "80"}
                onChangeText={(text) =>
                    setWcData((prev) => ({
                        ...prev,
                        review: text,
                    }))
                }
                style={{
                    minHeight: 150,
                    width: "100%",
                    borderWidth: 1,
                    borderColor: theme.colors.secondaryLight + "80",
                    borderRadius: 14,
                    padding: 12,
                    color: theme.colors.text,
                    textAlignVertical: "top",
                    backgroundColor: theme.colors.secondaryLighter + "20",
                    marginBottom: 14
                }}
            />

            <View style={{
                width: '100%',
            }}>
                <List.Accordion
                    title={t("components.writeCommentAndRate.rating")}
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
        </View>

    )
}