import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    dice: {
        width: 40,
        height: 40,
        backgroundColor: "#ffffff",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: '#bad4e6',
    },
    lockedDice: {
        backgroundColor: "#f7c5b7",
        borderColor: '#e8a796',
    },
    diceText: {
        fontSize: 20,
        fontWeight: "bold",
        color: '#304255',
    },
});
