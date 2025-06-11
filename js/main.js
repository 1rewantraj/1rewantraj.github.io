document.addEventListener('DOMContentLoaded', function() {
    const postsContainer = document.getElementById('posts-container');
    const postTemplateUrl = 'post_template.html';

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

    async function fetchPostContent(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }
        return await response.text();
    }

    async function loadPosts() {
        try {
            const templateContent = await fetchPostContent(postTemplateUrl);

            // Sort posts by date in descending order
            posts.sort((a, b) => new Date(b.date) - new Date(a.date));

            for (const post of posts) {
                const postContentHtml = await fetchPostContent(post.contentFile);

                let postHtml = templateContent;
                postHtml = postHtml.replace('{POST_TITLE}', post.title);
                postHtml = postHtml.replace('{POST_DATE}', post.date);
                postHtml = postHtml.replace('{POST_CONTENT}', postContentHtml);

                postsContainer.innerHTML += postHtml;
            }
        } catch (error) {
            console.error('Error loading posts:', error);
            postsContainer.innerHTML = '<p>Error loading posts. Please try again later.</p>';
        }
    }

    loadPosts();
});
