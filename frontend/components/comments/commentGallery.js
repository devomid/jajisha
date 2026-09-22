import { useTranslation } from "react-i18next";

import { Ellipsis, } from "lucide-react-native";
import { View, ScrollView, Text } from "react-native";

import { useWcDataStore } from "../../store/wcDataStore";

import ButtonComponent from "../Button/Button";
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
                        {visibleComments?.map((item) => (
                            <CommentCardComponent
                                key={item._id}
                                theme={theme}
                                review={item}
                            />
                        ))}

                        {hasMoreComments && (
                            <View
                                key="more-comments"
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
                                    {t("components.commentGallery.moreReviewsBtn")}
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
                    <Text style={{
                        color: theme.colors.secondaryDark
                    }}>
                        {t("components.commentGallery.noReview")}
                    </Text>
                </View>
            )
            }
        </>
    )
}
