import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Text, useTheme } from "react-native-paper";
import useWaitingSystemStore from "../../store/waitingSystemStore";
import { BlurView } from "expo-blur";
import { Matrix, snakeFrames } from 'react-native-dotgrid';


export default function WaitingOverlay() {

    const theme = useTheme();

    const signinWaiting = useWaitingSystemStore(state => state.signinWaiting);
    const signinWaitingText = useWaitingSystemStore(state => state.signinWaitingText);
    const signupWaiting = useWaitingSystemStore(state => state.signupWaiting);
    const signupWaitingText = useWaitingSystemStore(state => state.signupWaitingText);
    const deleteUserWaiting = useWaitingSystemStore(state => state.deleteUserWaiting);
    const deleteUserWaitingText = useWaitingSystemStore(state => state.deleteUserWaitingText);
    const logoutWaiting = useWaitingSystemStore(state => state.logoutWaiting);
    const logoutWaitingText = useWaitingSystemStore(state => state.logoutWaitingText);
    const addWcWaiting = useWaitingSystemStore(state => state.addWcWaiting);
    const addWcWaitingText = useWaitingSystemStore(state => state.addWcWaitingText);
    const restoreUserWaiting = useWaitingSystemStore(state => state.restoreUserWaiting);
    const restoreUserWaitingText = useWaitingSystemStore(state => state.restoreUserWaitingText);
    const createReviewWaiting = useWaitingSystemStore(state => state.createReviewWaiting);
    const createReviewWaitingText = useWaitingSystemStore(state => state.createReviewWaitingText);
    const getCurrentLocationWaiting = useWaitingSystemStore(state => state.getCurrentLocationWaiting);
    const getCurrentLocationWaitingText = useWaitingSystemStore(state => state.getCurrentLocationWaitingText);
    const getWcsWaiting = useWaitingSystemStore(state => state.getWcsWaiting);
    const getWcsWaitingText = useWaitingSystemStore(state => state.getWcsWaitingText);
    const saveWcWaiting = useWaitingSystemStore(state => state.saveWcWaiting);
    const saveWcWaitingText = useWaitingSystemStore(state => state.saveWcWaitingText);
    const unsaveWcWaiting = useWaitingSystemStore(state => state.unsaveWcWaiting);
    const unsaveWcWaitingText = useWaitingSystemStore(state => state.unsaveWcWaitingText);
    const getWcReviewWaiting = useWaitingSystemStore(state => state.getWcReviewWaiting);
    const getWcReviewWaitingText = useWaitingSystemStore(state => state.getWcReviewWaitingText);
    const calculatingDistanceWaiting = useWaitingSystemStore(state => state.calculatingDistanceWaiting);
    const calculatingDistanceWaitingText = useWaitingSystemStore(state => state.calculatingDistanceWaitingText);


    let waiting = false;
    let waitingText = "";

    switch (true) {

        case signinWaiting:
            waiting = true;
            waitingText = signinWaitingText;
            break;


        case signupWaiting:
            waiting = true;
            waitingText = signupWaitingText;
            break;


        case deleteUserWaiting:
            waiting = true;
            waitingText = deleteUserWaitingText;
            break;


        case logoutWaiting:
            waiting = true;
            waitingText = logoutWaitingText;
            break;


        case addWcWaiting:
            waiting = true;
            waitingText = addWcWaitingText;
            break;


        case restoreUserWaiting:
            waiting = true;
            waitingText = restoreUserWaitingText;
            break;


        case createReviewWaiting:
            waiting = true;
            waitingText = createReviewWaitingText;
            break;


        case getCurrentLocationWaiting:
            waiting = true;
            waitingText = getCurrentLocationWaitingText;
            break;


        case getWcsWaiting:
            waiting = true;
            waitingText = getWcsWaitingText;
            break;


        case saveWcWaiting:
            waiting = true;
            waitingText = saveWcWaitingText;
            break;


        case unsaveWcWaiting:
            waiting = true;
            waitingText = unsaveWcWaitingText;
            break;


        case getWcReviewWaiting:
            waiting = true;
            waitingText = getWcReviewWaitingText;
            break;


        case calculatingDistanceWaiting:
            waiting = true;
            waitingText = calculatingDistanceWaitingText;
            break;


        default:
            waiting = false;
            waitingText = "";
    }

    if (!waiting) {
        return null;
    }

    return (
        <BlurView
            intensity={10}
            tint={
                theme.dark
                    ? "systemUltraThinMaterialDark"
                    : "systemUltraThinMaterialLight"
            }
            style={{
                position: "absolute",
                backgroundColor: theme.colors.secondary + "20",
                zIndex: 9999,
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
                pointerEvents='none'
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1000,
                    gap: 40
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
                        off: 'transparent',
                    }}
                    style={{
                        transform: [{ rotate: '90deg' }],
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
                        off: 'transparent',
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
                        off: 'transparent',
                    }}
                    style={{
                        transform: [{ rotate: '90deg' }],
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
                        off: 'transparent',
                    }}
                />

                <BlurView
                    intensity={6}
                    tint={
                        theme.dark
                            ? "systemUltraThinMaterialDark"
                            : "systemUltraThinMaterialLight"
                    }
                    style={{
                        position: "absolute",

                        width: '80%',
                        height: 44,
                        borderRadius: 14,
                        overflow: "hidden",

                        backgroundColor: theme.colors.secondary + "45",

                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 2,
                    }}
                >
                    <Text
                        variant='labelLarge'
                        style={{
                            textAlign: "center",
                            width: "100%",
                            color: theme.colors.primaryLighter
                        }}>
                        {waitingText}
                    </Text>
                </BlurView>
            </View>

        </BlurView>
    );
}

