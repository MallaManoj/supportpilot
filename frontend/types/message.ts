export type Message = {
    id: number;
    role: "customer" | "assistant";
    content: string;
};