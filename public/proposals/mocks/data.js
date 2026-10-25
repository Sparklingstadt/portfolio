// Shared by every mock. Astro already renders each mock's text from
// src/data/site.json at build time; this script only keeps it in step when a
// page script changes an element's lang (the language switchers call
// MockData.render(element)). The data comes from the page's inline
// <script type="application/json" id="mock-data">. It fills:
// - [data-profile="name|initial|github|email"] text and [data-profile-link] hrefs;
// - [data-content="group.key"] text from data.text ({name} is replaced);
// - [data-content-lang="group"] text from data.text[group][element.lang];
// - [data-certification="id"] text from data.certifications (name in the page's language).
'use strict';

(() => {
  const HOOKS = '[data-profile], [data-profile-link], [data-content], [data-content-lang], [data-certification]';
  let data = null;
  try {
    data = JSON.parse(document.getElementById('mock-data').textContent);
  } catch {
    return; // Keep the text Astro wrote into the HTML.
  }

  const lookup = (path) => path.split('.').reduce((value, key) => value?.[key], data.text);
  const fill = (template) => (typeof template === 'string' ? template.replaceAll('{name}', data.profile.name) : undefined);
  const profileText = {
    name: data.profile.name,
    initial: data.profile.name.charAt(0).toUpperCase(),
    github: `@${data.profile.github}`,
    email: data.profile.email,
  };
  const profileLinks = {
    github: `https://github.com/${encodeURIComponent(data.profile.github)}`,
    email: `mailto:${data.profile.email}`,
  };

  const renderElement = (element) => {
    const { profile, profileLink, content, contentLang, certification } = element.dataset;
    let value;
    if (profile) value = profileText[profile];
    else if (content) value = fill(lookup(content));
    else if (contentLang) value = fill(lookup(`${contentLang}.${element.lang}`));
    else if (certification) {
      const language = element.closest('[lang]')?.lang || 'ja';
      value = data.certifications?.find((item) => item.id === certification)?.name[language];
    }
    if (value) element.textContent = value;
    if (profileLink && profileLinks[profileLink]) element.href = profileLinks[profileLink];
  };

  const render = (scope = document) => {
    const elements = [...scope.querySelectorAll(HOOKS)];
    if (scope instanceof Element && scope.matches(HOOKS)) elements.unshift(scope);
    elements.forEach(renderElement);
  };

  window.MockData = { render };
})();
