import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJsdoc.Options = {
  definition: {
  openapi: "3.0.0",
  info: {
    title: "FaultMart API",
    version: "1.0.0",
    description: "FaultMart Marketplace API",
  },
  servers: [
    {
      url: "http://localhost:5000",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },

  security: [
    {
      bearerAuth: [],
    },
  ],
},
  apis: [
 "./src/modules/**/*.routes.ts",
 "./src/docs/schemas/*.schema.ts"
],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };