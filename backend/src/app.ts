import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import crypto from 'crypto';

import routes from './routes/index';

import { sendError } from './utils/response';

const app = express();


// CORS
app.use(
    cors({
        exposedHeaders: ['X-Request-Id']
    })
);

app.use(express.json());


// Middleware 1 — membuat Request ID unik
app.use(
    (
        req: Request,
        res: Response,
        next: NextFunction
    ): void => {
        const requestId = crypto.randomUUID();

        res.setHeader(
            'X-Request-Id',
            requestId
        );

        res.locals.requestId = requestId;

        next();
    }
);


// Middleware 2 — menampilkan log berdasarkan Request ID
app.use(
    (
        req: Request,
        res: Response,
        next: NextFunction
    ): void => {
        const requestId = res.locals.requestId;

        console.log(
            `[${requestId}] ${req.method} ${req.originalUrl}`
        );

        next();
    }
);


// Route utama — cek apakah server berjalan
app.get('/', (req: Request, res: Response) => {
    sendError(
        res,
        'Backend Todo Praktikum Berjalan Mulus!',
        200
    );
});


// Daftarkan semua route dengan prefix /api
app.use('/api', routes);


// 404 Handler
app.use(
    (
        req: Request,
        res: Response
    ): void => {
        sendError(
            res,
            `Route ${req.method} ${req.url} tidak ditemukan!`,
            404
        );
    }
);


// Global Error Handler
app.use(
    (
        err: Error,
        req: Request,
        res: Response,
        next: NextFunction
    ): void => {
        console.error(
            `[${res.locals.requestId}] Terjadi error:`,
            err.message
        );

        sendError(
            res,
            'Terjadi kesalahan pada server.',
            500
        );
    }
);


export default app;