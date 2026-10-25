// Checks src/data/site.json and the translations without building the site.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const readJson = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const site = await readJson('../src/data/site.json');
const LANGUAGES = ['en', 'ja', 'zh'];

const assertLocalized = (value, label) => {
  for (const language of LANGUAGES) {
    assert.ok(typeof value?.[language] === 'string' && value[language].trim(), `${label} needs ${language}`);
  }
};

test('profile has a name, a GitHub account, and an email', () => {
  const { name, github, email } = site.profile;
  assert.ok(name?.trim());
  assert.match(github, /^[A-Za-z0-9-]+$/);
  assert.match(email, /^[^@\s]+@[^@\s]+\.[^@\s]+$/);
});

test('every project is complete in all languages and links over https', () => {
  assert.ok(site.projects.length > 0);
  const ids = new Set();
  for (const project of site.projects) {
    assert.match(project.id, /^[a-z0-9-]+$/, `bad project id ${project.id}`);
    assert.ok(!ids.has(project.id), `duplicate project id ${project.id}`);
    ids.add(project.id);
    assert.ok(project.name?.trim(), `${project.id} needs a name`);
    assertLocalized(project.category, `${project.id}.category`);
    assertLocalized(project.description, `${project.id}.description`);
    assert.ok(Array.isArray(project.stack) && project.stack.length > 0, `${project.id} needs a stack`);
    for (const link of ['app', 'source']) {
      assert.match(project.links?.[link] ?? '', /^https:\/\//, `${project.id}.links.${link} must be https`);
    }
  }
});

test('every certification has a unique id and a name in all languages', () => {
  assert.ok(site.certifications.length > 0);
  const ids = site.certifications.map(({ id }) => id);
  assert.equal(new Set(ids).size, ids.length, 'duplicate certification id');
  for (const certification of site.certifications) {
    assert.match(certification.id, /^[a-z0-9-]+$/);
    assertLocalized(certification.name, `${certification.id}.name`);
  }
});

test('shared mock text holds only non-empty strings', () => {
  const walk = (value, path) => {
    if (typeof value === 'string') return assert.ok(value.trim(), `${path} is empty`);
    assert.ok(value && typeof value === 'object', `${path} must be a string or an object`);
    for (const [key, child] of Object.entries(value)) walk(child, `${path}.${key}`);
  };
  walk(site.text, 'text');
});

test('translations share the same keys and no value is empty', async () => {
  const [en, ja, zh] = await Promise.all(LANGUAGES.map((language) => readJson(`../src/i18n/${language}.json`)));
  const keys = Object.keys(en).sort();
  for (const [language, dictionary] of Object.entries({ ja, zh })) {
    assert.deepEqual(Object.keys(dictionary).sort(), keys, `${language}.json keys differ from en.json`);
  }
  for (const [language, dictionary] of Object.entries({ en, ja, zh })) {
    for (const [key, value] of Object.entries(dictionary)) {
      assert.ok(typeof value === 'string' && value.trim(), `${language}.json "${key}" is empty`);
    }
  }
});
