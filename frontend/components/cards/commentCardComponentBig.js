import { useTranslation } from "react-i18next";

import { View, Text } from "react-native";
import { Divider } from 'react-native-paper';
import StarRating from "react-native-star-rating-widget";

export default function CommentCardComponentBig({ theme, review }) {
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
                t("components.commentCardComponentBig.getTimeAgo.minute") :
                t("components.commentCardComponentBig.getTimeAgo.minutes")}`
        }

        const hours = Math.floor(minutes / 60);

        if (hours < 24) {
            return `${hours} ${hours === 1 ?
                t("components.commentCardComponentBig.getTimeAgo.hour") :
                t("components.commentCardComponentBig.getTimeAgo.hours")}`
        }

        const days = Math.floor(hours / 24);

        if (days < 30) {
            return `${days} ${days === 1 ?
                t("components.commentCardComponentBig.getTimeAgo.day") :
                t("components.commentCardComponentBig.getTimeAgo.days")}`
        }

        const months = Math.floor(days / 30);

        if (months < 12) {
            return `${months} ${months === 1 ?
                t("components.commentCardComponentBig.getTimeAgo.month") :
                t("components.commentCardComponentBig.getTimeAgo.months")}`
        }

        const years = Math.floor(months / 12);

        return `${years} ${years === 1 ?
            t("components.commentCardComponentBig.getTimeAgo.year") :
            t("components.commentCardComponentBig.getTimeAgo.years")}`
    };

    return (
        <View
            style={{
                width: '100%',
                height: 150,
                borderWidth: 0.5,
                borderRadius: 24,
                borderColor: theme.colors.secondaryLight + "80",
                backgroundColor: theme.colors.secondaryLight + "10",
                padding: 15,
                marginTop: 5,
            }}
        >
            {/* Rating - top */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                }}
            >
                <Text style={{ color: theme.colors.secondaryLight }}>
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
                theme={{ colors: { primary: theme.colors.secondaryDarker } }}
                style={{ marginTop: 9 }} />

            {/* Comment - middle */}
            <View
                style={{
                    flex: 1,
                    marginTop: 10
                }}
            >
                <Text style={{ color: theme.colors.text }}>
                    {review.text}
                </Text>
            </View>

            {/* User + time - bottom */}
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
                        t("components.commentCardComponentBig.usernameText")}
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
                        {t("components.commentCardComponentBig.getTimeAgo.ago")}
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
