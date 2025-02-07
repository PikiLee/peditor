import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

export const mdRenderer = new MarkdownIt({
  linkify: true,
  html: true,
  breaks: true,
  typographer: true,
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${
                 hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
                 }</code></pre>`
      }
      catch {
        // Silently handle syntax highlighting failures and fall back to default highlighting
      }
    }

    return `<pre class="hljs"><code>${hljs.highlightAuto(str).value}</code></pre>`
  },
})