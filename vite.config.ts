import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import aliases from './tsconfig.json';

function getViteAliasesFromPaths(configPaths) {
    const alias = Object.entries(configPaths).reduce((viteAliases, [configAlias, configPathList]) => {
        const [aliasKey] = configAlias.split('/');
        const [relativePathToDir] = configPathList[0].split('/*');
        return {
            ...viteAliases,
            [aliasKey]: path.resolve(__dirname, `./${relativePathToDir}`)
        };
    }, {});
    return alias;
}

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: getViteAliasesFromPaths(aliases.compilerOptions.paths)
    },
    plugins: [vue()]
});
