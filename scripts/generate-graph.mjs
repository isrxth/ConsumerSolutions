import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const baseDir = path.resolve('.');
const notesDir = path.join(baseDir, 'Notes');
const updatedNotesDir = path.join(baseDir, 'UpdatedNotes');
const publicDir = path.join(baseDir, 'public');

// Recursively find all markdown files
function getMarkdownFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      // Skip node_modules, .next, .venv, .obsidian
      if (!file.startsWith('.') && file !== 'node_modules' && file !== 'temp-next-app') {
        results = results.concat(getMarkdownFiles(filePath));
      }
    } else if (file.endsWith('.md')) {
      results.push(filePath);
    }
  });
  return results;
}

function generateGraph() {
  const nodes = [];
  const nodeMap = new Map(); // name (lowercase) -> node info
  
  // Only include Notes/definition/** and UpdatedNotes/** — skip root-level old lecture notes
  let files = [
    ...getMarkdownFiles(path.join(notesDir, 'definition')),
    ...getMarkdownFiles(updatedNotesDir),
  ];

  // Filter out any Rules.md
  files = files.filter(f => !path.basename(f).toLowerCase().startsWith('rules'));


  // First pass: register all nodes
  files.forEach((file) => {
    const relativePath = path.relative(baseDir, file).replace(/\\/g, '/');
    const filename = path.basename(file, '.md');
    const content = fs.readFileSync(file, 'utf-8');
    const { data: frontmatter, content: body } = matter(content);
    
    // Group name
    let group = 'General';
    if (relativePath === 'Rules.md') {
      group = 'System';
    } else if (relativePath.startsWith('UpdatedNotes/')) {
      group = 'UpdatedNotes';
    } else {
      const parts = relativePath.split('/');
      if (parts.length > 2) {
        // e.g. Notes/definition/AVP Framework.md -> group: definition
        group = parts[parts.length - 2];
      } else {
        // e.g. Notes/L1_Pilot_Notes.md -> group: Notes
        group = 'Notes';
      }
    }
    
    // Try to find the title
    let title = frontmatter.title;
    if (!title) {
      const headingMatch = body.match(/^#\s+(.+)$/m);
      if (headingMatch) {
        title = headingMatch[1].trim();
      } else {
        title = filename;
      }
    }
    
    const node = {
      id: filename,
      title: title,
      group: group,
      path: relativePath,
    };
    
    nodes.push(node);
    nodeMap.set(filename.toLowerCase(), node);
    // Also map filename with extension (e.g. "rules.md" -> rules node)
    nodeMap.set(filename.toLowerCase() + '.md', node);
  });
  
  const edges = [];
  const edgeKeys = new Set();
  
  // Second pass: extract links and construct edges
  files.forEach((file) => {
    const filename = path.basename(file, '.md');
    const content = fs.readFileSync(file, 'utf-8');
    const { content: body } = matter(content);
    
    // Find all wikilinks [[Target]] or [[Target|Alias]]
    const wikiLinkRegex = /\[\[(.*?)\]\]/g;
    let match;
    while ((match = wikiLinkRegex.exec(body)) !== null) {
      const rawLink = match[1];
      let target = rawLink.split('|')[0].trim();
      
      const targetLower = target.toLowerCase();
      
      // Resolve link
      if (nodeMap.has(targetLower)) {
        const resolvedNode = nodeMap.get(targetLower);
        
        if (resolvedNode.id === filename) {
          continue;
        }

        const edgeKey = `${filename}->${resolvedNode.id}`;
        const reverseEdgeKey = `${resolvedNode.id}->${filename}`;
        
        if (!edgeKeys.has(edgeKey) && !edgeKeys.has(reverseEdgeKey)) {
          edges.push({
            source: filename,
            target: resolvedNode.id
          });
          edgeKeys.add(edgeKey);
        }
      }
    }
  });
  
  const graphData = {
    nodes,
    edges,
    links: edges
  };
  
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(publicDir, 'graph.json'),
    JSON.stringify(graphData, null, 2),
    'utf-8'
  );
  
  console.log(`Successfully generated graph data with ${nodes.length} nodes and ${edges.length} edges in public/graph.json`);
}

generateGraph();
