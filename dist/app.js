"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-check
const express_1 = __importDefault(require("express"));
require('express-async-errors');
const posts_1 = require("./routes/posts");
const errorHandler_1 = require("./errorHandler");
const app = (0, express_1.default)();
// body parser (json)
app.use(express_1.default.json);
// API - applicattion prog... interface
// app.use(usersRouter)
app.use(posts_1.postsRouter);
app.use(errorHandler_1.errorHandler);
app.listen(3333);
//# sourceMappingURL=app.js.map