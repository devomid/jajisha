import { useTranslation } from "react-i18next";

import { Text } from "react-native-paper";
import { View } from "react-native";
import { MessageCircle } from "lucide-react-native";
import StarRating from "react-native-star-rating-widget";
import { BottomSheetScrollView, } from "@gorhom/bottom-sheet";
import * as Progress from 'react-native-progress';
import { useToast } from "react-native-toast-notifications";

import { useWcDataStore } from "../../store/wcDataStore";
import { useCreateReview } from "../../src/hooks/useCreateReview";
import { useUserStore } from "../../store/userStore";

import CommentCardComponentBig from "../cards/commentCardComponentBig";
import ButtonComponent from "../Button/Button";
import WriteCommandAndRate from "../comments/writeCommentAndRate";

export default function RateAndCommentSheet({ theme, toilet, iscommenting, iscommentsOpen, setIscommenting, setIscommentsOpen }) {
    const { t } = useTranslation();
    const toast = useToast();

    const setWcData = useWcDataStore((state) => state.setWcData);
    const wcData = useWcDataStore((state) => state.wcData);
    const setSelectedToilet = useWcDataStore((state) => state.setSelectedToilet);

    const user = useUserStore((state) => state.user);

    const ratings = toilet.ratingSummary;
    const createRiview = useCreateReview();
    const comments = toilet.reviews;

    const handleSendReview = async () => {
        const toiletId = toilet?._id;
        const review = await createRiview({
            reviewText: wcData.review,
            ratings: wcData.ratings,
        });
        if (wcData.review.trim().length < 10) {
            if (toast?.show) {
                toast.show("Could not add review", {
                    type: "custom",
                    data: {
                        type: "error",
                        text2: "Your text should be more than 10 and less than 200 charachter.",
                    },
                })
            };
            return;
        }
        if (review) {
            const current = useWcDataStore.getState().selectedToilet;

            if (!current || current._id !== toiletId) {
                return;
            }

            const oldCount = current.ratingSummary.count;
            const newCount = oldCount + 1;

            const newRatingSummary = {
                ...current.ratingSummary,
                count: newCount,
            };
            const fields = [
                "cleanliness",
                "odor",
                "amenitiesHealth",
                "light",
                "privacy",
                "crowd",
            ];

            fields.forEach((field) => {
                newRatingSummary[field] =
                    (
                        current.ratingSummary[field] * oldCount +
                        review.ratings[field]
                    ) / newCount;
            });

            newRatingSummary.average =
                fields.reduce(
                    (sum, field) => sum + newRatingSummary[field],
                    0
                ) / fields.length;

            setSelectedToilet({
                ...current,
                ratingSummary: newRatingSummary,
                reviews: [
                    {
                        ...review,
                        user: {
                            _id: user._id,
                            username: user.username,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            avatar: user.avatar,
                        },
                    },
                    ...(current.reviews ?? []),
                ],
            });

            setWcData((prev) => ({
                ...prev,
                review: "",
                ratings: {
                    cleanliness: 0,
                    odor: 0,
                    amenitiesHealth: 0,
                    light: 0,
                    privacy: 0,
                    crowd: 0,
                },
            }));

            setIscommenting(false);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <BottomSheetScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 100,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        height: 150,
                        marginTop: 10,
                        borderWidth: 0.5,
                        borderRadius: 20,
                        borderColor: theme.colors.secondaryLight + "80",
                        backgroundColor: theme.colors.secondaryLighter + "13",
                        overflow: "hidden",
                    }}
                >
                    {/* LEFT */}
                    <View
                        style={{
                            flex: 0.35,
                            backgroundColor: theme.colors.secondaryLight + "23",
                            borderRightWidth: 0.2,
                            borderRightColor: theme.colors.primary + "60",
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Text variant="displayMedium">
                            {ratings.average.toFixed(1)}
                        </Text>
                        <StarRating
                            rating={ratings.average}
                            onChange={() => { }}
                            enableSwiping={false}
                            step="quarter"
                            starSize={12}
                            color={theme.colors.secondary}
                        />
                        <Text style={{
                            color: theme.colors.text + '99',
                            marginTop: 15
                        }}>
                            ({ratings.count} {t("components.rateAndCommentSheet.vote")})
                        </Text>
                    </View>

                    {/* RIGHT */}
                    <View
                        style={{
                            flex: 0.65,
                            paddingHorizontal: 6,
                            justifyContent: "center",
                            backgroundColor: theme.colors.secondaryLight + "19",
                        }}
                    >
                        {Object.entries(ratings)
                            .filter(([key]) => key !== "count" && key !== "average")
                            .map(([key, value]) => (
                                <View
                                    key={key}
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        height: 18,
                                        width: "100%",
                                    }}
                                >
                                    {/* LABEL */}
                                    <Text
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                        style={{
                                            width: 55,
                                            fontSize: 8,
                                        }}
                                    >
                                        {t(`components.rateAndCommentSheet.${key}`)}
                                    </Text>

                                    {/* BAR CONTAINER */}
                                    <View
                                        style={{
                                            flex: 1,
                                            height: 6,
                                            marginHorizontal: 4,
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Progress.Bar
                                            progress={value / 5}
                                            width={140}
                                            color={theme.colors.secondaryLight}
                                            unfilledColor={theme.colors.secondaryLighter + '40'}
                                            borderWidth={0.6}
                                        />
                                    </View>

                                    {/* VALUE */}
                                    <Text
                                        style={{
                                            width: 15,
                                            fontSize: 8,
                                            textAlign: "right",
                                        }}
                                    >
                                        {value}
                                    </Text>
                                </View>
                            ))}
                    </View>
                </View>

                {iscommenting ? (
                    <WriteCommandAndRate theme={theme} />
                ) : (
                    <>
                        {comments?.length > 0 ? (
                            <View style={{
                                width: '100%',
                                height: '100%'
                            }}>
                                {comments.map((item) => (
                                    <CommentCardComponentBig
                                        key={item._id}
                                        theme={theme}
                                        review={item} />
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
                                <Text>
                                    {t("components.rateAndCommentSheet.noReview")}
                                </Text>

                                <ButtonComponent
                                    onPress={() => {
                                        setIscommenting(true);
                                    }}
                                    backgroundColor={theme.colors.secondaryLight + "15"}
                                    borderColor={theme.colors.secondaryLighter + "80"}
                                    style={{
                                        width: "100%",
                                        marginTop: 10
                                    }}>

                                    <View
                                        style={{
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
                                            style={{ color: theme.colors.secondaryDark + "99" }}
                                        >
                                            {t("components.rateAndCommentSheet.reviewInputText")}
                                        </Text>
                                    </View>

                                </ButtonComponent>
                            </View>
                        )}
                    </>
                )}

            </BottomSheetScrollView>
            {iscommenting && (
                <View
                    pointerEvents="box-none"
                    style={{
                        position: 'absolute',
                        left: 24,
                        right: 24,
                        bottom: 10,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            gap: 10,
                            marginBottom: 20
                        }}
                    >
                        <ButtonComponent
                            onPress={() => {
                                setIscommenting(false);
                            }}
                            backgroundColor={theme.colors.error + '50'}
                            borderColor={theme.colors.error + '80'}
                            style={{
                                width: '30%',
                            }}
                        >
                            <Text style={{ color: theme.colors.error }}>
                                {t("components.rateAndCommentSheet.cancelReviewBtn")}
                            </Text>
                        </ButtonComponent>

                        <ButtonComponent
                            onPress={handleSendReview}
                            backgroundColor={theme.colors.secondary + '50'}
                            borderColor={theme.colors.secondaryLight + '80'}
                            style={{
                                width: '70%',
                            }}
                        >
                            <Text style={{ color: theme.colors.secondary }}>
                                {t("components.rateAndCommentSheet.addReviewBtn")}
                            </Text>
                        </ButtonComponent>

                    </View>
                </View>
            )}
        </View>

    );
}