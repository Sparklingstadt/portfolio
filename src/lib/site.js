// Helpers that read src/data/site.json at build time.
import site from '../data/site.json';

export const { profile, certifications, projects } = site;

// Same rules the mocks' data.js applies at runtime.
const lookup = (path) => path.split('.').reduce((value, key) => value?.[key], site.text);

/** Shared mock copy by dotted key; {name} becomes the profile name. Throws on a missing key. */
export function text(key) {
  const value = lookup(key);
  if (typeof value !== 'string') throw new Error(`site.json text has no "${key}"`);
  return value.replaceAll('{name}', profile.name);
}

/** A certification name in the given language (the mocks use Japanese). */
export function certification(id, language = 'ja') {
  const value = certifications.find((item) => item.id === id)?.name[language];
  if (!value) throw new Error(`site.json has no certification "${id}" in ${language}`);
  return value;
}

export const profileText = {
  name: profile.name,
  initial: profile.name.charAt(0).toUpperCase(),
  github: `@${profile.github}`,
  email: profile.email,
};

export const profileLinks = {
  github: `https://github.com/${encodeURIComponent(profile.github)}`,
  email: `mailto:${profile.email}`,
};

/** What the mocks' data.js needs at runtime (language switching), as safe inline JSON. */
export const mockDataJson = JSON.stringify({ profile, certifications, text: site.text }).replaceAll('<', '\\u003c');
