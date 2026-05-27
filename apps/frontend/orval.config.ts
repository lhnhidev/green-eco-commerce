import { defineConfig } from 'orval'

export default defineConfig({
  default: {
    input: 'http://localhost:8080/openapi/v1.json',
    output: {
      httpClient: 'axios',
      target: './src/api/index.ts',
      schemas: './src/api/schemas',
      client: 'react-query',
    },
  },
})
