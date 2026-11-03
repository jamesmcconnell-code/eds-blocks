/**
 * FAQ block
 *
 * Each row is a question (first cell) and an answer (second cell).
 * Renders an accessible accordion built on <details>/<summary> and
 * generates FAQPage structured data (JSON-LD) for search engines.
 *
 * Variants:
 *  - exclusive: only one answer open at a time
 *  - open-first: first answer starts open
 *  - no-schema: skip the JSON-LD output
 */

const SCHEMA_ID = 'eds-blocks-faq-schema';
let instanceCount = 0;

/**
 * Builds the FAQPage schema object for a list of { question, answer } pairs.
 */
export function buildFaqSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
}

/**
 * Adds items to the page's single FAQPage script, creating it if needed,
 * so several FAQ blocks on one page produce one valid schema.
 */
function addSchema(items) {
  let script = document.getElementById(SCHEMA_ID);
  let existing = [];
  if (script) {
    try {
      existing = JSON.parse(script.textContent).mainEntity
        .map((q) => ({ question: q.name, answer: q.acceptedAnswer.text }));
    } catch {
      existing = [];
    }
  } else {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = SCHEMA_ID;
    document.head.append(script);
  }
  script.textContent = JSON.stringify(buildFaqSchema([...existing, ...items]));
}

export default function decorate(block) {
  instanceCount += 1;
  const groupName = `faq-${instanceCount}`;
  const exclusive = block.classList.contains('exclusive');
  const openFirst = block.classList.contains('open-first');

  const items = [...block.children]
    .map((row) => {
      const [questionCell, answerCell] = row.children;
      if (!questionCell || !answerCell) return null;
      return { questionCell, answerCell };
    })
    .filter(Boolean);

  block.textContent = '';

  const schemaItems = items.map(({ questionCell, answerCell }, index) => {
    const question = questionCell.textContent.trim();

    const details = document.createElement('details');
    details.className = 'faq-item';
    if (exclusive) details.setAttribute('name', groupName);
    if (openFirst && index === 0) details.open = true;

    const summary = document.createElement('summary');
    summary.className = 'faq-question';
    summary.textContent = question;

    const answer = document.createElement('div');
    answer.className = 'faq-answer';
    answer.append(...answerCell.childNodes);

    details.append(summary, answer);
    block.append(details);

    return { question, answer: answer.textContent.trim().replace(/\s+/g, ' ') };
  });

  if (!block.classList.contains('no-schema') && schemaItems.length) {
    addSchema(schemaItems);
  }
}
