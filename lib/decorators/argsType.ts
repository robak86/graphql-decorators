import {ArgumentMapMetadata} from "../metadata/ArgumentMapMetadata";
import {Type as Klass} from "../utils/types";

export const argsType = () => {
    return <T_FUNCTION extends Klass<any>>(klass:T_FUNCTION):T_FUNCTION => {
        ArgumentMapMetadata.getOrCreateForClass(klass);
        return klass;
    }
};