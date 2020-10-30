import { Allergy, Diet } from '../recipes';

export interface User {
    id: number;
    googleId?: string;
    facebookId?: string;
    email: string;
    nickname?: string;
    password?: string;
    allergies?: Allergy[];
    diets?: Diet[];
}
