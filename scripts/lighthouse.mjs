import lighthouse from '../.preview-sources/audit/node_modules/lighthouse/core/index.js';
import * as chromeLauncher from '../.preview-sources/audit/node_modules/chrome-launcher/dist/index.js';
import { writeFile } from 'node:fs/promises';
import desktopConfig from '../.preview-sources/audit/node_modules/lighthouse/core/config/desktop-config.js';

const chrome = await chromeLauncher.launch({ chromePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', chromeFlags: ['--headless', '--disable-gpu', '--no-first-run'] });
try {
  for (const mode of ['mobile', 'desktop']) {
    const options = { port: chrome.port, logLevel: 'error', output: ['json','html'], onlyCategories: ['performance','accessibility','best-practices','seo'] };
    const result = await lighthouse(process.env.PORTFOLIO_URL || 'http://127.0.0.1:3200', options, mode === 'desktop' ? desktopConfig : undefined);
    await writeFile(`artifacts/lighthouse-${mode}.json`, result.report[0]);
    await writeFile(`artifacts/lighthouse-${mode}.html`, result.report[1]);
    console.log(JSON.stringify({mode, scores:Object.fromEntries(Object.entries(result.lhr.categories).map(([k,v])=>[k,Math.round(v.score*100)])), metrics:Object.fromEntries(['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift'].map(k=>[k,result.lhr.audits[k].displayValue])), problems:Object.entries(result.lhr.audits).filter(([k,v])=>v.score !== null && v.score < .9 && v.details).map(([k,v])=>({id:k,title:v.title,displayValue:v.displayValue}))}));
  }
} finally { try { await chrome.kill(); } catch (error) { console.warn('Audit reports saved; browser temporary-profile cleanup failed:', error.code); } }
