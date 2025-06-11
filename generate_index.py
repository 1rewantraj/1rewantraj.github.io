#!/usr/bin/env python3
import os
import re
from datetime import datetime
import html

def parse_post_metadata(content):
    """Parse metadata from post content."""
    metadata_match = re.search(r'<!--\s*\n([\s\S]*?)\n-->', content)
    if not metadata_match:
        return None

    metadata = {}
    metadata_lines = metadata_match.group(1).split('\n')
    
    for line in metadata_lines:
        if ':' in line:
            key, value = line.split(':', 1)
            metadata[key.strip()] = value.strip()
    
    return metadata

def extract_post_content(content):
    """Extract post content after metadata."""
    content_match = re.search(r'-->\s*\n([\s\S]*)', content)
    return content_match.group(1).strip() if content_match else content

def generate_html(posts):
    """Generate the HTML content for index.html."""
    # Sort posts by date (newest first)
    posts.sort(key=lambda x: datetime.strptime(x['date'], '%Y-%m-%d'), reverse=True)
    
    # Generate the HTML content
    html_content = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rewant's Episodes of Life</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <header>
        <h1>Rewant's Episodes of Life</h1>
    </header>
    <main id="posts-container">
'''

    # Add each post
    for post in posts:
        html_content += f'''
        <article class="post">
            <header class="post-header">
                <h2 class="post-title">{html.escape(post['title'])}</h2>
                <p class="post-meta">Published on {datetime.strptime(post['date'], '%Y-%m-%d').strftime('%B %d, %Y')}</p>
                <p class="post-description">{html.escape(post['description'])}</p>
                <div class="post-tags">
'''
        # Add tags
        for tag in post['tags']:
            html_content += f'                    <span class="tag">{html.escape(tag)}</span>\n'
        
        html_content += '''                </div>
            </header>
            <div class="post-content">
'''
        # Add post content
        html_content += f"                {post['content']}\n"
        
        html_content += '''            </div>
            <hr class="post-separator">
        </article>
'''

    # Close the HTML
    html_content += '''    </main>
    <footer>
        <p>&copy; 2025 rewantraj</p>
    </footer>
</body>
</html>'''

    return html_content

def main():
    """Main function to generate index.html."""
    posts_dir = 'posts'
    posts = []

    # Read all posts
    for filename in os.listdir(posts_dir):
        if filename.endswith('.html'):
            with open(os.path.join(posts_dir, filename), 'r', encoding='utf-8') as f:
                content = f.read()
                metadata = parse_post_metadata(content)
                if metadata:
                    posts.append({
                        'title': metadata.get('title', ''),
                        'date': metadata.get('date', ''),
                        'description': metadata.get('description', ''),
                        'tags': [tag.strip() for tag in metadata.get('tags', '').split(',')],
                        'content': extract_post_content(content)
                    })

    # Generate and write index.html
    html_content = generate_html(posts)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html_content)

    print("index.html has been generated successfully!")

if __name__ == '__main__':
    main() 