export default function decorate(block) {
  const [wrapper] = block.children;
  const blockQuote = document.createElement('blockquote');
  blockQuote.textContent = wrapper.textContent.trim();
  block.replaceChild(blockQuote, wrapper);
}
