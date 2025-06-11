// Example posts data - in a real application, this would come from a backend or separate JSON files
const posts = [
    {
        title: 'My First Blog Post',
        date: '2023-01-15',
        contentFile: 'posts/first-post.html' // Path to the content file
    },
    {
        title: 'Another Interesting Article',
        date: '2023-01-20',
        contentFile: 'posts/another-post.html'
    }
    // Add more post objects here
];

document.addEventListener('DOMContentLoaded', async function() {
    const postContainer = document.getElementById('single-post-container');
    if (!postContainer) {
        console.error('Error: single-post-container element not found in view_post.html');
        return;
    }

    try {
        const queryParams = new URLSearchParams(window.location.search);
        const postContentFile = queryParams.get('post');

        if (!postContentFile) {
            postContainer.innerHTML = '<p>Error: No post specified in the URL.</p>';
            document.title = 'Error - My Simple Blog';
            return;
        }

        // Find the post metadata from the (duplicated) posts array
        const postMeta = posts.find(p => p.contentFile === postContentFile);

        if (!postMeta) {
            postContainer.innerHTML = `<p>Error: Post with identifier '${postContentFile}' not found.</p>`;
            document.title = 'Post Not Found - My Simple Blog';
            return;
        }

        // Fetch the actual post content
        const response = await fetch(postMeta.contentFile);
        if (!response.ok) {
            throw new Error(`Failed to fetch post content from ${postMeta.contentFile}: ${response.status} ${response.statusText}`);
        }
        const postContentHtml = await response.text();

        // Update the page title
        document.title = `${postMeta.title} - My Simple Blog`;

        // Populate the container
        postContainer.innerHTML = `
            <article class="post">
                <h2 class="post-title">${postMeta.title}</h2>
                <p class="post-meta">Published on <span class="post-date">${postMeta.date}</span></p>
                <div class="post-content">
                    ${postContentHtml}
                </div>
                <p><a href="index.html">Back to all posts</a></p>
            </article>
        `;

    } catch (error) {
        console.error('Error loading post:', error);
        postContainer.innerHTML = '<p>Error loading post. Please try again later or check the console.</p>';
        document.title = 'Error Loading Post - My Simple Blog';
    }
});
