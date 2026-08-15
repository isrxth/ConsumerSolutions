import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const notePath = searchParams.get('path');

  if (!notePath) {
    return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 });
  }

  const baseDir = path.resolve('.');
  // Prevent path traversal
  const normalizedPath = path.normalize(notePath).replace(/^(\.\.(\/|\\))+/, '');

  // Explicitly block access to system-level rules documentation
  if (normalizedPath.toLowerCase() === 'rules.md') {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  const absolutePath = path.join(baseDir, normalizedPath);

  // Double check it's within the workspace base directory and is a markdown file
  if (!absolutePath.startsWith(baseDir) || !absolutePath.endsWith('.md')) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  if (!fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isFile()) {
    return NextResponse.json({ error: 'Note not found' }, { status: 404 });
  }

  try {
    const fileContent = fs.readFileSync(absolutePath, 'utf-8');
    const { data: frontmatter, content } = matter(fileContent);
    const filename = path.basename(absolutePath, '.md');
    
    // Fallback title
    let title = frontmatter.title;
    if (!title) {
      const headingMatch = content.match(/^#\s+(.+)$/m);
      if (headingMatch) {
        title = headingMatch[1].trim();
      } else {
        title = filename;
      }
    }

    // Normalizing the group and path
    const normalizedGroupPath = normalizedPath.replace(/\\/g, '/');
    let groupName = 'General';
    
    if (normalizedGroupPath === 'Rules.md') {
      groupName = 'System';
    } else {
      const parts = normalizedGroupPath.split('/');
      if (parts.length > 2) {
        groupName = parts[parts.length - 2];
      } else {
        groupName = 'Notes';
      }
    }

    return NextResponse.json({
      id: filename,
      title,
      group: groupName,
      path: normalizedGroupPath,
      content,
      frontmatter,
    });
  } catch (error) {
    console.error('Error reading note file:', error);
    return NextResponse.json({ error: 'Failed to read note' }, { status: 500 });
  }
}
