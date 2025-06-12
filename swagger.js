
export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Airbean Admin API',
      version: '1.0.0',
      description: 'API-dokumentation för Airbean Admin-funktioner'
    },
    servers: [
      {
        url: 'http://localhost:8000',
        description: 'Local dev server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Product: {
          type: 'object',
          required: ['title', 'desc', 'price'],
          properties: {
            title: { type: 'string' },
            desc: { type: 'string' },
            price: { type: 'number' }
          }
        },
        User: {
          type: 'object',
          required: ['username', 'password', 'role'],
          properties: {
            username: { type: 'string' },
            password: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin'] }
          }
        }
      }
    },
    security: [{ bearerAuth: [] }],
    paths: {
    
      '/api/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Registrera ny användare',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' }
              }
            }
          },
          responses: {
            201: { description: 'Registrering lyckades' },
            400: { description: 'Fel vid registrering' }
          }
        }
      },
      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Logga in användare',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['username', 'password'],
                  properties: {
                    username: { type: 'string' },
                    password: { type: 'string' }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Inloggning lyckades – JWT-token returneras' },
            400: { description: 'Fel användarnamn eller lösenord' }
          }
        }
      },
      '/api/auth/logout': {
        get: {
          tags: ['Auth'],
          summary: 'Loggar ut användaren',
          responses: {
            200: { description: 'Utloggad' },
            400: { description: 'Ingen användare inloggad' }
          }
        }
      },

      // ========== MENU ==========
      '/api/menu': {
        post: {
          tags: ['Menu'],
          summary: 'Lägg till ny produkt (admin)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Product' }
              }
            }
          },
          responses: {
            201: { description: 'Produkt tillagd' },
            400: { description: 'Felaktiga fält' },
            403: { description: 'Endast admin har tillgång' }
          }
        },
        get: {
          tags: ['Menu'],
          summary: 'Hämta hela menyn',
          responses: {
            200: { description: 'Alla produkter returneras' },
            404: { description: 'Ingen meny hittades' }
          }
        }
      },

      '/api/menu/{prodId}': {
        put: {
          tags: ['Menu'],
          summary: 'Uppdatera en produkt (admin)',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'prodId',
              in: 'path',
              required: true,
              schema: { type: 'string' }
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Product' }
              }
            }
          },
          responses: {
            200: { description: 'Produkt uppdaterad' },
            404: { description: 'Produkten hittades inte' },
            403: { description: 'Endast admin har tillgång' }
          }
        },

        delete: {
          tags: ['Menu'],
          summary: 'Ta bort en produkt (admin)',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'prodId',
              in: 'path',
              required: true,
              schema: { type: 'string' }
            }
          ],
          responses: {
            200: { description: 'Produkt borttagen' },
            404: { description: 'Produkten hittades inte' },
            403: { description: 'Endast admin har tillgång' }
          }
        }
      }
    }
  },
  apis: []
};
