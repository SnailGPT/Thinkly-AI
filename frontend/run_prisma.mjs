import { execSync } from 'child_process';
import fs from 'fs';
try {
    execSync('npx prisma generate', { stdio: 'pipe' });
} catch (e) {
    const cleanStr = e.stderr.toString().replace(/\x1B\[[0-9;]*m/g, '');
    fs.writeFileSync('prisma_err.json', JSON.stringify({ err: cleanStr, out: e.stdout.toString() }));
}
