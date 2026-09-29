import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import type { JwtUserPayload } from '../../types/auth.js';
import { sendError } from '../utils/response';

export const verifyToken = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {

    const authHeader = req.headers.authorization;

    if (
        !authHeader ||
        !authHeader.startsWith('Bearer ')
    ) {
        sendError(
            res,
            'Akses ditolak. Token tidak ditemukan!',
            401
        );
        return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        sendError(
            res,
            'Akses ditolak. Token tidak ditemukan!',
            401
        );
        return;
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as JwtUserPayload;

        // Simpan data user ke request
        req.user = decoded;

        // Simpan user ID ke res.locals
        res.locals.userId = decoded.id;

        next();

    } catch (error) {

        console.error(
            'ERROR VERIFY TOKEN:',
            error
        );

        sendError(
            res,
            'Token tidak valid atau kedaluwarsa!',
            403
        );
    }
};

export const authenticateToken = verifyToken;