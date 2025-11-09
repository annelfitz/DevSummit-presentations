import YAML from 'js-yaml';
import TokenClass from 'markdown-it/lib/token.mjs';

const bracketPairs = {
  "[": "]",
  "{": "}",
  "(": ")"
};
const quotePairs = {
  "'": "'",
  '"': '"',
  "`": "`"
};
function parseProps(content) {
  content = content.trim();
  if (!content)
    return void 0;
  const props = searchProps(content);
  if (!props)
    throw new Error(`Invalid props: \`${content}\``);
  if (props.index !== content.length)
    throw new Error(`Invalid props: \`${content}\`, expected end \`}\` but got \`${content.slice(props.index)}\``);
  return props.props;
}
function searchProps(content, index = 0) {
  if (content[index] !== "{")
    throw new Error(`Invalid props, expected \`{\` but got '${content[index]}'`);
  const props = [];
  if (content[index + 1] === "{")
    return void 0;
  index += 1;
  while (index < content.length) {
    if (content[index] === "\\") {
      index += 2;
    } else if (content[index] === "}") {
      index += 1;
      break;
    } else if (content[index] === " ") {
      index += 1;
    } else if (content[index] === ".") {
      index += 1;
      props.push([
        "class",
        searchUntil(" #.}")
      ]);
    } else if (content[index] === "#") {
      index += 1;
      props.push([
        "id",
        searchUntil(" #.}")
      ]);
    } else {
      const start = index;
      while (index < content.length) {
        index += 1;
        if (" }=".includes(content[index]))
          break;
      }
      const char = content[index];
      if (start !== index) {
        const key = content.slice(start, index).trim();
        if (char === "=") {
          index += 1;
          props.push([
            key,
            searchValue()
          ]);
        } else {
          props.push([
            key,
            "true"
          ]);
        }
      }
    }
  }
  function searchUntil(str) {
    const start = index;
    while (index < content.length) {
      index += 1;
      if (content[index] === "\\")
        index += 2;
      if (str.includes(content[index]))
        break;
    }
    return content.slice(start, index);
  }
  function searchValue() {
    const start = index;
    if (content[index] in bracketPairs) {
      searchBracket(bracketPairs[content[index]]);
      index += 1;
      return content.slice(start, index);
    } else if (content[index] in quotePairs) {
      searchString(quotePairs[content[index]]);
      index += 1;
      return content.slice(start, index);
    } else {
      return searchUntil(" }");
    }
  }
  function searchBracket(end) {
    while (index < content.length) {
      index++;
      if (content[index] in quotePairs)
        searchString(quotePairs[content[index]]);
      else if (content[index] in bracketPairs)
        searchBracket(bracketPairs[content[index]]);
      else if (content[index] === end)
        return;
    }
  }
  function searchString(end) {
    return searchUntil(end);
  }
  props.forEach((v) => {
    if (v[1].match(/^(['"`]).*\1$/))
      v[1] = v[1].slice(1, -1);
  });
  return {
    props,
    index
  };
}

const RE_BLOCK_NAME = /^[a-z$][$\w.-]*/;
function parseBlockParams(str) {
  str = str.trim();
  if (!str)
    return { name: "" };
  const name = str.match(RE_BLOCK_NAME)?.[0];
  if (!name)
    throw new Error(`Invalid block params: ${str}`);
  const params = str.slice(name.length).trim();
  return {
    name,
    props: parseProps(params)
  };
}

const MarkdownItMdcBlock = (md) => {
  const min_markers = 2;
  const marker_str = ":";
  const marker_char = marker_str.charCodeAt(0);
  md.block.ruler.before(
    "fence",
    "mdc_block_shorthand",
    // eslint-disable-next-line prefer-arrow-callback
    function mdc_block_shorthand(state, startLine, endLine, silent) {
      const line = state.src.slice(state.bMarks[startLine] + state.tShift[startLine], state.eMarks[startLine]);
      if (!line.match(/^:\w/))
        return false;
      const {
        name,
        props
      } = parseBlockParams(line.slice(1));
      state.lineMax = startLine + 1;
      if (!silent) {
        const token = state.push("mdc_block_shorthand", name, 0);
        props?.forEach(([key, value]) => {
          if (key === "class")
            token.attrJoin(key, value);
          else
            token.attrSet(key, value);
        });
      }
      state.line = startLine + 1;
      return true;
    }
  );
  md.block.ruler.before(
    "fence",
    "mdc_block",
    // eslint-disable-next-line prefer-arrow-callback
    function mdc_block(state, startLine, endLine, silent) {
      var _a;
      let pos;
      let nextLine;
      let auto_closed = false;
      let start = state.bMarks[startLine] + state.tShift[startLine];
      let max = state.eMarks[startLine];
      const indent = state.sCount[startLine];
      if (state.src[start] !== ":")
        return false;
      for (pos = start + 1; pos <= max; pos++) {
        if (marker_str !== state.src[pos])
          break;
      }
      const marker_count = Math.floor(pos - start);
      if (marker_count < min_markers)
        return false;
      const markup = state.src.slice(start, pos);
      const params = parseBlockParams(state.src.slice(pos, max));
      if (!params.name)
        return false;
      if (silent)
        return true;
      nextLine = startLine;
      for (; ; ) {
        nextLine++;
        if (nextLine >= endLine) {
          break;
        }
        start = state.bMarks[nextLine] + state.tShift[nextLine];
        max = state.eMarks[nextLine];
        if (start < max && state.sCount[nextLine] < state.blkIndent) {
          break;
        }
        if (marker_char !== state.src.charCodeAt(start))
          continue;
        for (pos = start + 1; pos <= max; pos++) {
          if (marker_str !== state.src[pos])
            break;
        }
        if (pos - start !== marker_count)
          continue;
        pos = state.skipSpaces(pos);
        if (pos < max)
          continue;
        auto_closed = true;
        break;
      }
      const old_parent = state.parentType;
      const old_line_max = state.lineMax;
      state.parentType = "mdc_block";
      state.lineMax = nextLine;
      const tokenOpen = state.push("mdc_block_open", params.name, 1);
      tokenOpen.markup = markup;
      tokenOpen.block = true;
      tokenOpen.info = params.name;
      tokenOpen.map = [startLine, nextLine];
      if (params.props) {
        params.props?.forEach(([key, value]) => {
          if (key === "class")
            tokenOpen.attrJoin(key, value);
          else
            tokenOpen.attrSet(key, value);
        });
      }
      const blkIndent = state.blkIndent;
      state.blkIndent = indent;
      (_a = state.env).mdcBlockTokens || (_a.mdcBlockTokens = []);
      state.env.mdcBlockTokens.unshift(tokenOpen);
      state.md.block.tokenize(state, startLine + 1, nextLine);
      state.blkIndent = blkIndent;
      state.env.mdcBlockTokens.shift(tokenOpen);
      const tokenClose = state.push("mdc_block_close", params.name, -1);
      tokenClose.markup = state.src.slice(start, pos);
      tokenClose.block = true;
      state.tokens.slice(
        state.tokens.indexOf(tokenOpen) + 1,
        state.tokens.indexOf(tokenClose)
      ).filter((i) => i.level === tokenOpen.level + 1).forEach((i, _, arr) => {
        if (arr.length <= 2 && i.tag === "p")
          i.hidden = true;
      });
      state.parentType = old_parent;
      state.lineMax = old_line_max;
      state.line = nextLine + (auto_closed ? 1 : 0);
      return true;
    },
    {
      alt: ["paragraph", "reference", "blockquote", "list"]
    }
  );
  md.block.ruler.after(
    "code",
    "mdc_block_yaml",
    // eslint-disable-next-line prefer-arrow-callback
    function mdc_block_yaml(state, startLine, endLine, silent) {
      if (!state.env.mdcBlockTokens?.length)
        return false;
      const start = state.bMarks[startLine] + state.tShift[startLine];
      const end = state.eMarks[startLine];
      if (state.src.slice(start, end) !== "---")
        return false;
      let lineEnd = startLine + 1;
      let found = false;
      while (lineEnd < endLine) {
        const line = state.src.slice(state.bMarks[lineEnd] + state.tShift[startLine], state.eMarks[lineEnd]);
        if (line === "---") {
          found = true;
          break;
        }
        lineEnd += 1;
      }
      if (!found)
        return false;
      if (!silent) {
        const yaml = state.src.slice(state.bMarks[startLine + 1], state.eMarks[lineEnd - 1]);
        const data = YAML.load(yaml);
        const token = state.env.mdcBlockTokens[0];
        Object.entries(data).forEach(([key, value]) => {
          if (key === "class")
            token.attrJoin(key, value);
          else
            token.attrSet(key, typeof value === "string" ? value : JSON.stringify(value));
        });
      }
      state.line = lineEnd + 1;
      state.lineMax = lineEnd + 1;
      return true;
    }
  );
  md.block.ruler.after(
    "code",
    "mdc_block_slots",
    // eslint-disable-next-line prefer-arrow-callback
    function mdc_block(state, startLine, endLine, silent) {
      if (!state.env.mdcBlockTokens?.length)
        return false;
      const start = state.bMarks[startLine] + state.tShift[startLine];
      if (!(state.src[start] === "#" && state.src[start + 1] !== " "))
        return false;
      const line = state.src.slice(start, state.eMarks[startLine]);
      const {
        name,
        props
      } = parseBlockParams(line.slice(1));
      let lineEnd = startLine + 1;
      while (lineEnd < endLine) {
        const line2 = state.src.slice(state.bMarks[lineEnd] + state.tShift[startLine], state.eMarks[lineEnd]);
        if (line2.match(/^#(\w)+/) || line2.startsWith("::"))
          break;
        lineEnd += 1;
      }
      if (silent) {
        state.line = lineEnd;
        state.lineMax = lineEnd;
        return true;
      }
      state.lineMax = startLine + 1;
      const slot = state.push("mdc_block_slot", "template", 1);
      slot.attrSet(`#${name}`, "");
      props?.forEach(([key, value]) => {
        if (key === "class")
          slot.attrJoin(key, value);
        else
          slot.attrSet(key, value);
      });
      state.line = startLine + 1;
      state.lineMax = lineEnd;
      state.md.block.tokenize(state, startLine + 1, lineEnd);
      state.push("mdc_block_slot", "template", -1);
      state.line = lineEnd;
      state.lineMax = lineEnd;
      return true;
    }
  );
};

const MarkdownItInlineProps = (md) => {
  md.inline.ruler.after("entity", "mdc_inline_props", (state, silent) => {
    const start = state.pos;
    const char = state.src[start];
    if (char !== "{")
      return false;
    if (state.src[start + 1] === "{" || state.src[start - 1] === "{" || state.src[start - 1] === "$")
      return false;
    const search = searchProps(state.src, start);
    if (!search)
      return false;
    const {
      props,
      index: end
    } = search;
    if (end === start)
      return false;
    if (silent)
      return true;
    const token = state.push("mdc_inline_props", "span", 0);
    token.attrs = props;
    token.hidden = true;
    state.pos = end;
    return true;
  });
  md.renderer.rules.mdc_inline_props = () => {
    return "";
  };
  const _parse = md.parse;
  md.parse = function(src, env) {
    const tokens = _parse.call(this, src, env);
    tokens.forEach((token, index) => {
      const prev = tokens[index - 1];
      const next = tokens[index + 1];
      if (!["heading_open", "paragraph_open", "list_item_open"].includes(prev?.type) || prev.hidden)
        return;
      if (token.hidden && next.type === "inline")
        token = next;
      if (token.type === "inline" && token.children?.length === 2 && token.children[0].type === "text" && token.children[1].type === "mdc_inline_props") {
        const props = token.children[1].attrs;
        token.children.splice(1, 1);
        props?.forEach(([key, value]) => {
          if (key === "class")
            prev.attrJoin("class", value);
          else
            prev.attrSet(key, value);
        });
      }
    });
    tokens.forEach((tokenOpen, index) => {
      if (tokenOpen.type !== "bullet_list_open")
        return;
      const prev = tokens[index - 1];
      if (!prev || prev.type !== "mdc_block_open" || prev.tag !== "ul")
        return;
      let closeIndex = index + 1;
      while (closeIndex < tokens.length) {
        const close = tokens[closeIndex];
        if (close.type === "bullet_list_close" && close.level === tokenOpen.level)
          break;
        closeIndex += 1;
      }
      const tokenClose = tokens[closeIndex];
      if (tokenClose.type !== "bullet_list_close")
        return;
      const next = tokens[closeIndex + 1];
      if (next.type === "mdc_block_close" && next.tag === "ul") {
        tokenOpen.hidden = true;
        tokenClose.hidden = true;
      }
    });
    return tokens;
  };
  const _renderInline = md.renderer.renderInline;
  md.renderer.renderInline = function(tokens, options, env) {
    tokens = [...tokens];
    tokens.forEach((token, index) => {
      if (token.type === "mdc_inline_props") {
        let prevIndex = index - 1;
        let prev = tokens[prevIndex];
        while (prevIndex >= 0) {
          if (prev.type === "text" && !prev.content.trim()) {
            prevIndex--;
            prev = tokens[prevIndex];
          } else {
            break;
          }
        }
        if (!prev.tag && prev.type === "text") {
          prev = new TokenClass("mdc_inline_span", "span", 1);
          tokens.splice(index - 1, 0, prev);
          const close = new TokenClass("mdc_inline_span", "span", -1);
          tokens.splice(index + 2, 0, close);
        } else if (prev.nesting === -1) {
          let searchIndex = index - 1;
          while (searchIndex >= 0) {
            const searchToken = tokens[searchIndex];
            if (searchToken.nesting === 1 && searchToken.tag === prev.tag && searchToken.level === prev.level) {
              prev = searchToken;
              break;
            }
            searchIndex--;
          }
        }
        if (prev.nesting === -1)
          throw new Error(`No matching opening tag found for ${JSON.stringify(prev)}`);
        token.attrs?.forEach(([key, value]) => {
          if (key === "class")
            prev.attrJoin("class", value);
          else
            prev.attrSet(key, value);
        });
      }
    });
    return _renderInline.call(this, tokens, options, env);
  };
};

const MarkdownItInlineComponent = (md) => {
  md.inline.ruler.after("entity", "mdc_inline_component", (state, silent) => {
    const start = state.pos;
    const char = state.src[start];
    if (!(char === ":" && state.src[start - 1] === " "))
      return false;
    let index = start + 1;
    let contentStart = -1;
    let contentEnd = -1;
    while (index < state.src.length) {
      const char2 = state.src[index];
      if (char2 === "[") {
        contentStart = index + 1;
        while (index < state.src.length) {
          index += 1;
          if (state.src[index] === "\\")
            index += 2;
          if (state.src[index] === "]") {
            contentEnd = index;
            index += 1;
            break;
          }
        }
        break;
      }
      if (!/[\w$\-]/.test(char2))
        break;
      index += 1;
    }
    if (index <= start + 1)
      return false;
    if (silent)
      return true;
    if (contentEnd !== contentStart) {
      const name = state.src.slice(start + 1, contentStart - 1);
      const body = state.src.slice(contentStart, contentEnd);
      state.push("mdc_inline_component", name, 1);
      const text = state.push("text", "", 0);
      text.content = body;
      state.push("mdc_inline_component", name, -1);
    } else {
      const name = state.src.slice(start + 1, index);
      state.push("mdc_inline_component", name, 0);
    }
    state.pos = index;
    return true;
  });
};

const MarkdownItInlineSpan = (md) => {
  md.inline.ruler.after("mdc_inline_props", "mdc_inline_span", (state, silent) => {
    const start = state.pos;
    const char = state.src[start];
    if (char !== "[")
      return false;
    let index = start + 1;
    while (index < state.src.length) {
      if (state.src[index] === "\\")
        index += 2;
      if (state.src[index] === "]")
        break;
      index += 1;
    }
    if (index === start)
      return false;
    if (silent)
      return true;
    state.push("mdc_inline_span", "span", 1);
    const text = state.push("text", "", 0);
    text.content = state.src.slice(start + 1, index);
    state.push("mdc_inline_span", "span", -1);
    state.pos = index + 1;
    return true;
  });
};

const MarkdownItMdc = (md, options = {}) => {
  const {
    blockComponent = true,
    inlineProps = true,
    inlineSpan = true,
    inlineComponent = true
  } = options.syntax || {};
  if (blockComponent)
    md.use(MarkdownItMdcBlock);
  if (inlineProps)
    md.use(MarkdownItInlineProps);
  if (inlineSpan)
    md.use(MarkdownItInlineSpan);
  if (inlineComponent)
    md.use(MarkdownItInlineComponent);
};

export { MarkdownItMdc as default };
