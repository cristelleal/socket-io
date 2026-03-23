import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    deckPlayerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: 1,
        borderColor: "black"
    },
    rollInfoContainer: {
        marginBottom: 10,
    },
    rollInfoText: {
        fontSize: 14,
        fontStyle: "italic",
    },
    diceContainer: {
        flexDirection: "row",
        width: "70%",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    rollButton: {
        width: "30%",
        paddingVertical: 10,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black"
    },
    rollButtonText: {
        fontSize: 18,
        color: "white",
        fontWeight: "bold",
    },
});
