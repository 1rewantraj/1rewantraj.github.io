document.addEventListener('DOMContentLoaded', function() {
    const postsContainer = document.getElementById('posts-container');
    const searchInput = document.getElementById('search-input');
    const tagFilter = document.getElementById('tag-filter');

    // Function to parse post metadata from content
    function parsePostMetadata(content) {
        const metadataMatch = content.match(/<!--\s*\n([\s\S]*?)\n-->/);
        if (!metadataMatch) return null;

        const metadata = {};
        const metadataLines = metadataMatch[1].split('\n');
        
        metadataLines.forEach(line => {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length) {
                const value = valueParts.join(':').trim();
                metadata[key.trim()] = value;
            }
        });

        return metadata;
    }

    // Function to extract content after metadata
    function extractPostContent(content) {
        const contentMatch = content.match(/-->\s*\n([\s\S]*)/);
        return contentMatch ? contentMatch[1].trim() : content;
    }

    // Function to fetch and process all posts
    async function fetchAllPosts() {
        try {
            const response = await fetch('./posts/');
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const links = Array.from(doc.querySelectorAll('a'));
            
            const posts = [];
            for (const link of links) {
                if (link.href.endsWith('.html')) {
                    const filename = link.href.split('/').pop();
                    const response = await fetch(`./posts/${filename}`);
                    const content = await response.text();
                    const metadata = parsePostMetadata(content);
                    
                    if (metadata) {
                        posts.push({
                            title: metadata.title,
                            date: metadata.date,
                            description: metadata.description,
                            tags: metadata.tags ? metadata.tags.split(',').map(tag => tag.trim()) : [],
                            content: extractPostContent(content)
                        });
                    }
                }
            }
            return posts;
        } catch (error) {
            console.error('Error fetching posts:', error);
            return [];
        }
    }

    // Function to render posts
    function renderPosts(posts) {
        postsContainer.innerHTML = '';
        
        if (posts.length === 0) {
            postsContainer.innerHTML = '<p class="no-posts">No posts found. Check back soon!</p>';
            return;
        }

        // Sort posts by date (newest first)
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Create tag filter if it doesn't exist
        if (!tagFilter.querySelector('select')) {
            const allTags = new Set(posts.flatMap(post => post.tags));
            const select = document.createElement('select');
            select.innerHTML = '<option value="">All Tags</option>' + 
                Array.from(allTags).map(tag => 
                    `<option value="${tag}">${tag}</option>`
                ).join('');
            tagFilter.appendChild(select);
        }

        posts.forEach(post => {
            const postElement = document.createElement('article');
            postElement.classList.add('post');

            // Create post header
            const headerElement = document.createElement('header');
            headerElement.classList.add('post-header');

            const titleElement = document.createElement('h2');
            titleElement.classList.add('post-title');
            titleElement.textContent = post.title;

            const dateElement = document.createElement('p');
            dateElement.classList.add('post-meta');
            dateElement.textContent = `Published on ${new Date(post.date).toLocaleDateString()}`;

            const descriptionElement = document.createElement('p');
            descriptionElement.classList.add('post-description');
            descriptionElement.textContent = post.description;

            const tagsElement = document.createElement('div');
            tagsElement.classList.add('post-tags');
            post.tags.forEach(tag => {
                const tagSpan = document.createElement('span');
                tagSpan.classList.add('tag');
                tagSpan.textContent = tag;
                tagsElement.appendChild(tagSpan);
            });

            headerElement.appendChild(titleElement);
            headerElement.appendChild(dateElement);
            headerElement.appendChild(descriptionElement);
            headerElement.appendChild(tagsElement);

            // Create post content
            const contentElement = document.createElement('div');
            contentElement.classList.add('post-content');
            contentElement.innerHTML = post.content;

            // Add a separator between posts
            const separator = document.createElement('hr');
            separator.classList.add('post-separator');

            postElement.appendChild(headerElement);
            postElement.appendChild(contentElement);
            postElement.appendChild(separator);

            postsContainer.appendChild(postElement);
        });
    }

    // Function to filter posts
    function filterPosts(posts, searchTerm, selectedTag) {
        return posts.filter(post => {
            const matchesSearch = searchTerm === '' || 
                post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.content.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesTag = selectedTag === '' || 
                post.tags.includes(selectedTag);

            return matchesSearch && matchesTag;
        });
    }

    // Initialize the blog
    let allPosts = [];
    fetchAllPosts().then(posts => {
        allPosts = posts;
        renderPosts(posts);
    });

    // Add search functionality
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value;
            const selectedTag = tagFilter.querySelector('select')?.value || '';
            const filteredPosts = filterPosts(allPosts, searchTerm, selectedTag);
            renderPosts(filteredPosts);
        });
    }

    // Add tag filter functionality
    if (tagFilter) {
        tagFilter.addEventListener('change', (e) => {
            if (e.target.tagName === 'SELECT') {
                const selectedTag = e.target.value;
                const searchTerm = searchInput?.value || '';
                const filteredPosts = filterPosts(allPosts, searchTerm, selectedTag);
                renderPosts(filteredPosts);
            }
        });
    }
});
