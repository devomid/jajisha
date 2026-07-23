import { View, Pressable, Text } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import StarRating from 'react-native-star-rating-widget';


export default function Rating({ theme }) {
    const [rating, setRating] = useState(0);


    return (
        <View>
            <Text>Cleaness</Text>
            <StarRating
                style={{ marginBottom: 12 }}
                rating={rating}
                onChange={setRating}
                step="full"
            />
            <Text>Odor</Text>
            <StarRating
                style={{ marginBottom: 12 }}
                rating={rating}
                onChange={setRating}
                step="full"
            />
            <Text>Amenities Health</Text>
            <StarRating
                style={{ marginBottom: 12 }}
                rating={rating}
                onChange={setRating}
                step="full"
            />
            <Text>Light</Text>
            <StarRating
                style={{ marginBottom: 12 }}
                rating={rating}
                onChange={setRating}
                step="full"
            />
            <Text>Privacy</Text>
            <StarRating
                style={{ marginBottom: 12 }}
                rating={rating}
                onChange={setRating}
                step="full"
            />
            <Text>Crowd</Text>
            <StarRating
                style={{ marginBottom: 12 }}
                rating={rating}
                onChange={setRating}
                step="full"
            />
        </View>
    );
}


