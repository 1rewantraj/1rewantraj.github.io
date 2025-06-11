document.addEventListener('DOMContentLoaded', async function() {
    const singlePostContainer = document.getElementById('single-post-container');

    // Get the post filename from the URL query parameter
    const params = new URLSearchParams(window.location.search);
    const postFilename = params.get('post');

    if (!postFilename) {
        singlePostContainer.innerHTML = '<p>Error: No post specified.</p>';
        return;
    }

    // Derive the post title from the filename (e.g., "first-post.html" -> "First Post")
    // This is a simple approach; more robust metadata handling might be needed for complex titles
    const postTitle = postFilename.replace('.html', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    document.title = postTitle; // Set the page title

    // Construct the path to the post content file
    const postContentUrl = `posts/${postFilename}`;

    async function fetchPostContent(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }
        return await response.text();
    }

    try {
        const postContentHtml = await fetchPostContent(postContentUrl);

        // For now, we don't have separate title and date here.
        // We'll insert the raw content. The title is set in the document's <title> tag.
        // A more advanced version might fetch metadata or expect it in the post file.

        const article = document.createElement('article');
        article.classList.add('post'); // Assuming similar styling to other posts

        const titleElement = document.createElement('h2');
        titleElement.classList.add('post-title');
        titleElement.textContent = postTitle;

        // Date is not available here with current structure, so we omit it for now.
        // One could pass it as another URL param, or include it in the post's HTML.

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('post-content');
        contentDiv.innerHTML = postContentHtml;

        article.appendChild(titleElement);
        article.appendChild(contentDiv);

        singlePostContainer.innerHTML = ''; // Clear any loading/error message
        singlePostContainer.appendChild(article);

    } catch (error) {
        console.error('Error loading post:', error);
        singlePostContainer.innerHTML = `<p>Error loading post: ${postFilename}. Please try again later.</p>`;
        document.title = "Error Loading Post";
    }
});
