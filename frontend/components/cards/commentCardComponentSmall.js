import { View, Text } from "react-native";
import StarRating from "react-native-star-rating-widget";
import { Divider } from "react-native-paper";
import { useTranslation } from "react-i18next";

export default function CommentCardComponentSmall({ theme, review }) {
    const { t } = useTranslation();
    const ratings = review?.ratings
        ? Object.values(review?.ratings)
        : [];

    const overallRating = ratings.length
        ? (ratings.reduce((sum, value) => sum + value, 0) / ratings.length).toFixed(1)
        : 0;


    const getTimeAgo = (date) => {
        const seconds = Math.floor(
            (Date.now() - new Date(date).getTime()) / 1000
        );

        if (seconds < 60) {
            return "just now";
        }

        const minutes = Math.floor(seconds / 60);

        if (minutes < 60) {
            return `${minutes} ${minutes === 1 ?
                t("components.commentCardComponentSmall.getTimeAgo.minute") :
                t("components.commentCardComponentSmall.getTimeAgo.minutes")}`
        }

        const hours = Math.floor(minutes / 60);

        if (hours < 24) {
            return `${hours} ${hours === 1 ?
                t("components.commentCardComponentSmall.getTimeAgo.hour") :
                t("components.commentCardComponentSmall.getTimeAgo.hours")}`
        }

        const days = Math.floor(hours / 24);

        if (days < 30) {
            return `${days} ${days === 1 ?
                t("components.commentCardComponentSmall.getTimeAgo.day") :
                t("components.commentCardComponentSmall.getTimeAgo.days")}`
        }

        const months = Math.floor(days / 30);

        if (months < 12) {
            return `${months} ${months === 1 ?
                t("components.commentCardComponentSmall.getTimeAgo.month") :
                t("components.commentCardComponentSmall.getTimeAgo.months")}`
        }

        const years = Math.floor(months / 12);

        return `${years} ${years === 1 ?
            t("components.commentCardComponentSmall.getTimeAgo.year") :
            t("components.commentCardComponentSmall.getTimeAgo.years")}`
    };


    return (
        <View
            style={{
                width: 240,
                height: 200,

                borderWidth: 0.5,
                borderRadius: 24,

                borderColor:
                    theme.colors.secondaryLight + "70",

                backgroundColor:
                    theme.colors.secondaryLight + "10",

                padding: 15,
                marginTop: 5,
            }}
        >

            {/* Rating */}

            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                }}
            >

                <Text
                    style={{
                        color: theme.colors.secondaryLight,
                        fontSize: 15,
                        fontWeight: "600",
                    }}
                >
                    {overallRating}
                </Text>

                <StarRating
                    rating={Number(overallRating)}
                    onChange={() => { }}
                    enableSwiping={false}
                    step="quarter"
                    starSize={12}
                    color={theme.colors.secondaryLight}
                />

            </View>


            <Divider
                theme={{
                    colors: {
                        primary:
                            theme.colors.secondaryDarker,
                    },
                }}
                style={{
                    marginTop: 9,
                    opacity: 0.45,
                }}
            />


            {/* Comment */}

            <View
                style={{
                    flex: 1,
                    marginTop: 10,
                }}
            >

                <Text
                    style={{
                        color: theme.colors.text,
                        fontSize: 14,
                        lineHeight: 20,
                    }}
                    numberOfLines={5}
                >
                    {review.text}
                </Text>

            </View>


            {/* User + Time */}

            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                }}
            >
                <Text
                    numberOfLines={1}
                    style={{
                        color: theme.colors.text + "80",
                        flexShrink: 1,
                        textAlign: "left",
                    }}
                >
                    {review.user?.username ??
                        t("components.commentCardComponentSmall.usernameText")}
                </Text>

                <View style={{
                    display: 'flex',
                    flexDirection: 'row',

                }}>
                    <Text
                        numberOfLines={1}
                        style={{
                            color: theme.colors.text + "80",
                            flexShrink: 0,
                            marginLeft: 8,
                            textAlign: "right",
                        }}
                    >
                        {t("components.commentCardComponentSmall.getTimeAgo.ago")}
                    </Text>
                    <Text
                        numberOfLines={1}
                        style={{
                            color: theme.colors.text + "80",
                            flexShrink: 0,
                            marginLeft: 8,
                            textAlign: "right",
                        }}
                    >
                        {getTimeAgo(review.createdAt)}
                    </Text>
                </View>
            </View>

        </View>
    );
}