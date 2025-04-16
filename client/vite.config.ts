import { defineConfig } from 'vite'
import path from 'path';
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        watch: {
            usePolling: true,
        },
        host: true, // needed for the Docker Container port mapping to work
        strictPort: true,
        port: 3000,
    },
    //resolve: {
    //    alias: {
    //        // Create an alias for imports from the common folder
    //        '@business-partners-common': path.resolve(__dirname, '..', 'business-partners-common'),
    //    },
    //},
    //optimizeDeps: {
    //    include: ['@business-partners-common'], // Include the common utilities if necessary for optimization
    //}//,
    //build: {
    //    commonjsOptions: {
    //        include: [/business-partners-common/, /node_modules/],
    //    },
    //},
})
