import { defineConfig } from 'orval'

export default defineConfig({
  default: {
    input: 'http://localhost:5244/openapi/v1.json',
    output: {
      httpClient: 'axios',
      target: './src/api/index.ts',
      clean: true,
      schemas: './src/api/schemas',
      client: 'react-query',
      override: {
        mutator: {
          path: './src/lib/axios.ts',
          name: 'customInstance',
        },
        query: {
          useInvalidate: true,
        },
        useDates: true,
      },
    },
  },
})
