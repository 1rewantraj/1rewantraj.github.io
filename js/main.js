document.addEventListener('DOMContentLoaded', function() {
    const postsContainer = document.getElementById('posts-container');
    // postTemplateUrl is no longer needed here for full content,
    // but we might use a similar concept or inline HTML for snippets.

    const posts = [
        {
            title: 'My First Blog Post',
            date: '2023-01-15',
            contentFile: 'first-post.html' // Just the filename now
        },
        {
            title: 'Another Interesting Article',
            date: '2023-01-20',
            contentFile: 'another-post.html' // Just the filename
        }
        // Add more post objects here
    ];

    // No longer need fetchPostContent or post_template.html fetching here for full content

    async function loadPostSnippets() {
        try {
            // Sort posts by date in descending order
            posts.sort((a, b) => new Date(b.date) - new Date(a.date));

            if (posts.length === 0) {
                postsContainer.innerHTML = '<p>No posts yet. Check back soon!</p>';
                return;
            }

            for (const post of posts) {
                const postSnippetElement = document.createElement('article');
                postSnippetElement.classList.add('post-snippet'); // New class for styling snippets

                const titleElement = document.createElement('h2');
                titleElement.classList.add('post-title');
                
                // Create a link for the title
                const titleLink = document.createElement('a');
                titleLink.href = `./single_post.html?post=${encodeURIComponent(post.contentFile)}`;
                titleLink.textContent = post.title;
                titleElement.appendChild(titleLink);

                const dateElement = document.createElement('p');
                dateElement.classList.add('post-meta');
                dateElement.textContent = `Published on ${post.date}`;

                postSnippetElement.appendChild(titleElement);
                postSnippetElement.appendChild(dateElement);

                postsContainer.appendChild(postSnippetElement);
            }
        } catch (error) {
            console.error('Error loading post snippets:', error);
            postsContainer.innerHTML = '<p>Error loading posts. Please try again later.</p>';
        }
    }

    loadPostSnippets();
});
