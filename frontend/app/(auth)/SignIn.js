import { useEffect, useState } from "react";
import { useAuth } from "../../src/hooks/useAuth";
import { useFormik } from "formik";
import useCurrentLocation from "../../src/hooks/useCurrentLocation";

import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet, Pressable } from "react-native";
import { Text, TextInput, Button, useTheme } from "react-native-paper";
import { BlurView } from "expo-blur";
import { Checkbox } from 'expo-checkbox';
import MapView from "react-native-maps";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { signInSchema } from "../../src/validation/userInfoSchema";

import ButtonComponent from "../../components/Button/Button";

export default function SignIn() {
    const theme = useTheme();
    const currentLocation = useCurrentLocation();
    const { signIn } = useAuth();
    const [region, setRegion] = useState(null);
    const [rememberMe, setRememberMe] = useState(false);

    const {
        values,
        errors,
        touched,
        isSubmitting,
        handleSubmit,
        handleBlur,
        handleChange,
        setValues
    } = useFormik({
        initialValues: {
            email: "",
            password: "",
        },

        validationSchema: signInSchema,

        onSubmit: async (values, { resetForm }) => {
            const isSignedIn = await signIn(values.email, values.password);

            if (!isSignedIn) { return; }

            if (rememberMe) {
                await AsyncStorage.setItem("savedEmail", values.email);
                await AsyncStorage.setItem("savedPassword", values.password);
            } else {
                await AsyncStorage.removeItem("savedEmail");
                await AsyncStorage.removeItem("savedPassword");
            }

            resetForm();
            router.push('/');
        },
    });

    const handleCancel = () => {
        router.replace('/')
    }

    useEffect(() => {
        const coords = currentLocation?.coords;

        if (!coords) return;

        setRegion({
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
        });
    }, [currentLocation]);

    useEffect(() => {
        const loadSavedLogin = async () => {
            const savedEmail = await AsyncStorage.getItem("savedEmail");
            const savedPassword = await AsyncStorage.getItem("savedPassword");

            if (savedEmail && savedPassword) {
                setValues({
                    email: savedEmail,
                    password: savedPassword,
                });

                setRememberMe(true);
            }
        };

        loadSavedLogin();
    }, []);

    return (
        <View style={{ flex: 1, }}>

            {/* MAP BACKGROUND */}
            {region && (
                <MapView
                    style={StyleSheet.absoluteFillObject}
                    showsUserLocation={false}
                    initialRegion={region}
                />
            )}

            {/* BLUR */}
            <BlurView
                intensity={15}
                tint="light"
                style={StyleSheet.absoluteFillObject}
            />

            {/* PRIMARY COLOR OVERLAY */}
            <View
                pointerEvents="none"
                style={[
                    StyleSheet.absoluteFillObject,
                    {
                        backgroundColor: theme.colors.primary,
                        opacity: 0.18,
                    },
                ]}
            />

            <SafeAreaView style={{ flex: 1, }}>

                {!region ? (
                    // Keep the page structure while location loads
                    <View style={{ flex: 1, }} />
                ) : (
                    <View style={{ flex: 1, }}>

                        {/* TITLE */}
                        <View style={{
                            width: "100%",
                            paddingHorizontal: 25,
                            marginTop: 70,
                            marginBottom: 50,
                        }}>
                            <Text style={{ color: theme.colors.secondaryDarker }} variant="displayLarge">
                                Sign In
                            </Text>
                            <Text style={{ color: theme.colors.secondaryDarker, marginLeft: 2 }} variant="bodyMedium">
                                to find best places to relief.
                            </Text>
                        </View>

                        {/* FORM */}
                        <View style={{
                            paddingHorizontal: 25,
                            gap: 25,
                        }}>
                            <TextInput
                                label="Email"
                                mode="outlined"
                                outlineColor={theme.colors.secondaryLight + '80'}
                                activeOutlineColor={theme.colors.secondary + '80'}
                                value={values.email}
                                onChangeText={handleChange("email")}
                                textColor={theme.colors.text}
                                selectionColor={theme.colors.primaryDarker}
                                outlineStyle={{ borderRadius: 14, }}
                                theme={{
                                    colors: {
                                        onSurfaceVariant: theme.colors.secondary + '70',
                                        primary: theme.colors.white,
                                    },
                                }}
                                onBlur={handleBlur("email")}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                error={Boolean(touched.email && errors.email)}
                                style={{
                                    backgroundColor: theme.colors.secondaryLight + "30",
                                    height: 44,
                                }} />

                            {touched.email && errors.email && (
                                <Text style={{
                                    marginTop: -12,
                                    marginLeft: 4,
                                    fontSize: 12,
                                    color: theme.colors.error,
                                }}>
                                    {errors.email}
                                </Text>
                            )}

                            <TextInput
                                label="Password"
                                mode="outlined"
                                outlineColor={theme.colors.secondaryLight + '80'}
                                activeOutlineColor={theme.colors.secondary + '80'}
                                value={values.password}
                                onChangeText={handleChange("password")}
                                onBlur={handleBlur("password")}
                                secureTextEntry
                                autoCapitalize="none"
                                error={Boolean(touched.password && errors.password)}
                                textColor={theme.colors.text}
                                selectionColor={theme.colors.primaryDarker}
                                outlineStyle={{ borderRadius: 14, }}
                                theme={{
                                    colors: {
                                        onSurfaceVariant: theme.colors.secondary + '70',
                                        primary: theme.colors.white,
                                    },
                                }}
                                style={{
                                    backgroundColor: theme.colors.secondaryLight + "30",
                                    height: 44,
                                }} />

                            {touched.password && errors.password && (
                                <Text style={{
                                    marginTop: -12,
                                    marginLeft: 4,
                                    fontSize: 12,
                                    color: theme.colors.error,
                                }}>
                                    {errors.password}
                                </Text>
                            )}

                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Checkbox
                                    style={{ margin: 10 }}
                                    value={rememberMe}
                                    onValueChange={setRememberMe}
                                    color={
                                        rememberMe
                                            ? theme.colors.primary
                                            : theme.colors.secondaryLight
                                    }
                                />

                                <Text style={{ color: theme.colors.secondary }}>
                                    Remember me
                                </Text>
                            </View>

                            <View>
                                <ButtonComponent
                                    onPress={handleSubmit}
                                    backgroundColor={theme.colors.success + '60'}
                                    borderColor={theme.colors.success + '80'}
                                    style={{
                                        width: '100%',
                                        marginTop: '15'
                                    }}
                                >
                                    <Text style={{ color: theme.colors.secondary }}>
                                        Sign In
                                    </Text>
                                </ButtonComponent>

                                <ButtonComponent
                                    onPress={handleCancel}
                                    backgroundColor={theme.colors.error + '50'}
                                    borderColor={theme.colors.error + '80'}
                                    style={{
                                        width: '100%',
                                        marginTop: '15'
                                    }}
                                >
                                    <Text style={{ color: theme.colors.secondary }}>
                                        Cancel
                                    </Text>
                                </ButtonComponent>

                                <Text style={{
                                    alignSelf: 'center',
                                    marginTop: '128',
                                    color: theme.colors.secondaryDarker
                                }}>
                                    No account yet?
                                </Text>

                                <ButtonComponent
                                    onPress={() => {
                                        router.push('/SignUp');
                                    }}
                                    backgroundColor={theme.colors.secondary + '30'}
                                    borderColor={theme.colors.secondaryLighter + '80'}
                                    style={{
                                        width: '100%',
                                        marginTop: 15
                                    }}
                                >
                                    <Text style={{ color: theme.colors.surface, }}>
                                        Become a new member
                                    </Text>
                                </ButtonComponent>
                            </View>

                        </View>
                    </View>
                )}

            </SafeAreaView>
        </View>
    );
}