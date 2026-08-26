import { Request, Response } from 'express';
export declare const historyController: {
    getPlayHistory: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    recordPlay: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getSearchHistory: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    recordSearch: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
//# sourceMappingURL=historyController.d.ts.map