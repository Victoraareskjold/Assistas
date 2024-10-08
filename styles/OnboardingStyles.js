import colors from './colors';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default {
    headerContainer: {
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonsContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    mainContainer: {
        backgroundColor: colors.white,
        justifyContent: 'space-between',
    },
    sectionContainer: {
        width: screenWidth,
        paddingHorizontal: 24,
    },            
    centerContainer: {
        marginTop: 24,
        justifyContent: 'space-between',
        flex: 1,
    },
    heroImage: {
        width: screenWidth - 48,
        height: 250,
        marginBottom: 24,
    },
    subHeader: {
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 1,
        textAlign: 'center',
        color: colors.default,
        width: screenWidth - 48
    },
    header: {
        fontSize: 32,
        fontWeight: 'bold',
        letterSpacing: 1,
        color: colors.default,
    },
    body: {
        fontSize: 16,
        fontWeight: '400',
        letterSpacing: 0.5,
        textAlign: 'center',
        color: colors.default,
        opacity: 0.5,
        width: screenWidth - 48,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 50,
        marginHorizontal: 4,
    },
    dotContainer: {
        marginTop: 24,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    imageContainer: {
        paddingHorizontal: 24,
        alignItems: 'center',
        marginTop: 128,
    },

    primaryBtn: {
        backgroundColor: colors.primary,
        borderRadius: 50,
        paddingVertical: 18,
        width: "80%",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },

    secondaryBtn: {
        borderRadius: 50,
        paddingVertical: 18,
        width: "80%",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 0,
    },

    linkText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: 700,
    },
    linkText2: {
        color: colors.default,
        fontSize: 14,
        fontWeight: 700,
    },
};