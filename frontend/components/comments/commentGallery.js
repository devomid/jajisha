import { useEffect, useState } from "react";
import { View, Image, ScrollView, Pressable, Modal, Dimensions, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useWcDataStore } from "../../store/wcDataStore";
import StarRating from "react-native-star-rating-widget";
import ButtonComponent from "../Button/Button";
import { MessageCircle } from "lucide-react-native";
import { Ellipsis, } from "lucide-react-native";
import CommentCardComponent from "../cards/commentCardComponentSmall";


export default function CommentGallery({ theme, iscommenting, setIscommenting, iscommentsOpen, setIscommentsOpen }) {
    const { t } = useTranslation();
    const toilet = useWcDataStore((state) => state.selectedToilet);
    const comments = toilet.reviews;
    const visibleComments = comments?.slice(0, 5) || [];
    const hasMoreComments = comments?.length > 5;


    return (
        <>
            {comments?.length > 0 ? (
                <View style={{ height: 220 }}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            gap: 12,
                            paddingVertical: 10,
                            width: "100%",
                            paddingRight: 40,
                        }}
                    >
                        {visibleComments.map((item) => (
                            <CommentCardComponent
                                key={item._id}
                                theme={theme}
                                review={item}
                            />
                        ))}

                        {hasMoreComments && (
                            <View
                                style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginTop: 10,
                                    flexDirection: "column",
                                }}
                            >
                                <ButtonComponent
                                    onPress={() => {
                                        setIscommentsOpen(true);
                                    }}
                                    backgroundColor={theme.colors.secondary + "15"}
                                    borderColor={theme.colors.secondaryLighter + "80"}
                                    style={{
                                        width: 50,
                                        height: 50,
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
                                        <Ellipsis
                                            size={18}
                                            color={theme.colors.secondaryLight}
                                            strokeWidth={2}
                                        />
                                    </View>
                                </ButtonComponent>

                                <Text
                                    style={{
                                        marginTop: 6,
                                        color: theme.colors.secondaryLight,
                                    }}
                                >
                                    More reviews
                                </Text>
                            </View>
                        )}
                    </ScrollView>
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
                    <Text style={{ color: theme.colors.secondaryDark }}>No Review yet.</Text>
                </View>
            )
            }
        </>
    )
}
