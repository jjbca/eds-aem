/**
 * Example: /blocks/blog-card/blog-card.js
 *
 * Assumptions:
 * - The block stores the selected Content Fragment path in a cell, e.g.
 *
 *   | Blog Card |
 *   | /content/dam/my-site/blog/my-first-post |
 *
 * - Your Content Fragment model has fields like:
 *   title, date, author, summary, tags
 *
 * - The fragment is published to AEM Publish (or Preview)
 * - CORS is configured so your EDS site can call the AEM Publish/Preview host
 */

// import graphql client
import GraphQLClient from '../../scripts/graphql.js';

function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatDate(dateValue) {
  if (!dateValue) return '';
  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return dateValue;
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

function extractFragmentPath(block) {
  // If UE persisted a clickable DAM link instead, prefer href:
  const link = block.querySelector('a');
  if (link?.href) {
    try {
      // remove .html suffix if present, and decode URI
      const fragmentPath = link.href.replace(/\.html$/, '');
      const url = new URL(fragmentPath);
      return decodeURIComponent(url.pathname);
    } catch {
      return link.getAttribute('href');
    }
  }

  return 'nolink';
}

async function fetchFragmentByPath(fragmentPath) {
  return GraphQLClient.new('/global/by-path').findItems({ path: fragmentPath });
}

function renderBlogCard(fragment) {
  // set a local variable title or empty string from fragment
  const title = fragment.title ?? '';
  const summary = fragment.summary?.html ?? '';

  const author = fragment.author ?? '';
  const date = fragment.date || '';
  const tags = Array.isArray(fragment.tags) ? fragment.tags : [];

  return `
    <article>
      <div class="blog-card-body">
        ${date ? `<p class="blog-card-date">${escapeHtml(formatDate(date))}</p>` : ''}
        ${title ? `<h3 class="blog-card-title">${escapeHtml(title)}</h3>` : ''}
        ${author ? `<p class="blog-card-author">By ${escapeHtml(author)}</p>` : ''}
        ${summary ? `<p class="blog-card-summary">${summary}</p>` : ''}
        ${tags.length
    ? `
              <ul class="blog-card-tags">
                ${tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join('')}
              </ul>
            `
    : ''
}
      </div>
    </article>
  `;
}

export default async function decorate(block) {
  const fragmentPath = extractFragmentPath(block);

  if (!fragmentPath) {
    block.innerHTML = '<p>Missing Content Fragment path.</p>';
    return;
  }

  block.classList.add('loading');

  try {
    const fragment = await fetchFragmentByPath(fragmentPath);
    block.innerHTML = renderBlogCard(fragment);
  } catch (e) {
    // Keep the error visible during authoring/debugging
    block.innerHTML = `
      <p class="blog-card-error">
        Unable to load blog card content.
      </p>
    `;
    // eslint-disable-next-line no-console
    console.error('[blog-card] Content Fragment fetch failed:', e);
  } finally {
    block.classList.remove('loading');
  }
}
