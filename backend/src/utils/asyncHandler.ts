import type { Request, RequestHandler, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";

type AsyncRequestHandler<P = ParamsDictionary> = (
    req: Request<P>,
    res: Response,
) => Promise<void>;

export const asyncHandler = <P = ParamsDictionary>(
    handler: AsyncRequestHandler<P>,
): RequestHandler<P> => {
    return (req, res, next) => {
        Promise.resolve(handler(req, res)).catch(next);
    };
};