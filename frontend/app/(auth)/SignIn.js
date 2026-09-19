import { useEffect, useState } from "react";
import { useAuth } from "../../src/hooks/useAuth";
import { useFormik } from "formik";
import useCurrentLocation from "../../src/hooks/useCurrentLocation";
import { useSettingsStore } from "../../store/settingsStore";
import { useTopSheetStore } from "../../store/menuStore";

import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet, Pressable, TextInput } from "react-native";
import { Text, Button, useTheme } from "react-native-paper";
import { BlurView } from "expo-blur";
import { Checkbox } from 'expo-checkbox';
import MapView from "react-native-maps";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

import { signInSchema } from "../../src/validation/userInfoSchema";
import { Mail, KeyRound } from 'lucide-react-native';

import ButtonComponent from "../../components/Button/Button";
import FormInput from "../../components/inpuField/formInput";

export default function SignIn() {
    const theme = useTheme();
    const currentLocation = useCurrentLocation();
    const { signIn } = useAuth();
    const [region, setRegion] = useState(null);
    const [rememberMe, setRememberMe] = useState(false);
    const mapType = useSettingsStore(state => state.mapType);
      const close = useTopSheetStore((state) => state.close);
    

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
                await SecureStore.setItemAsync(
                    "savedPassword",
                    values.password
                );
            } else {
                await AsyncStorage.removeItem("savedEmail");
                await SecureStore.deleteItemAsync("savedPassword");
            }

            resetForm();
            close();
            router.push('/');
        },
    });

    const handleCancel = () => {
        close();
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
            const savedPassword = await SecureStore.getItemAsync(
                "savedPassword"
            );

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
                    mapType={mapType}
                    style={StyleSheet.absoluteFillObject}
                    showsUserLocation={false}
                    initialRegion={region}
                />
            )}

            {/* BLUR */}
            <BlurView
                intensity={15}
                tint="light"
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    borderRadius: 48,
                    marginBottom: 12,
                    marginTop: 12,
                    marginHorizontal: 12,
                    overflow: "hidden",
                }}
            />

            {/* PRIMARY COLOR OVERLAY */}
            <View
                pointerEvents="none"
                style={[
                    StyleSheet.absoluteFillObject,
                    {
                        backgroundColor: theme.colors.primary,
                        opacity: 0.18,
                        borderRadius: 48,
                        marginBottom: 12,
                        marginTop: 12,
                        marginHorizontal: 12,
                        overflow: "hidden",
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
                            <Text style={{ color: theme.colors.secondaryDarker + '99' }}
                                variant="displayLarge">
                                Sign In
                            </Text>
                            <Text style={{ color: theme.colors.secondaryDarker + '99', marginLeft: 2 }}
                                variant="bodyMedium">
                                to find best places to relief.
                            </Text>
                        </View>

                        {/* FORM */}
                        <View style={{
                            paddingHorizontal: 25,
                            gap: 15,
                        }}>
                            <FormInput
                                label="Email"
                                icon={Mail}
                                value={values.email}
                                onChangeText={handleChange("email")}
                                onBlur={handleBlur("email")}
                                error={errors.email}
                                touched={touched.email}
                                theme={theme}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />

                            <FormInput
                                label="Password"
                                icon={KeyRound}
                                value={values.password}
                                onChangeText={handleChange("password")}
                                onBlur={handleBlur("password")}
                                error={errors.password}
                                touched={touched.password}
                                theme={theme}
                                secureTextEntry
                                autoCapitalize="none"
                                autoCorrect={false}
                            />

                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Checkbox
                                    style={{
                                        margin: 10,
                                        width: 17,
                                        height: 17
                                    }}
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

                            <View style={{ minHeight: 150 }}>
                                {touched.email && errors.email && (
                                    <Text style={{
                                        color: theme.colors.error,
                                        fontSize: 12,
                                        marginLeft: 4,
                                    }}>
                                        {errors.email}
                                    </Text>
                                )}

                                {touched.password && errors.password && (
                                    <Text style={{
                                        color: theme.colors.error,
                                        fontSize: 12,
                                        marginLeft: 4,
                                    }}>
                                        {errors.password}
                                    </Text>
                                )}
                            </View>

                            <View>
                                <ButtonComponent
                                    onPress={handleSubmit}
                                    backgroundColor={theme.colors.success + '20'}
                                    borderColor={theme.colors.success + '50'}
                                    style={{
                                        width: '100%',
                                        marginTop: '5'
                                    }}
                                >
                                    <Text style={{ color: theme.colors.secondary }}>
                                        Sign In
                                    </Text>
                                </ButtonComponent>

                                <ButtonComponent
                                    onPress={handleCancel}
                                    backgroundColor={theme.colors.error + '20'}
                                    borderColor={theme.colors.error + '50'}
                                    style={{
                                        width: '100%',
                                        marginTop: '15'
                                    }}
                                >
                                    <Text style={{ color: theme.colors.secondary }}>
                                        Cancel
                                    </Text>
                                </ButtonComponent>

                                <View style={{
                                    marginTop: '40',
                                    flexDirection: 'row',
                                    gap: 15,
                                    alignSelf: 'center'
                                }}>
                                    <Text style={{
                                        color: theme.colors.text + '90'
                                    }}>
                                        No account yet?
                                    </Text>

                                    <Pressable onPress={() => router.push("/SignUp")}>
                                        <Text
                                            style={{
                                                color: theme.colors.secondaryDarker,
                                                fontWeight: "600",
                                            }}
                                        >
                                            Sign up
                                        </Text>
                                    </Pressable>
                                </View>
                            </View>

                        </View>
                    </View>
                )}

            </SafeAreaView>
        </View>
    );
}