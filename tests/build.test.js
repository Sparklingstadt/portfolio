// Checks the built pages in dist/. Run `npm run build` first; skipped without dist/.
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const dist = new URL('../dist/', import.meta.url);
const site = JSON.parse(await readFile(new URL('../src/data/site.json', import.meta.url), 'utf8'));
const skip = existsSync(dist) ? false : 'dist/ not found; run npm run build';
const page = (path) => readFile(new URL(`${path}index.html`, dist), 'utf8');
const MOCKS = ['plan-b', 'plan-c', 'plan-b-a-c', 'plan-hig-material3', 'plan-desktop-macos-arch', 'plan-desktop'];
// Astro escapes text, so compare against escaped values.
const escape = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

test('main page is built in each language with its projects and certifications', { skip }, async () => {
  for (const [path, language, lang] of [['', 'ja', 'ja'], ['en/', 'en', 'en'], ['zh/', 'zh', 'zh-Hans']]) {
    const html = await page(path);
    assert.match(html, new RegExp(`<html lang="${lang}"`), `${path || '/'} lang`);
    for (const project of site.projects) {
      assert.ok(html.includes(escape(project.description[language])), `${path || '/'} misses ${project.id}`);
    }
    for (const certification of site.certifications) {
      assert.ok(html.includes(escape(certification.name[language])), `${path || '/'} misses ${certification.id}`);
    }
    for (const alternate of ['ja', 'en', 'zh-Hans', 'x-default']) {
      assert.match(html, new RegExp(`hreflang="${alternate}"`), `${path || '/'} misses hreflang ${alternate}`);
    }
  }
});

test('every mock is built with the profile and its runtime data', { skip }, async () => {
  for (const mock of MOCKS) {
    const html = await page(`proposals/mocks/${mock}/`);
    assert.match(html, /<meta name="robots" content="noindex">/, `${mock} must set noindex`);
    assert.ok(html.includes(site.profile.name), `${mock} misses the profile name`);
    assert.ok(html.includes('id="mock-data"'), `${mock} misses the inline data`);
    assert.doesNotMatch(html, /\{(text|profileText|certification)\b/, `${mock} has an unrendered expression`);
  }
  const list = await page('proposals/mocks/');
  for (const mock of MOCKS) assert.ok(list.includes(`href="${mock}/"`), `list misses ${mock}`);
});
