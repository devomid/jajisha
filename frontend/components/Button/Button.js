import React from "react";
import { Pressable, View } from "react-native";

const ButtonComponent = ({
    children,
    onPress,
    style,
    backgroundColor,
    borderColor
}) => {
    return (
        <Pressable
            onPress={onPress}
            style={style}
        >
            {({ pressed }) => (
                <View
                    style={{
                        width: "100%",
                        height: 44,
                        borderRadius: 14,
                        borderWidth: 0.5,
                        borderColor,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor,
                        opacity: pressed ? 0.65 : 1,
                    }}
                >
                    {children}
                </View>
            )}
        </Pressable>
    );
};

export default ButtonComponent;