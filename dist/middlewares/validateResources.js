"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateResources = void 0;
const validateResources = (schema) => {
    return (req, _res, next) => {
        try {
            const parsedData = schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            if (parsedData.body !== undefined)
                req.body = parsedData.body;
            if (parsedData.params !== undefined)
                req.params = parsedData.params;
            if (parsedData.query !== undefined) {
                Object.defineProperty(req, 'query', { value: parsedData.query });
            }
            next();
        }
        catch (err) {
            next(err);
        }
    };
};
exports.validateResources = validateResources;
