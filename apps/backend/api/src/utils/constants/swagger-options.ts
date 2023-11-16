const swaggerOptions = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Cloudflare Stream Express API with Swagger',
      version: '0.1.0',
      description:
        'This is a simple CRUD API application made with Express and documented with Swagger',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'Rabra',
        url: 'https://rz-codes.com',
        email: 'rzcodes.biz@gmail.com',
      },
    },
    servers: [
      {
        url: `http://localhost:3333`,
      },
    ],
  },
  apis: ['./apps/backend/api/src/routes/*.ts'],
};
export default swaggerOptions;
