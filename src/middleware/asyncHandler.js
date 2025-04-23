import fs from 'fs'
import mongoose from 'mongoose'
import { AppError } from '../utils/appError.js'
import path from 'path'
import { deleteFile } from '../utils/file-functions.js'
import { deleteCloudImage } from '../cloud.js'

export const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => {
            console.error('🔥 Caught in asyncHandler:', err);

            let message = 'Unexpected error';
            let statusCode = 500;

            if (err instanceof AppError) {
                message = err.message;
                statusCode = err.statusCode;
            } else if (err instanceof Error) {
                message = err.message || 'Error without message';
            } else if (typeof err === 'object') {
                try {
                    message = JSON.stringify(err);
                } catch {
                    message = 'Unknown object error';
                }
            } else {
                message = String(err);
            }

            return next(new AppError(message, statusCode));
        });
    };
};

export const globalErrorHandling = async (err, req, res, next) => {
    // Rollback local file
    if (req?.file?.path) {
        deleteFile(req.file.path);
    }

    // Rollback cloud images (if any)
    if (req?.failImage) {
        if (Array.isArray(req.failImage) && req.failImage.length > 0) {
            for (const public_id of req.failImage) {
                await deleteCloudImage(public_id);
            }
        } else if (req.failImage.public_id) {
            await deleteCloudImage(req.failImage.public_id);
        }
    }

    const statusCode = err?.statusCode || 500;
    const message = err?.message || (typeof err === 'object' ? JSON.stringify(err) : 'Something went wrong');

    console.error('💥 Error:', err);

    res.status(statusCode).json({
        success: false,
        message,
    });
};
