import * as React from "react";
import { FlatList, StyleSheet, Dimensions, ListRenderItem } from "react-native";
import { Card } from "react-native-paper";

//TODO questo componente dovrebbe avere un altezza e larghezza impostate dal padre

export type ImageItemGrid = {
    id: string;
    uri: string;
};

interface FullImageGridProps {
    images: ImageItemGrid[];
    onPressImage: (imageItem: ImageItemGrid) => void;
}

const FullImageGrid: React.FC<FullImageGridProps> = ({
    images,
    onPressImage,
}) => {
    const numColumns = 3;
    const { width: screenWidth, height: screenHeight } =
        Dimensions.get("window");

    let imageSize;

    if (screenHeight > screenWidth) {
        imageSize = screenWidth / (numColumns * 1.2);
    } else {
        imageSize = screenHeight / (numColumns * 1.2);
    }

    const renderItem: ListRenderItem<ImageItemGrid> = ({ item }) => (
        <Card style={styles.card} onPress={() => onPressImage(item)}>
            <Card.Cover
                source={{ uri: item.uri }}
                style={{
                    width: imageSize,
                    height: imageSize,
                    resizeMode: "contain",
                }}
            />
        </Card>
    );

    return (
        <FlatList
            data={images}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={numColumns}
            contentContainerStyle={{ alignSelf: "center" }}
        />
    );
};

export default FullImageGrid;

const styles = StyleSheet.create({
    card: {
        margin: 4,
        elevation: 2,
        borderRadius: 8,
        overflow: "hidden",
    },
});
