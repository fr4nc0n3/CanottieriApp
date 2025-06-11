//Licensed under the GNU General Public License v3. See LICENSE file for details.

import { DefaultTheme } from "react-native-paper";

const AppThemePaper = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        //primary: "lightblue",
        //accent: "blue",
        //background: "white",
        //surface: "white",
        text: "black",
        elevation: {
            ...DefaultTheme.colors.elevation,
            level1: "white",
        },
    },
};

export default AppThemePaper;
