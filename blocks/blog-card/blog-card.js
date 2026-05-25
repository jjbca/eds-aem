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

const AEM_HOST = 'https://publish-p178261-e1872848.adobeaemcloud.com';

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
  // Adjust this based on your authored block structure.
  // Example for a 2-row block table conversion:
  // row 0 = block label
  // row 1 = selected CF path
  const secondRow = block.children[1];
  const raw = secondRow?.textContent?.trim();

  // If UE persisted a clickable DAM link instead, prefer href:
  const link = secondRow?.querySelector('a');
  if (link?.href) {
    try {
      const url = new URL(link.href);
      return decodeURIComponent(url.pathname);
    } catch {
      return link.getAttribute('href');
    }
  }

  return raw;
}

async function fetchFragmentByPath(fragmentPath) {
  const url = `${AEM_HOST}/adobe/contentFragments?path=${encodeURIComponent(fragmentPath)}`;

  const resp = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!resp.ok) {
    throw new Error(`Failed to fetch Content Fragment: ${resp.status} ${resp.statusText}`);
  }

  const json = await resp.json();

  // When path identifies a single fragment, take the first returned item.
  const fragment = json.items?.[0];
  if (!fragment) {
    throw new Error(`No Content Fragment found for path: ${fragmentPath}`);
  }

  return fragment;
}

function renderBlogCard(fragment) {
  const fields = fragment.fields || {};

  const title = fields.title || fragment.title || '';
  const summary = fields.summary?.value ?? fields.summary ?? '';

  const author = fields.author || '';
  const date = fields.date || '';
  const tags = Array.isArray(fields.tags) ? fields.tags : [];

  return `
    <article class="blog-card">
      <div class="blog-card-body">
        ${date ? `<p class="blog-card-date">${escapeHtml(formatDate(date))}</p>` : ''}
        ${title ? `<h3 class="blog-card-title">${escapeHtml(title)}</h3>` : ''}
        ${author ? `<p class="blog-card-author">By ${escapeHtml(author)}</p>` : ''}
        ${summary ? `<p class="blog-card-summary">${escapeHtml(summary)}</p>` : ''}
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
