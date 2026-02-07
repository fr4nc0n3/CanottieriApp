import { apiCreatePlanning } from "@/global/APICalls";
import { getJWT } from "@/global/jwtStorage";
import { apiGetDateStringFormat } from "@/global/Utils";
import { ApiOutputGetPlanning } from "@/global/Types";

//crea planning
export const createPlanning = async (planning: {
    date: Date;
    description: string;
}): Promise<ApiOutputGetPlanning> => {
    console.log(`Create planning: `, planning);

    const jwt = await getJWT();

    //sarebbe meglio se le chiamate api richiederebbero Date e poi lo convertiscano a stringa in tale formato
    //it-IT prima di spedire al backend
    const dateInput = apiGetDateStringFormat(planning.date);
    const currentDateStr = apiGetDateStringFormat(new Date());

    const { id } = await apiCreatePlanning(
        { date: dateInput, description: planning.description },
        jwt,
    );

    return {
        id: id,
        date: dateInput,
        description: planning.description,
        created_at: currentDateStr,
        updated_at: currentDateStr,
    };
};
