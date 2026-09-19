import { useEffect, useState } from "react";
import { useAuth } from "../../src/hooks/useAuth"
import { useFormik } from "formik";
import useCurrentLocation from "../../src/hooks/useCurrentLocation";

import MapView from "react-native-maps";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet, Pressable, TextInput } from "react-native";
import { signUpSchema, } from "../../src/validation/userInfoSchema";
import { useSettingsStore } from "../../store/settingsStore";

import { Mail, KeyRound, ShieldCheck, ContactRound, UserRound, AtSign } from 'lucide-react-native';


import ButtonComponent from "../../components/Button/Button";
import FormInput from "../../components/inpuField/formInput";

export default function SignUp() {
    const theme = useTheme();
    const currentLocation = useCurrentLocation();
    const { signUp } = useAuth();
    const mapType = useSettingsStore(state => state.mapType);

    const [region, setRegion] = useState(null);

    const {
        values,
        errors,
        touched,
        isSubmitting,
        handleSubmit,
        handleBlur,
        handleChange,
    } = useFormik({
        initialValues: {
            username: "",
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: ""
        },

        validationSchema: signUpSchema,

        onSubmit: async (values, { resetForm }) => {
            const isSignedUp = await signUp(
                values.username,
                values.firstName,
                values.lastName,
                values.email,
                values.password
            )
            if (!isSignedUp) {
                return
            }
            router.push('/');
            resetForm();
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

    return (
        <View style={styles.container}>

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

            <SafeAreaView style={styles.safeArea}>

                {!region ? (
                    // Keep the page structure while location loads
                    <View style={styles.loadingContainer} />
                ) : (
                    <View style={styles.content}>

                        {/* TITLE */}
                        <View style={styles.titleContainer}>
                            <Text style={{ color: theme.colors.secondaryDarker + '99' }} variant="displayLarge">
                                Sign Up
                            </Text>
                            <Text style={{
                                color: theme.colors.secondaryDarker + '99',
                                marginLeft: 2
                            }} variant="bodyMedium">
                                so you can save places.
                            </Text>
                        </View>

                        {/* FORM */}
                        <View style={styles.form}>
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

                            <FormInput
                                label="Confirm Password"
                                icon={ShieldCheck}
                                value={values.confirmPassword}
                                onChangeText={handleChange("confirmPassword")}
                                onBlur={handleBlur("confirmPassword")}
                                error={errors.confirmPassword}
                                touched={touched.confirmPassword}
                                theme={theme}
                                secureTextEntry
                                autoCapitalize="none"
                                autoCorrect={false}
                            />

                            <View style={{
                                display: 'flex',
                                flexDirection: 'row',
                                width: '100%',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                                <FormInput
                                    label="First name"
                                    icon={UserRound}
                                    value={values.firstName}
                                    onChangeText={handleChange("firstName")}
                                    onBlur={handleBlur("firstName")}
                                    error={errors.firstName}
                                    touched={touched.firstName}
                                    theme={theme}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    style={{ width: '48%' }}
                                />

                                <FormInput
                                    label="Last name"
                                    icon={UserRound}
                                    value={values.lastName}
                                    onChangeText={handleChange("lastName")}
                                    onBlur={handleBlur("lastName")}
                                    error={errors.lastName}
                                    touched={touched.lastName}
                                    theme={theme}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    style={{ width: '48%' }}
                                />
                            </View>

                            <FormInput
                                label="User name"
                                icon={AtSign}
                                value={values.username}
                                onChangeText={handleChange("username")}
                                onBlur={handleBlur("username")}
                                error={errors.username}
                                touched={touched.username}
                                theme={theme}
                                secureTextEntry
                                autoCapitalize="none"
                                autoCorrect={false}
                            />

                            <View style={{
                                minHeight: 80
                            }}>
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

                                {touched.confirmPassword && errors.confirmPassword && (
                                    <Text style={{
                                        color: theme.colors.error,
                                        fontSize: 12,
                                        marginLeft: 4,
                                    }}>
                                        {errors.confirmPassword}
                                    </Text>
                                )}

                                {touched.firstName && errors.firstName && (
                                    <Text style={{
                                        color: theme.colors.error,
                                        fontSize: 12,
                                        marginLeft: 4,
                                    }}>
                                        {errors.firstName}
                                    </Text>
                                )}

                                {touched.lastName && errors.lastName && (
                                    <Text style={{
                                        color: theme.colors.error,
                                        fontSize: 12,
                                        marginLeft: 4,
                                    }}>
                                        {errors.lastName}
                                    </Text>
                                )}

                                {touched.username && errors.username && (
                                    <Text style={{
                                        color: theme.colors.error,
                                        fontSize: 12,
                                        marginLeft: 4,
                                    }}>
                                        {errors.username}
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
                                    }}
                                >
                                    <Text style={{ color: theme.colors.secondary }}>
                                        Sign Up
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
                                        Alreadu have account?
                                    </Text>

                                    <Pressable onPress={() => router.push("/SignIn")}>
                                        <Text
                                            style={{
                                                color: theme.colors.secondaryDarker,
                                                fontWeight: "600",
                                            }}
                                        >
                                            Sign In
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    safeArea: {
        flex: 1,
    },

    loadingContainer: {
        flex: 1,
    },

    content: {
        flex: 1,
    },

    titleContainer: {
        width: "100%",
        paddingHorizontal: 25,
        marginTop: 70,
        marginBottom: 30,
    },

    form: {
        paddingHorizontal: 25,
        gap: 15,
    },

    error: {
        marginTop: -12,
        marginLeft: 4,
        fontSize: 12,
        color: "#B00020",
    },

    button: {
        marginTop: 15,
    },
});