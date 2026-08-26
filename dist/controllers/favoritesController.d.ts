import { Request, Response } from 'express';
export declare const favoritesController: {
    getFavorites: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    addFavorite: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    removeFavorite: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    checkFavorite: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=favoritesController.d.ts.map