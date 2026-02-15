
export default {
  migrations: { path: './prisma/migrations' },
  datasource: {
    db: {
      provider: 'sqlite',
      url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
    },
  },
};
