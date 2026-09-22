import { Modal, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import useWaitingSystemStore from "../../store/waitingSystemStore";
import { BlurView } from "expo-blur";
import { Matrix, snakeFrames } from "react-native-dotgrid";

export default function WaitingOverlay() {
    const theme = useTheme();

    const waiting = useWaitingSystemStore(state => state.waiting);
    const waitingText = useWaitingSystemStore(state => state.waitingText);
    const waitingVisible = useWaitingSystemStore(state => state.waitingVisible);

    if (!waiting || !waitingVisible) {
        return null;
    }

    return (
        <Modal
            visible={true}
            transparent
            animationType="none"
            statusBarTranslucent
        >
            <BlurView
                intensity={12}
                tint={
                    theme.dark
                        ? "systemUltraThinMaterialDark"
                        : "systemUltraThinMaterialLight"
                }
                style={{
                    position: "absolute",
                    backgroundColor: theme.colors.secondaryLighter + "15",
                    zIndex: 9999999999,
                    elevation: 9999,
                    bottom: 0,
                    top: 0,
                    right: 0,
                    left: 0,
                    justifyContent: "center",
                    alignItems: "center",
                    margin: 12,
                    borderRadius: 48,
                    overflow: "hidden",
                }}
            >
                <View
                    pointerEvents="none"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                        gap: 40,
                    }}
                >
                    <Matrix
                        rows={4}
                        cols={5}
                        frames={snakeFrames}
                        size={28}
                        gap={28}
                        fps={3}
                        loop
                        palette={{
                            on: theme.colors.primary,
                            off: "transparent",
                        }}
                        style={{
                            transform: [{ rotate: "90deg" }],
                        }}
                    />

                    <Matrix
                        rows={2}
                        cols={5}
                        frames={snakeFrames}
                        size={28}
                        gap={28}
                        fps={10}
                        loop
                        palette={{
                            on: theme.colors.primary,
                            off: "transparent",
                        }}
                    />

                    <Matrix
                        rows={4}
                        cols={5}
                        frames={snakeFrames}
                        size={28}
                        gap={28}
                        fps={9}
                        loop
                        palette={{
                            on: theme.colors.primary,
                            off: "transparent",
                        }}
                        style={{
                            transform: [{ rotate: "90deg" }],
                        }}
                    />

                    <Matrix
                        rows={2}
                        cols={5}
                        frames={snakeFrames}
                        size={28}
                        gap={28}
                        fps={15}
                        loop
                        palette={{
                            on: theme.colors.primary,
                            off: "transparent",
                        }}
                    />

                    <BlurView
                        intensity={30}
                        tint={
                            theme.dark
                                ? "systemUltraThinMaterialDark"
                                : "systemUltraThinMaterialLight"
                        }
                        style={{
                            position: "absolute",
                            width: "80%",
                            height: 44,
                            borderRadius: 14,
                            overflow: "hidden",

                            backgroundColor: theme.colors.secondary + "45",

                            alignItems: "center",
                            justifyContent: "center",

                            borderColor: theme.colors.surface + "99",
                            borderWidth: 0.6,

                            // Floating shadow
                            shadowColor: "#fcf9f9",
                            shadowOffset: {
                                width: 0,
                                height: 8,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 12,

                            // Android
                            elevation: 8,
                        }}
                    >
                        <Text
                            variant="labelLarge"
                            style={{
                                textAlign: "center",
                                width: "100%",
                                color: theme.colors.focused,
                            }}
                        >
                            {waitingText}
                        </Text>
                    </BlurView>
                </View>
            </BlurView>
        </Modal>
    );
}