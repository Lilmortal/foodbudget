export interface Money {
    currency: string;
    amount: number;
}

export interface Ingredient {
    name: string;
    price: Money;
}
