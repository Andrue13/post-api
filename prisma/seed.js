// @ts-check
const { PrismaClient } = require("@prisma/client")
const bcryptjs = require('bcryptjs')
const db = new PrismaClient()
seed()
async function seed() {
    await db.user.deleteMany()
    await db.post.deleteMany()
    await db.user.createMany({
        data: [
            {
                id: 1,
                email: 'test1@mail.ru',
                name: 'Wade1',
                passwordHash: bcryptjs.hashSync('test123'),
                isAdmin: true
            },
            {
                id: 2,
                email: 'test2@mail.ru',
                name: 'Wade2',
                passwordHash: bcryptjs.hashSync('test123'),
                isAdmin: false
            },
            {
                id: 3,
                email: 'test4@mail.ru',
                name: 'Wade3',
                passwordHash: bcryptjs.hashSync('test123'),
                isAdmin: false
            },
            {
                id: 4,
                email: 'test5@mail.ru',
                name: 'Wade4',
                passwordHash: bcryptjs.hashSync('test123'),
                isAdmin: false
            },
            {
                id: 5,
                email: 'test7@mail.ru',
                name: 'Wade5',
                passwordHash: bcryptjs.hashSync('test123'),
                isAdmin: false
            }
        ]
    })
    await db.post.createMany({
        data: [
            {
                id:1,
                userId: 1,
                "title": "Why It’s Important to Have a Growth Mindset",
                "text": "Some text"

            },

            {
                id:2,
                userId: 1,
                "title": "The Benefits of Meditation for Your Health",
                "text": "Some text"

            },

            {
                id:3,
                userId: 1,
                "title": "Simple Ways to Reduce Stress",
                "text": "Some text"

            },

            {
                id:4,
                userId: 1,
                "title": "How to Stay Productive When Working Remotely",
                "text": "Some text"

            },

            {
                id:5,
                userId: 2,
                "title": "10 Healthy Habits to Adopt Today",
                "text": "Some text"

            },

            {
                id:6,
                userId: 2,
                "title": "Ways to Boost Your Immune System Naturally",
                "text": "Some text"

            },

            {
                id:7,
                userId: 2,
                "title": "The Benefits of Getting Enough Sleep",
                "text": "Some text"

            },

            {
                id:8,
                userId: 2,
                "title": "How to Create a Morning Routine That Works for You",
                "text": "Some text"

            },

            {
                id:9,
                userId: 3,
                "title": "Tips for Cultivating a Positive Attitude",
                "text": "Some text"

            },

            {
                id:10,
                userId: 3,
                "title": "Why Volunteering Is Good for Your Health",
                "text": "Some text"

            },

            {
                id:11,
                userId: 3,
                "title": "How to Overcome Procrastination",
                "text": "Some text"

            },

            {
                id:12,
                userId: 3,
                "title": "The Benefits of Positive Thinking",
                "text": "Some text"

            },

            {
                id:13,
                userId: 4,
                "title": "Ways to Stay Motivated During Difficult Times",
                "text": "Some text"

            },

            {
                id:14,
                userId: 4,
                "title": "The Importance of Personal Development",
                "text": "Some text"

            },

            {
                id:15,
                userId: 4,
                "title": "Why Exercise Is Good for Your Mental Health",
                "text": "Some text"

            },

            {
                id:16,
                userId: 4,
                "title": "How to Build Strong Relationships with Your Family and Friends",
                "text": "Some text"

            },

            {
                id:17,
                userId: 5,
                "title": "The Benefits of a Healthy Diet",
                "text": "Some text"

            },

            {
                id:18,
                userId: 5,
                "title": "How to Deal with Anxiety",
                "text": "Some text"

            },

            {
                id:19,
                userId: 5,
                "title": "The Importance of Having Fun",
                "text": "Some text"

            },

            {
                id:20,
                userId: 5,
                "title": "How to Improve Your Communication Skills",
                "text": "Some text"

            }

        ]
    })
}