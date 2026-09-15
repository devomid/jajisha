import { useEffect, useState } from "react";
import { View, Image, ScrollView, Pressable, Modal, Dimensions, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useWcDataStore } from "../../store/wcDataStore";
import StarRating from "react-native-star-rating-widget";
import ButtonComponent from "../Button/Button";
import { MessageCircle } from "lucide-react-native";

export default function CommentSection({theme}) {
    const { t } = useTranslation();
    const toilet = useWcDataStore((state) => state.selectedToilet);
    const comments = toilet.reviews;
useEffect(() => {
 console.log(toilet);
}, [])


    return (
        <>
            {comments?.length > 0 ? (
                    <View>
                        {comments.map((item, key) => (
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{
                                    gap: 12,
                                    paddingVertical: 10,
                                    width: '100%'
                                }}
                            >
                                <View
                                    style={{
                                        width: '80%',
                                        height: 200,
                                        marginTop: 24,
                                        padding: 15,
                                        borderWidth: 0.7,
                                        borderColor: theme.colors.secondary,
                                        borderRadius: 20
                                    }}
                                >
                                    <Text key={key}>
                                        {item}
                                    </Text>
                                </View>
                            </ScrollView>
                        ))}
                    </View>
                ) : (
                    <View
                        style={{
                            width: '100%',
                            height: 200,
                            marginTop: 20,
                            padding: 15,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Text>No Review yet.</Text>
                        <ButtonComponent
                            onPress={() => {console.log('write a review');}}
                            backgroundColor={theme.colors.secondaryLight +"15"}
                            borderColor={theme.colors.secondaryLighter +"80"}
                            style={{
                                width: "100%",
                                marginTop: 10
                            }}>

                            <View
                                    style={{
                                    padding:10,
                                    width: "100%",
                                    height: "100%",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexDirection: "row",
                                    gap: 15
                                }}>

                                <MessageCircle
                                    size={15}
                                    color={theme.colors.secondary}
                                    strokeWidth={2}
                                />

                                <Text
                                    style={{color:theme.colors.secondaryDark +"99"}}
                                >
                                    Be the first one to write a review.
                                </Text>
                            </View>

                        </ButtonComponent>
                    </View>
                )
            }
        </>
    )
}
