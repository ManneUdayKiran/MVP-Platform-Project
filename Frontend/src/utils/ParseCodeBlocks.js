const parseCodeBlocks = (text) => {
  const regex = /```(\w+)?\n([\s\S]*?)```/g;
  let match;
  const blocks = [];

  while ((match = regex.exec(text)) !== null) {
    blocks.push({
      language: match[1] || "text",
      content: match[2].trim(),
    });
  }

  return blocks;
};

export default parseCodeBlocks;
