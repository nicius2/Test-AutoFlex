// Custom command for API requests that uses the configured apiUrl from cypress.env.json,
// avoiding hardcoded URLs in tests.
//
// Usage:  cy.apiRequest('POST', '/products', { name: 'foo', value: 100 })
// Config: set "apiUrl" in cypress.env.json  (or --env apiUrl=... on CLI)

export { };

declare global {
     namespace Cypress {
          interface Chainable {
               apiRequest(
                    method: string,
                    path: string,
                    body?: Record<string, unknown>
               ): Chainable<Response<unknown>>;
          }
     }
}

Cypress.Commands.add(
     'apiRequest',
     (method: string, path: string, body?: Record<string, unknown>) => {
          const apiUrl = Cypress.env('apiUrl') as string;
          return cy.request({
               method,
               url: `${apiUrl}${path}`,
               body,
          });
     }
);
