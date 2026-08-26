export declare const musicService: {
    getTrending(): Promise<any[]>;
    search(query: string, type?: string, page?: number): Promise<any>;
    getSong(id: string, refresh?: boolean): Promise<any>;
    getAlbum(id: string): Promise<any>;
    getArtist(id: string): Promise<any>;
    getGenreSongs(genre: string): Promise<any[]>;
    getGenres(): {
        id: string;
        name: string;
        query: string;
        color: string;
    }[];
    getLyrics(id: string): Promise<any>;
    getNewReleases(): Promise<any[]>;
};
//# sourceMappingURL=musicService.d.ts.map