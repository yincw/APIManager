import React from 'react';
import PropTypes from 'prop-types';
import MarkdownIt from 'markdown-it';
import markdownItTaskLists from 'markdown-it-task-lists';
import markdownItGithubToc from 'markdown-it-github-toc';
import markdownItFootnote from 'markdown-it-footnote';
import markdownItDeflist from 'markdown-it-deflist';
import hljs from 'highlight.js';
import 'highlight.js/styles/dracula.css';
// import './less/markdown.less';

const md = new MarkdownIt({
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (error) { console.log(error); }
    }
    return ''; // use external default escaping
  }
}).use(markdownItTaskLists)
  .use(markdownItGithubToc, {
    tocFirstLevel: 2,
    tocLastLevel: 3,
    tocClassName: 'toc',
    anchorLinkSymbol: '',
    anchorLinkSpace: false,
    anchorClassName: 'anchor',
    anchorLinkSymbolClassName: 'octicon octicon-link'
  })
  .use(markdownItFootnote)
  .use(markdownItDeflist);


const Markdown = ({ content }) => (
  <div className="markdown-body" dangerouslySetInnerHTML={{ __html: md.render(content) }} /> // eslint-disable-line react/no-danger
);

Markdown.propTypes = {
  content: PropTypes.string
};

export default Markdown;
