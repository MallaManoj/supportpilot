export type Citation = {
    document_id: number;
    title: string;
    chunk_id: number;
};

export type Message = {
    id: number;
    role: "customer" | "assistant" | "user";
    content: string;
    citations?: Citation[];
};