"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const db_1 = __importDefault(require("../db"));
const bcryptjs_1 = require("bcryptjs");
exports.usersRouter = (0, express_1.Router)();
// CRUD for Users
// Read
exports.usersRouter.get('/api/users', async (req, res) => {
    const { skip, limit } = req.query;
    if (typeof skip === 'string' && typeof limit === 'string') {
        const users = await db_1.default.user.findMany({
            skip: +skip,
            take: +limit
        });
        res.send(users);
    }
    else {
        const allUsers = await db_1.default.user.findMany();
        res.send(allUsers);
    }
});
//Read
// '/api/users/12345'
exports.usersRouter.get('/api/users/:id', async (req, res) => {
    const schema = zod_1.z.number();
    const userId = await schema.safeParseAsync(+req.params.id);
    if (userId.success) {
        const user = await db_1.default.user.findUnique({
            where: {
                id: userId.data
            }
        });
        res.send(user);
    }
    else {
        res.status(400).send({ message: "Wrong userID" });
    }
});
// Create
exports.usersRouter.post('/api/users', async (req, res, next) => {
    const schema = zod_1.z.object({
        email: zod_1.z.string().email(),
        name: zod_1.z.string().max(30),
        password: zod_1.z.string().min(3).max(30)
    });
    const newUser = await schema.parseAsync(req.body);
    const passwordHash = (0, bcryptjs_1.hashSync)(newUser.password);
    const newUserDB = await db_1.default.user.create({
        data: {
            email: newUser.email,
            name: newUser.name,
            passwordHash: passwordHash
        }
    });
    res.send(newUserDB);
});
//Update (patch, put)
exports.usersRouter.patch('/api/users/:id', async (req, res, next) => {
    const schemaBody = zod_1.z.object({
        email: zod_1.z.string().email().optional(),
        name: zod_1.z.string().max(30).optional(),
        password: zod_1.z.string().min(3).max(30).optional()
    });
    const schemaUserId = zod_1.z.number();
    const userId = await schemaUserId.parseAsync(+req.params.id);
    const parsedUser = await schemaBody.parseAsync(req.body);
    const updatedUser = {};
    if (parsedUser.email)
        updatedUser.email = parsedUser.email;
    if (parsedUser.password)
        updatedUser.passwordHash = (0, bcryptjs_1.hashSync)(parsedUser.password);
    if (parsedUser.name)
        updatedUser.name = parsedUser.name;
    const updatedUserDb = await db_1.default.user.update({
        where: {
            id: +userId
        },
        data: parsedUser
    });
    res.send(updatedUserDb);
});
//Delete
exports.usersRouter.delete('/api/users/:id', async (req, res) => {
    const schemaUserId = zod_1.z.number();
    const userId = await schemaUserId.parseAsync(+req.params.id);
    const removedUser = await db_1.default.user.delete({
        where: {
            id: +userId
        }
    });
    res.send(removedUser);
});
//# sourceMappingURL=users.js.map