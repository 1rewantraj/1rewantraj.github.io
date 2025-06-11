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

document.addEventListener('DOMContentLoaded', function() {
    async function loadPosts() {
        const postsContainer = document.getElementById('posts-container');
        if (!postsContainer) {
            console.error('Error: posts-container element not found in index.html');
            return;
        }

        // Sort posts by date in descending order (newest first)
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));

        const ul = document.createElement('ul');
        ul.className = 'posts-list'; // Optional: for styling

        for (const post of posts) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `view_post.html?post=${encodeURIComponent(post.contentFile)}`;
            a.textContent = post.title;

            const dateSpan = document.createElement('span');
            dateSpan.className = 'post-date-list'; // Optional: for styling
            dateSpan.textContent = ` (${post.date})`; // Display date next to title

            li.appendChild(a);
            li.appendChild(dateSpan);
            ul.appendChild(li);
        }
        postsContainer.innerHTML = ''; // Clear any existing content
        postsContainer.appendChild(ul);
    }
    loadPosts();
});
