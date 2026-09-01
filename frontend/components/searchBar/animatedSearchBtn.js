import React, {
    useMemo,
    useRef,
    useState,
} from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import {
    Dimensions,
    FlatList,
    Keyboard,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { BlurView } from "expo-blur";

import {
    TextInput,
    useTheme,
} from "react-native-paper";

import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

import {
    ArrowDownAZ,
    ArrowUpDown,
    Search,
    SlidersHorizontal,
    X,
} from "lucide-react-native";
import ToiletCard from "../cards/ToiletCards";


const { height: SCREEN_HEIGHT } =
    Dimensions.get("window");


/* -------------------------------------------------------------------------- */
/*                                  CONFIG                                    */
/* -------------------------------------------------------------------------- */

const CLOSED_WIDTH = 40;
const OPEN_WIDTH = 290;

const CLOSED_HEIGHT = 45;
const EXPANDED_HEIGHT = SCREEN_HEIGHT * 0.70;


/* -------------------------------------------------------------------------- */
/*                              SEARCH HELPERS                                */
/* -------------------------------------------------------------------------- */

const normalize = (value) => {
    return String(value ?? "")
        .toLowerCase()
        .trim();
};


const parseCoordinateQuery = (query) => {

    const cleaned = query
        .replace(/[()]/g, "")
        .trim();

    const parts = cleaned
        .split(/[,\s]+/)
        .filter(Boolean);

    if (parts.length !== 2) {
        return null;
    }

    const latitude = Number(parts[0]);
    const longitude = Number(parts[1]);

    if (
        Number.isNaN(latitude) ||
        Number.isNaN(longitude)
    ) {
        return null;
    }

    if (
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
    ) {
        return null;
    }

    return {
        latitude,
        longitude,
    };
};


const searchToilets = (
    toilets,
    query,
    filters = {}
) => {

    if (!Array.isArray(toilets)) {
        return [];
    }

    const normalizedQuery =
        normalize(query);

    const {
        amenities = [],
        minRating = 0,
    } = filters;

    const coordinateQuery =
        parseCoordinateQuery(
            normalizedQuery
        );


    return toilets.filter((toilet) => {

        /* ---------------------------- SEARCH ---------------------------- */

        let matchesSearch = true;

        if (normalizedQuery) {

            const name =
                normalize(toilet?.name);

            const street =
                normalize(
                    toilet?.address?.street ??
                    toilet?.street
                );

            const avenue =
                normalize(
                    toilet?.address?.avenue ??
                    toilet?.avenue
                );

            const description =
                normalize(
                    toilet?.description
                );

            const latitude =
                normalize(
                    toilet?.location?.latitude ??
                    toilet?.latitude
                );

            const longitude =
                normalize(
                    toilet?.location?.longitude ??
                    toilet?.longitude
                );


            matchesSearch =
                name.includes(
                    normalizedQuery
                ) ||
                street.includes(
                    normalizedQuery
                ) ||
                avenue.includes(
                    normalizedQuery
                ) ||
                description.includes(
                    normalizedQuery
                ) ||
                latitude.includes(
                    normalizedQuery
                ) ||
                longitude.includes(
                    normalizedQuery
                );


            /* ---------------------- COORDINATES ------------------------- */

            if (
                !matchesSearch &&
                coordinateQuery
            ) {

                const toiletLatitude =
                    Number(
                        toilet?.location?.latitude ??
                        toilet?.latitude
                    );

                const toiletLongitude =
                    Number(
                        toilet?.location?.longitude ??
                        toilet?.longitude
                    );


                if (
                    !Number.isNaN(
                        toiletLatitude
                    ) &&
                    !Number.isNaN(
                        toiletLongitude
                    )
                ) {

                    const latitudeDifference =
                        Math.abs(
                            toiletLatitude -
                            coordinateQuery.latitude
                        );

                    const longitudeDifference =
                        Math.abs(
                            toiletLongitude -
                            coordinateQuery.longitude
                        );


                    matchesSearch =
                        latitudeDifference <
                        0.01 &&
                        longitudeDifference <
                        0.01;
                }
            }
        }


        if (!matchesSearch) {
            return false;
        }


        /* ---------------------------- RATING --------------------------- */

        const rating =
            Number(
                toilet?.rating ?? 0
            );

        if (rating < minRating) {
            return false;
        }


        /* --------------------------- AMENITIES -------------------------- */

        if (amenities.length > 0) {

            const toiletAmenities =
                toilet?.amenities ?? [];

            const normalizedAmenities =
                toiletAmenities.map(
                    normalize
                );


            const hasAllAmenities =
                amenities.every(
                    (amenity) =>
                        normalizedAmenities.includes(
                            normalize(amenity)
                        )
                );


            if (!hasAllAmenities) {
                return false;
            }
        }


        return true;
    });
};


/* -------------------------------------------------------------------------- */
/*                                  SORT                                      */
/* -------------------------------------------------------------------------- */

const sortToilets = (
    toilets,
    sortBy
) => {

    const sorted = [...toilets];

    switch (sortBy) {

        case "rating":
            return sorted.sort(
                (a, b) =>
                    Number(
                        b?.rating ?? 0
                    ) -
                    Number(
                        a?.rating ?? 0
                    )
            );


        case "name":
            return sorted.sort(
                (a, b) =>
                    normalize(a?.name)
                        .localeCompare(
                            normalize(b?.name)
                        )
            );


        case "distance":
        default:
            return sorted;
    }
};


/* -------------------------------------------------------------------------- */
/*                              RESULT ITEM                                   */
/* -------------------------------------------------------------------------- */

function SearchResult({
    toilet,
    onPress,
    theme,
}) {

    const name =
        toilet?.name ||
        "Unnamed toilet";

    const street =
        toilet?.address?.street ??
        toilet?.street ??
        "";

    const avenue =
        toilet?.address?.avenue ??
        toilet?.avenue ??
        "";

    const latitude =
        toilet?.location?.latitude ??
        toilet?.latitude;

    const longitude =
        toilet?.location?.longitude ??
        toilet?.longitude;

    const rating =
        toilet?.rating;


    return (
        <Pressable
            onPress={() =>
                onPress?.(toilet)
            }
            style={({ pressed }) => [
                styles.result,

                {
                    backgroundColor:
                        pressed
                            ? theme.colors
                                .primary + "18"
                            : "transparent",
                },
            ]}
        >

            <View
                style={[
                    styles.resultIcon,
                    {
                        backgroundColor:
                            theme.colors
                                .primary + "12",
                    },
                ]}
            >
                <Search
                    size={17}
                    color={
                        theme.colors.primary
                    }
                />
            </View>


            <View
                style={styles.resultContent}
            >

                <Text
                    numberOfLines={1}
                    style={[
                        styles.resultTitle,
                        {
                            color:
                                theme.colors
                                    .onSurface,
                        },
                    ]}
                >
                    {name}
                </Text>


                {(street || avenue) && (

                    <Text
                        numberOfLines={1}
                        style={[
                            styles.resultAddress,
                            {
                                color:
                                    theme.colors
                                        .onSurfaceVariant,
                            },
                        ]}
                    >
                        {[avenue, street]
                            .filter(Boolean)
                            .join(" • ")}
                    </Text>

                )}


                {latitude != null &&
                    longitude != null && (

                        <Text
                            numberOfLines={1}
                            style={[
                                styles.coordinates,
                                {
                                    color:
                                        theme.colors
                                            .onSurfaceVariant,
                                },
                            ]}
                        >
                            {Number(latitude).toFixed(5)}
                            {", "}
                            {Number(longitude).toFixed(5)}

                            {rating != null &&
                                `  •  ★ ${Number(
                                    rating
                                ).toFixed(1)}`}
                        </Text>

                    )}

            </View>

        </Pressable>
    );
}


/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

export default function SearchButton({
    toilets = [],
    onSelectToilet,
}) {

    const theme = useTheme();

    const inputRef =
        useRef(null);


    /*
     * 0 = closed
     * 1 = opened bar
     * 2 = expanded results
     */

    const [panelState, setPanelState] =
        useState(0);


    const [query, setQuery] =
        useState("");


    const [filters, setFilters] =
        useState({
            amenities: [],
            minRating: 0,
        });


    const [sortBy, setSortBy] =
        useState("distance");


    /* ---------------------------------------------------------------------- */
    /*                              ANIMATION                                  */
    /* ---------------------------------------------------------------------- */

    const width =
        useSharedValue(
            CLOSED_WIDTH
        );

    const height =
        useSharedValue(
            CLOSED_HEIGHT
        );


    /* ---------------------------------------------------------------------- */
    /*                                CLOSE                                    */
    /* ---------------------------------------------------------------------- */

    const closeSearch = () => {

        Keyboard.dismiss();

        inputRef.current?.blur();

        setQuery("");

        setPanelState(0);


        height.value =
            withTiming(
                CLOSED_HEIGHT,
                {
                    duration: 180,
                }
            );


        width.value =
            withTiming(
                CLOSED_WIDTH,
                {
                    duration: 220,
                    easing:
                        Easing.inOut(
                            Easing.cubic
                        ),
                }
            );
    };


    /* ---------------------------------------------------------------------- */
    /*                              EXPAND                                     */
    /* ---------------------------------------------------------------------- */

    const expandSearch = () => {

        if (panelState === 2) {
            return;
        }

        setPanelState(2);


        height.value =
            withTiming(
                EXPANDED_HEIGHT,
                {
                    duration: 300,

                    easing:
                        Easing.out(
                            Easing.cubic
                        ),
                }
            );
    };


    /* ---------------------------------------------------------------------- */
    /*                             TOGGLE                                      */
    /* ---------------------------------------------------------------------- */

    const toggleSearch = () => {

        /* ------------------------------- CLOSED ---------------------------- */

        if (panelState === 0) {

            setPanelState(1);


            width.value =
                withTiming(
                    OPEN_WIDTH,
                    {
                        duration: 230,

                        easing:
                            Easing.out(
                                Easing.cubic
                            ),
                    }
                );


            /*
             * IMPORTANT:
             *
             * Height stays at 45.
             *
             * We DO NOT expand here.
             */

            height.value =
                withTiming(
                    CLOSED_HEIGHT,
                    {
                        duration: 200,
                    }
                );


            setTimeout(() => {
                inputRef.current?.focus();
            }, 240);

            return;
        }


        /* ------------------------------ EXPANDED --------------------------- */

        if (panelState === 2) {

            setPanelState(1);


            height.value =
                withTiming(
                    CLOSED_HEIGHT,
                    {
                        duration: 220,
                    }
                );

            return;
        }


        /* -------------------------------- OPEN ----------------------------- */

        closeSearch();
    };


    /* ---------------------------------------------------------------------- */
    /*                            TEXT CHANGE                                  */
    /* ---------------------------------------------------------------------- */

    const handleQueryChange = (
        value
    ) => {

        setQuery(value);


        /*
         * EXPAND ONLY WHEN THE USER
         * ACTUALLY STARTS TYPING.
         */

        if (
            value.trim().length > 0 &&
            panelState === 1
        ) {
            expandSearch();
        }


        /*
         * If the user deletes everything,
         * collapse the results again.
         */

        if (
            value.trim().length === 0 &&
            panelState === 2
        ) {

            setPanelState(1);

            height.value =
                withTiming(
                    CLOSED_HEIGHT,
                    {
                        duration: 220,
                    }
                );
        }
    };


    /* ---------------------------------------------------------------------- */
    /*                         ANIMATED STYLE                                  */
    /* ---------------------------------------------------------------------- */

    const containerStyle =
        useAnimatedStyle(() => ({
            width: width.value,
            height: height.value,
        }));


    /* ---------------------------------------------------------------------- */
    /*                              RESULTS                                    */
    /* ---------------------------------------------------------------------- */

    const results = useMemo(() => {

        const filtered =
            searchToilets(
                toilets,
                query,
                filters
            );


        return sortToilets(
            filtered,
            sortBy
        );

    }, [
        toilets,
        query,
        filters,
        sortBy,
    ]);


    /* ---------------------------------------------------------------------- */
    /*                           SELECT RESULT                                 */
    /* ---------------------------------------------------------------------- */

    const handleSelectToilet = (
        toilet
    ) => {

        Keyboard.dismiss();

        inputRef.current?.blur();

        onSelectToilet?.(toilet);

        setPanelState(1);

        height.value =
            withTiming(
                CLOSED_HEIGHT,
                {
                    duration: 220,
                }
            );
    };


    /* ---------------------------------------------------------------------- */
    /*                                FILTER                                   */
    /* ---------------------------------------------------------------------- */

    const handleFilterPress = () => {

        /*
         * Connect your filter sheet here later.
         */

        console.log(
            "Open filter UI"
        );
    };


    /* ---------------------------------------------------------------------- */
    /*                                  SORT                                   */
    /* ---------------------------------------------------------------------- */

    const handleSortPress = () => {

        setSortBy((current) => {

            if (
                current === "distance"
            ) {
                return "rating";
            }

            if (
                current === "rating"
            ) {
                return "name";
            }

            return "distance";
        });
    };


    /* ---------------------------------------------------------------------- */
    /*                                  UI                                     */
    /* ---------------------------------------------------------------------- */

    return (
        <SafeAreaView
            pointerEvents="box-none"
            style={styles.safeArea}
        >

            <Animated.View
                style={[
                    styles.container,

                    {
                        backgroundColor:
                            theme.colors
                                .secondaryLighter +
                            "40",

                        shadowColor: "#000",
                    },

                    containerStyle,
                ]}
            >

                <BlurView
                    intensity={8}
                    tint="dark"
                    style={
                        StyleSheet.absoluteFill
                    }
                />


                <View
                    style={styles.header}
                >

                    {/* SEARCH / CLOSE BUTTON */}

                    <Pressable
                        onPress={
                            toggleSearch
                        }
                        style={
                            styles.searchButton
                        }
                    >

                        {({ pressed }) => (

                            panelState === 0 ? (

                                <Search
                                    size={23}
                                    color={
                                        theme.colors
                                            .primary
                                    }
                                    style={{
                                        transform: [
                                            {
                                                scale:
                                                    pressed
                                                        ? 0.9
                                                        : 1,
                                            },
                                        ],
                                    }}
                                />

                            ) : (

                                <X
                                    size={21}
                                    color={
                                        theme.colors
                                            .primary
                                    }
                                />

                            )

                        )}

                    </Pressable>


                    {/* INPUT */}

                    {panelState !== 0 && (

                        <View
                            style={
                                styles.inputContainer
                            }
                        >

                            <TextInput
                                ref={inputRef}

                                mode="flat"

                                value={query}

                                onChangeText={
                                    handleQueryChange
                                }

                                placeholder="Search..."

                                placeholderTextColor={
                                    theme.colors
                                        .onSurfaceVariant
                                }

                                cursorColor={
                                    theme.colors
                                        .primary
                                }

                                selectionColor={
                                    theme.colors
                                        .primary
                                }

                                style={[
                                    styles.input,

                                    {
                                        color:
                                            theme.colors
                                                .onSurface,

                                        backgroundColor:
                                            "transparent",
                                    },
                                ]}

                                contentStyle={{
                                    paddingHorizontal: 5,
                                }}

                                underlineColor="transparent"

                                activeUnderlineColor="transparent"

                                returnKeyType="search"

                            />

                        </View>

                    )}


                    {/* FILTER */}

                    {panelState !== 0 && (

                        <Pressable
                            onPress={
                                handleFilterPress
                            }
                            style={({ pressed }) => [
                                styles.headerButton,

                                {
                                    backgroundColor:
                                        pressed
                                            ? theme.colors
                                                .primary +
                                            "20"
                                            : "transparent",
                                },
                            ]}
                        >

                            <SlidersHorizontal
                                size={19}
                                color={
                                    theme.colors
                                        .primary
                                }
                            />

                        </Pressable>

                    )}


                    {/* SORT */}

                    {panelState !== 0 && (

                        <Pressable
                            onPress={
                                handleSortPress
                            }
                            style={({ pressed }) => [
                                styles.headerButton,

                                {
                                    backgroundColor:
                                        pressed
                                            ? theme.colors
                                                .primary +
                                            "20"
                                            : "transparent",
                                },
                            ]}
                        >

                            {sortBy === "name" ? (

                                <ArrowDownAZ
                                    size={19}
                                    color={
                                        theme.colors
                                            .primary
                                    }
                                />

                            ) : (

                                <ArrowUpDown
                                    size={19}
                                    color={
                                        theme.colors
                                            .primary
                                    }
                                />

                            )}

                        </Pressable>

                    )}

                </View>



                {panelState === 2 && (

                    <View
                        style={
                            styles.resultsContainer
                        }
                    >

                        {/* RESULT HEADER */}

                        <View
                            style={[
                                styles.resultsHeader,

                                {
                                    borderBottomColor:
                                        theme.colors
                                            .outlineVariant +
                                        "35",
                                },
                            ]}
                        >

                            <Text
                                style={[
                                    styles.resultsCount,

                                    {
                                        color:
                                            theme.colors
                                                .onSurfaceVariant,
                                    },
                                ]}
                            >
                                {query
                                    ? `${results.length} ${results.length ===
                                        1
                                        ? "result"
                                        : "results"
                                    }`
                                    : `${toilets.length} toilets`}
                            </Text>


                            {query.length > 0 && (

                                <Pressable
                                    onPress={() =>
                                        handleQueryChange(
                                            ""
                                        )
                                    }
                                    hitSlop={10}
                                >

                                    <Text
                                        style={[
                                            styles.clearText,

                                            {
                                                color:
                                                    theme.colors
                                                        .primary,
                                            },
                                        ]}
                                    >
                                        Clear
                                    </Text>

                                </Pressable>

                            )}

                        </View>


                        {/* LIST */}

                        <FlatList
                            data={results}

                            keyExtractor={(
                                item,
                                index
                            ) =>
                                String(
                                    item?._id ??
                                    item?.id ??
                                    index
                                )
                            }

                            keyboardShouldPersistTaps="handled"

                            showsVerticalScrollIndicator={
                                false
                            }

                            contentContainerStyle={
                                styles.resultsList
                            }

                            renderItem={({
                                item,
                            }) => (

                                <SearchResult
                                    toilet={item}
                                    theme={theme}
                                    onPress={
                                        handleSelectToilet
                                    }
                                />

                            )}
                            
                            ListEmptyComponent={
                                
                                <View
                                style={
                                    styles.emptyContainer
                                }
                                >

                                    <Search
                                        size={30}
                                        color={
                                            theme.colors
                                                .onSurfaceVariant
                                        }
                                    />

                                    <Text
                                        style={[
                                            styles.emptyTitle,

                                            {
                                                color:
                                                    theme.colors
                                                        .onSurface,
                                            },
                                        ]}
                                    >
                                        No toilets found
                                    </Text>


                                    <Text
                                        style={[
                                            styles.emptyText,
                                            
                                            {
                                                color:
                                                    theme.colors
                                                        .onSurfaceVariant,
                                            },
                                        ]}
                                        >
                                        Try a toilet name,
                                        street, avenue,
                                        or coordinates.
                                    </Text>

                                </View>

                            }

                        />
                        
                        <ToiletCard />

                    </View>

                )}

            </Animated.View>

        </SafeAreaView>
    );
}


/* -------------------------------------------------------------------------- */
/*                                  STYLES                                    */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({

    safeArea: {
        position: "absolute",

        top: 10,

        left: 80,

        zIndex: 1000,

        pointerEvents: "box-none",
    },


    container: {
        height: CLOSED_HEIGHT,

        borderRadius: 17,

        overflow: "hidden",

        flexDirection: "column",

        shadowOffset: {
            width: 0,
            height: 8,
        },

        shadowOpacity: 0.12,

        shadowRadius: 18,

        elevation: 10,
    },


    /* ---------------------------------------------------------------------- */
    /*                              HEADER                                    */
    /* ---------------------------------------------------------------------- */

    header: {
        width: "100%",

        height: 45,

        flexDirection: "row",

        alignItems: "center",
    },


    searchButton: {
        width: 40,

        height: 45,

        justifyContent: "center",

        alignItems: "center",

        borderRadius: 17,
    },


    inputContainer: {
        flex: 1,

        height: 45,

        justifyContent: "center",

        marginLeft: 2,
    },


    input: {
        height: 45,

        paddingVertical: 0,

        fontSize: 15,
    },


    headerButton: {
        width: 38,

        height: 38,

        marginRight: 2,

        borderRadius: 13,

        justifyContent: "center",

        alignItems: "center",
    },


    /* ---------------------------------------------------------------------- */
    /*                              RESULTS                                   */
    /* ---------------------------------------------------------------------- */

    resultsContainer: {
        flex: 1,

        width: "100%",
    },


    resultsHeader: {
        height: 42,

        paddingHorizontal: 14,

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-between",

        borderBottomWidth:
            StyleSheet.hairlineWidth,
    },


    resultsCount: {
        fontSize: 12,

        fontWeight: "500",
    },


    clearText: {
        fontSize: 12,

        fontWeight: "600",
    },


    resultsList: {
        paddingTop: 4,

        paddingBottom: 15,
    },


    /* ---------------------------------------------------------------------- */
    /*                            RESULT ITEM                                 */
    /* ---------------------------------------------------------------------- */

    result: {
        minHeight: 65,

        paddingHorizontal: 12,

        paddingVertical: 8,

        flexDirection: "row",

        alignItems: "center",

        borderRadius: 14,
    },


    resultIcon: {
        width: 34,

        height: 34,

        borderRadius: 12,

        justifyContent: "center",

        alignItems: "center",
    },


    resultContent: {
        flex: 1,

        marginLeft: 5,

        justifyContent: "center",
    },


    resultTitle: {
        fontSize: 14,

        fontWeight: "600",

        marginBottom: 2,
    },


    resultAddress: {
        fontSize: 11,

        marginBottom: 2,
    },


    coordinates: {
        fontSize: 10,
    },




    emptyContainer: {
        paddingTop: 60,

        paddingHorizontal: 25,

        alignItems: "center",
    },


    emptyTitle: {
        marginTop: 12,

        fontSize: 15,

        fontWeight: "600",
    },


    emptyText: {
        marginTop: 5,

        fontSize: 12,

        textAlign: "center",

        lineHeight: 18,
    },

});