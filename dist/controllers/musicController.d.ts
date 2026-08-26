import { Request, Response } from 'express';
export declare const musicController: {
    getTrending: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    search: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getSong: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    streamSong: (req: Request, res: Response) => Promise<void | Response<any, Record<string, any>>>;
    getAlbum: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getArtist: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getGenres: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getGenreSongs: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getLyrics: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getNewReleases: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=musicController.d.ts.map