import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    deckOpponentContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: 1,
        borderColor: "black"
    },
    diceContainer: {
        flexDirection: "row",
        width: "70%",
        justifyContent: "space-between",
        marginBottom: 10,
    },
});
