import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [reactRouter(), tailwindcss()],
    resolve: {
        tsconfigPaths: true,
    },
    server: {
        proxy: {
            '/api': {
                // target: 'http://172.27.157.182',
                target: 'http://192.168.5.129',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },
});
