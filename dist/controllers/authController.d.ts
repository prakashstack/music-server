import { Request, Response } from 'express';
export declare const authController: {
    googleCallback: (req: Request, res: Response) => void;
    getMe: (req: Request, res: Response) => Response<any, Record<string, any>>;
    logout: (req: Request, res: Response) => Response<any, Record<string, any>>;
};
//# sourceMappingURL=authController.d.ts.map