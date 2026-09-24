// T-004: zero broken internal links (linkinator over the local QA server, external links skipped).
import { spawn } from 'node:child_process';
import { LinkChecker } from 'linkinator';

const port = 4174;
const server = spawn('node', ['qa/serve.mjs', 'dist'], { env: { ...process.env, PORT: String(port) }, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 800));
const base = `http://localhost:${port}/`;
const result = await new LinkChecker().check({ path: base, recurse: true, linksToSkip: [`^(?!${base})`, `^${base}blog`] });
server.kill();
const broken = result.links.filter((l) => l.state === 'BROKEN');
for (const l of broken) console.error(`BROKEN ${l.status} ${l.url}  (on ${l.parent})`);
console.log(`links: ${result.links.length} checked, ${broken.length} broken`);
process.exit(broken.length ? 1 : 0);
