import { COLORS } from "@/global/Colors";

export const getRaceColor = () => COLORS.fucsia100;
export const getNothingColor = () => COLORS.purple100;

export const getTrainingIntensityColor = (
    intensityPercentage: number,
): React.CSSProperties["color"] => {
    if (intensityPercentage >= 100) {
        return COLORS.red100;
    }

    if (intensityPercentage >= 75 && intensityPercentage < 100) {
        return COLORS.orange100;
    }

    if (intensityPercentage >= 50 && intensityPercentage < 75) {
        return COLORS.green100;
    }

    return COLORS.green200;
};
