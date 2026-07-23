import { View, Pressable, Text } from "react-native";
import { router } from "expo-router";


export default function NewToiletButtons({ theme }) {

    <View
        style={{
            flexDirection: 'row',
            gap: 12,
        }}
    >
        <Pressable style={({ pressed }) => ({
            flex: 1,
            width: '40%',
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
            borderColor: theme.colors.border + 50,
            backgroundColor: pressed ? theme.colors.success + 70 : theme.colors.success + 50, // darker when pressed
            transform: [{ scale: pressed ? 0.95 : 1 }], // zoom out
        })}>
            <Text style={{ color: theme.colors.surface }}>
                Add
            </Text>
        </Pressable>

        <Pressable style={({ pressed }) => ({
            flex: 1,
            width: '40%',
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
            borderColor: theme.colors.border + 50,
            backgroundColor: pressed ? theme.colors.error + 70 : theme.colors.error + 50, // darker when pressed
            transform: [{ scale: pressed ? 0.95 : 1 }], // zoom out
        })}>
            <Text style={{ color: theme.colors.surface }}>
                Cancel
            </Text>
        </Pressable>
    </View>
}