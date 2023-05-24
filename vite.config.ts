import react from '@vitejs/plugin-react'
import { execSync } from 'child_process'
import fs from 'fs'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
const commitHash = execSync('git rev-parse --short HEAD').toString()
const commitDate = execSync('git log -1 --format="%ad" --date=format:"%d-%m"').toString()
const repo = pkg?.repository

// https://vitejs.dev/config/
export default defineConfig({
    define: {
        __REPO__: JSON.stringify(repo),
        __COMMIT_HASH__: JSON.stringify(commitHash.trim()),
        __COMMIT_DATE__: JSON.stringify(commitDate.trim()),
    },
    plugins: [react(), svgr()],
})
