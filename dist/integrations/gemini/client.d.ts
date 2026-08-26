export interface SearchIntent {
    category: string;
    mood: string | null;
    genre: string | null;
    language: string | null;
    artist: string | null;
}
export declare const classifySearchIntent: (query: string) => Promise<SearchIntent>;
//# sourceMappingURL=client.d.ts.map