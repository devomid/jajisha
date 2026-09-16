import { View, Text } from "react-native";
import StarRating from "react-native-star-rating-widget";
import { Divider } from 'react-native-paper';

export default function CommentCardComponentSmall({ theme, review }) {
    const overallRating = (
        Object.values(review.ratings).reduce(
            (sum, rating) => sum + rating,
            0
        ) / Object.values(review.ratings).length
    ).toFixed(1);

    const getTimeAgo = (date) => {
        const seconds = Math.floor(
            (Date.now() - new Date(date).getTime()) / 1000
        );

        if (seconds < 60) {
            return "just now";
        }

        const minutes = Math.floor(seconds / 60);

        if (minutes < 60) {
            return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
        }

        const hours = Math.floor(minutes / 60);

        if (hours < 24) {
            return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
        }

        const days = Math.floor(hours / 24);

        if (days < 30) {
            return `${days} ${days === 1 ? "day" : "days"} ago`;
        }

        const months = Math.floor(days / 30);

        if (months < 12) {
            return `${months} ${months === 1 ? "month" : "months"} ago`;
        }

        const years = Math.floor(months / 12);

        return `${years} ${years === 1 ? "year" : "years"} ago`;
    };

    return (
        <View
            style={{
                width: 240,
                height: 200,
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
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Text style={{ color: theme.colors.text + '80' }}>
                    {review.user.username}
                </Text>

                <Text style={{ color: theme.colors.text + '80' }}>
                    {getTimeAgo(review.createdAt)}
                </Text>
            </View>
        </View>
    );
}

