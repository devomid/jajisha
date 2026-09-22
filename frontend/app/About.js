import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, useTheme } from "react-native-paper";
import MapView from "react-native-maps";
import { BlurView } from "expo-blur";
import PageHeader from "../components/topNav/topNav";
import useCurrentLocation from "../src/hooks/useCurrentLocation";
import { useEffect, useState } from "react";
import { useSettingsStore } from "../store/settingsStore";
import { useTranslation } from "react-i18next";


export default function About() {
    const { t } = useTranslation();
    const theme = useTheme();

    const pageName = t("app.about.pageName")
    const currentLocation = useCurrentLocation();

    const [region, setRegion] = useState(null);
    const mapType = useSettingsStore(state => state.mapType);

    useEffect(() => {
        if (!currentLocation?.coords) return;

        setRegion({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
        });
    }, [currentLocation]);

    if (!region) {
        return (
            <View style={{ flex: 1 }}>
                <SafeAreaView>
                    <PageHeader />
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>

            {/* MAP — full screen background */}
            <MapView
                mapType={mapType}
                style={StyleSheet.absoluteFillObject}
                showsUserLocation={false}
                initialRegion={region}
            />

            {/* PRIMARY COLOR + BLUR OVERLAY */}
            <BlurView
                intensity={15}
                tint="light"
                style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    right: 0,
                    left: 0,
                    margin: 12,
                    borderRadius: 48,
                }}
            />

            <View
                pointerEvents="none"
                style={[
                    StyleSheet.absoluteFillObject,
                    {
                        backgroundColor: theme.colors.primary,
                        opacity: 0.23,
                        margin: 12,
                        borderRadius: 48,
                    },
                ]}
            />

            {/* EVERYTHING ABOVE THE MAP */}
            <SafeAreaView style={{ flex: 1 }}>

                <PageHeader pageName={pageName} />

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: 24,
                        paddingTop: 8,
                        paddingBottom: 35,
                    }}
                >
                    <View
                        style={{
                            paddingHorizontal: 22,
                            paddingVertical: 24,
                            borderRadius: 28,
                            borderWidth: 0.5,
                            borderColor: theme.colors.secondaryLight + '80',
                            backgroundColor: theme.colors.surface + '30',
                        }}
                    >

                        {/* HEADER */}
                        <Text
                            variant="headlineSmall"
                            style={{
                                color: theme.colors.text,
                                fontWeight: '600',
                                marginBottom: 4,
                            }}
                        >
                            Privacy Policy
                        </Text>

                        <Text
                            style={{
                                color: theme.colors.text + '65',
                                fontSize: 11,
                                marginBottom: 22,
                            }}
                        >
                            Last updated: September 17, 2026
                        </Text>

                        <Text
                            style={{
                                color: theme.colors.text + '90',
                                fontSize: 14,
                                lineHeight: 22,
                                marginBottom: 12,
                            }}
                        >
                            Jajisha is built to make finding and sharing public
                            toilets easier. This Privacy Policy explains what
                            information Jajisha uses, why it is needed, and what
                            happens to it.
                        </Text>

                        <Text
                            style={{
                                color: theme.colors.text + '95',
                                fontSize: 14,
                                lineHeight: 22,
                                marginBottom: 24,
                            }}
                        >
                            We try to keep this simple:{' '}
                            <Text style={{ fontWeight: '600' }}>
                                we only use information that is needed to provide
                                and improve Jajisha.
                            </Text>
                        </Text>

                        {/* 1 */}
                        <Text
                            variant="titleMedium"
                            style={{
                                color: theme.colors.secondary,
                                fontWeight: '600',
                                marginBottom: 12,
                            }}
                        >
                            1. Information We Collect
                        </Text>

                        <Text style={styles.body(theme)}>
                            Depending on how you use Jajisha, we may handle the
                            following information:
                        </Text>

                        <Text style={styles.subheading(theme)}>
                            Account information
                        </Text>

                        <Text style={styles.body(theme)}>
                            If you create an account, we may store information
                            associated with your account, such as your username,
                            email address, and authentication information.
                        </Text>

                        <Text style={styles.subheading(theme)}>
                            Location information
                        </Text>

                        <Text style={styles.body(theme)}>
                            Jajisha uses your device's location to help you find
                            public toilets around you and provide navigation
                            features.
                        </Text>

                        <Text style={styles.body(theme)}>
                            Your location is used while you use location-based
                            features. Jajisha does not need your location to
                            simply browse the app.
                        </Text>

                        <Text style={styles.subheading(theme)}>
                            Content you add
                        </Text>

                        <Text style={styles.body(theme)}>
                            If you add a public toilet, review, or other
                            information to Jajisha, that information is stored so
                            it can be displayed to other users.
                        </Text>

                        <Text style={styles.body(theme)}>
                            Please avoid including personal or sensitive
                            information in public reviews or other content you
                            submit.
                        </Text>

                        <Text style={styles.subheading(theme)}>
                            Saved places
                        </Text>

                        <Text style={styles.body(theme)}>
                            If you save a toilet as a favorite, Jajisha stores
                            that information so your saved places can be
                            available to you.
                        </Text>

                        {/* 2 */}
                        <Text style={styles.section(theme)}>
                            2. How We Use Your Information
                        </Text>

                        <Text style={styles.body(theme)}>
                            We use information to:
                        </Text>

                        <Text style={styles.body(theme)}>
                            • Provide the core features of Jajisha.{'\n'}
                            • Show public toilets near your location.{'\n'}
                            • Provide navigation and distance information.{'\n'}
                            • Store and display toilets and reviews submitted by
                            users.{'\n'}
                            • Keep your account working across sessions.{'\n'}
                            • Remember settings and preferences.{'\n'}
                            • Maintain, troubleshoot, and improve the
                            application.{'\n'}
                            • Protect the application from misuse and
                            unauthorized access.
                        </Text>

                        <Text style={styles.body(theme)}>
                            We do not collect information simply because we can.
                            If a piece of information isn't needed for a
                            feature, there is no reason for Jajisha to use it.
                        </Text>

                        {/* 3 */}
                        <Text style={styles.section(theme)}>
                            3. Location Data
                        </Text>

                        <Text style={styles.body(theme)}>
                            Location is an important part of Jajisha, but you
                            remain in control of it.
                        </Text>

                        <Text style={styles.body(theme)}>
                            You can choose whether to give Jajisha permission to
                            access your device's location through your device
                            settings. If you deny location permission, features
                            that depend on your location may not work correctly.
                        </Text>

                        <Text style={styles.body(theme)}>
                            Jajisha uses location to provide location-based
                            features such as finding nearby toilets and
                            navigation. Location information is not intended to
                            be used to identify you personally.
                        </Text>

                        {/* 4 */}
                        <Text style={styles.section(theme)}>
                            4. Public Content
                        </Text>

                        <Text style={styles.body(theme)}>
                            Some information you submit to Jajisha is intended
                            to be visible to other users.
                        </Text>

                        <Text style={styles.body(theme)}>
                            For example, when you add a toilet or write a review,
                            that content may become publicly available through
                            the application.
                        </Text>

                        <Text style={styles.body(theme)}>
                            Please keep this in mind before submitting anything.
                            <Text style={{ fontWeight: '600' }}>
                                {' '}Do not post your phone number, home address,
                                passwords, private conversations, or other
                                information you would not want other users to see.
                            </Text>
                        </Text>

                        {/* 5 */}
                        <Text style={styles.section(theme)}>
                            5. Data Storage and Security
                        </Text>

                        <Text style={styles.body(theme)}>
                            Account and application data may be stored on servers
                            used to operate Jajisha.
                        </Text>

                        <Text style={styles.body(theme)}>
                            We take reasonable technical measures to protect
                            stored information and prevent unauthorized access.
                            However, no online service can guarantee that data
                            will always remain completely secure.
                        </Text>

                        <Text style={styles.body(theme)}>
                            If we become aware of a security incident that
                            requires notifying users under applicable law, we
                            will take appropriate steps to do so.
                        </Text>

                        {/* 6 */}
                        <Text style={styles.section(theme)}>
                            6. Third-Party Services
                        </Text>

                        <Text style={styles.body(theme)}>
                            Jajisha may rely on third-party services to provide
                            parts of the application, such as maps, hosting,
                            databases, authentication, or other infrastructure.
                        </Text>

                        <Text style={styles.body(theme)}>
                            These services may process information according to
                            their own privacy policies and terms.
                        </Text>

                        <Text style={styles.body(theme)}>
                            Jajisha does not sell your personal information to
                            third parties.
                        </Text>

                        {/* 7 */}
                        <Text style={styles.section(theme)}>
                            7. Cookies and Tracking
                        </Text>

                        <Text style={styles.body(theme)}>
                            Jajisha does not use your personal information for
                            advertising profiles or behavioral advertising.
                        </Text>

                        <Text style={styles.body(theme)}>
                            If this changes in the future, this Privacy Policy
                            will be updated to explain what information is
                            collected and why.
                        </Text>

                        {/* 8 */}
                        <Text style={styles.section(theme)}>
                            8. Your Choices
                        </Text>

                        <Text style={styles.body(theme)}>
                            You can control several aspects of your information
                            through the application and your device.
                        </Text>

                        <Text style={styles.body(theme)}>
                            • Deny or revoke location permission through your
                            device settings.{'\n'}
                            • Update information associated with your account
                            where the application allows it.{'\n'}
                            • Remove content you have submitted where those
                            features are available.{'\n'}
                            • Delete your Jajisha account.
                        </Text>

                        <Text style={styles.body(theme)}>
                            Deleting your account removes your account from
                            Jajisha. Some information that has already been made
                            public, such as content contributed to the public
                            toilet database, may require separate handling and
                            may not automatically disappear simply because an
                            account is deleted.
                        </Text>

                        {/* 9 */}
                        <Text style={styles.section(theme)}>
                            9. Children's Privacy
                        </Text>

                        <Text style={styles.body(theme)}>
                            Jajisha is not designed specifically for children.
                        </Text>

                        <Text style={styles.body(theme)}>
                            We do not knowingly collect personal information
                            from children in violation of applicable laws. If you
                            believe a child has provided personal information to
                            Jajisha inappropriately, please contact us so we can
                            review the situation.
                        </Text>

                        {/* 10 */}
                        <Text style={styles.section(theme)}>
                            10. Changes to This Privacy Policy
                        </Text>

                        <Text style={styles.body(theme)}>
                            Jajisha may change this Privacy Policy when the
                            application or its data practices change.
                        </Text>

                        <Text style={styles.body(theme)}>
                            When we make significant changes, we will update the
                            "Last updated" date at the top of this page and,
                            where appropriate, provide additional notice through
                            the application.
                        </Text>

                        {/* 11 */}
                        <Text style={styles.section(theme)}>
                            11. Contact
                        </Text>

                        <Text style={styles.body(theme)}>
                            If you have a question, concern, or request about
                            privacy or your information, please contact the
                            Jajisha developer through the contact information
                            provided with the application.
                        </Text>

                        {/* FOOTER */}
                        <View
                            style={{
                                marginTop: 10,
                                paddingTop: 20,
                                borderTopWidth: 0.5,
                                borderTopColor: theme.colors.secondaryLight + '50',
                            }}
                        >
                            <Text
                                style={{
                                    color: theme.colors.text + '80',
                                    fontSize: 12,
                                    lineHeight: 19,
                                    textAlign: 'center',
                                }}
                            >
                                Thanks for using Jajisha.
                            </Text>

                            <Text
                                style={{
                                    color: theme.colors.text + '65',
                                    fontSize: 11,
                                    lineHeight: 18,
                                    textAlign: 'center',
                                    marginTop: 6,
                                }}
                            >
                                The goal of Jajisha is simple: help people find
                                a place when they need one, without collecting
                                more information than necessary to make that
                                possible.
                            </Text>
                        </View>

                    </View>
                </ScrollView>

            </SafeAreaView>

        </View>
    );
}

const styles = {
    section: theme => ({
        color: theme.colors.secondary,
        fontSize: 17,
        fontWeight: '600',
        marginTop: 22,
        marginBottom: 12,
    }),

    subheading: theme => ({
        color: theme.colors.text,
        fontSize: 14,
        fontWeight: '600',
        marginTop: 12,
        marginBottom: 6,
    }),

    body: theme => ({
        color: theme.colors.text + '90',
        fontSize: 13,
        lineHeight: 21,
        marginBottom: 10,
    }),
};
