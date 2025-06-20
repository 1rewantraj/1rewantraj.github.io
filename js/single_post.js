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
    const postContentUrl = `./posts/${postFilename}`;

    async function fetchPostContent(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }
        return await response.text();
    }

    try {
        const postContentHtml = await fetchPostContent(postContentUrl);
        const metadata = parsePostMetadata(postContentHtml);
        
        if (!metadata) {
            throw new Error('Invalid post format: Missing metadata');
        }

        // Set the page title
        document.title = metadata.title;

        const article = document.createElement('article');
        article.classList.add('post');

        // Create and append the title
        const titleElement = document.createElement('h1');
        titleElement.classList.add('post-title');
        titleElement.textContent = metadata.title;
        article.appendChild(titleElement);

        // Create and append the date
        const dateElement = document.createElement('p');
        dateElement.classList.add('post-meta');
        dateElement.textContent = `Published on ${new Date(metadata.date).toLocaleDateString()}`;
        article.appendChild(dateElement);

        // Create and append the description
        if (metadata.description) {
            const descriptionElement = document.createElement('p');
            descriptionElement.classList.add('post-description');
            descriptionElement.textContent = metadata.description;
            article.appendChild(descriptionElement);
        }

        // Create and append the content
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('post-content');
        // Extract content after the metadata comment
        const contentMatch = postContentHtml.match(/-->\s*\n([\s\S]*)/);
        contentDiv.innerHTML = contentMatch ? contentMatch[1].trim() : postContentHtml;
        article.appendChild(contentDiv);

        // Create and append tags if they exist
        if (metadata.tags) {
            const tagsElement = document.createElement('div');
            tagsElement.classList.add('post-tags');
            metadata.tags.split(',').forEach(tag => {
                const tagSpan = document.createElement('span');
                tagSpan.classList.add('tag');
                tagSpan.textContent = tag.trim();
                tagsElement.appendChild(tagSpan);
            });
            article.appendChild(tagsElement);
        }

        // Clear the container and append the article
        singlePostContainer.innerHTML = '';
        singlePostContainer.appendChild(article);

        // Load comments after the post is displayed
        loadComments();

    } catch (error) {
        console.error('Error loading post:', error);
        singlePostContainer.innerHTML = `
            <div class="error-message">
                <p>Error loading post: ${postFilename}</p>
                <p>Please try again later or contact the administrator if the problem persists.</p>
                <a href="./" class="back-link">← Back to Home</a>
            </div>`;
        document.title = "Error Loading Post";
    }

    // === COMMENT FUNCTIONALITY START ===
    const commentsSection = document.getElementById('comments-section');
    const existingCommentsContainer = document.getElementById('existing-comments');
    const commentForm = document.getElementById('comment-form');
    const commentTextarea = document.getElementById('comment-text');

    // Derive a unique key for Local Storage based on the post filename
    const postIdentifier = postFilename; // postFilename is available from the earlier part of the script

    function getCommentsForPost(postId) {
        const comments = localStorage.getItem(`comments_${postId}`);
        return comments ? JSON.parse(comments) : [];
    }

    function saveCommentForPost(postId, comment) {
        const comments = getCommentsForPost(postId);
        comments.push(comment);
        localStorage.setItem(`comments_${postId}`, JSON.stringify(comments));
    }

    function displayComment(comment) {
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');

        const commentText = document.createElement('p');
        commentText.textContent = comment.text;
        commentElement.appendChild(commentText);

        if (comment.date) {
            const commentDate = document.createElement('small');
            commentDate.textContent = `Posted on: ${new Date(comment.date).toLocaleString()}`;
            commentElement.appendChild(commentDate);
        }

        existingCommentsContainer.appendChild(commentElement);
    }

    function loadComments() {
        if (!postIdentifier) return; // Don't load comments if post ID is missing

        existingCommentsContainer.innerHTML = ''; // Clear previous comments
        const comments = getCommentsForPost(postIdentifier);
        if (comments.length === 0) {
            existingCommentsContainer.innerHTML = '<p>No comments yet. Be the first to comment!</p>';
        } else {
            comments.forEach(displayComment);
        }
    }

    if (commentForm) { // Ensure the form exists before adding listeners
        commentForm.addEventListener('submit', function(event) {
            event.preventDefault();
            if (!postIdentifier) {
                alert('Cannot submit comment: Post identifier is missing.');
                return;
            }

            const text = commentTextarea.value.trim();
            if (text) {
                const newComment = {
                    text: text,
                    date: new Date().toISOString()
                };
                saveCommentForPost(postIdentifier, newComment);

                // If it was the first comment, remove "No comments yet" message
                if (existingCommentsContainer.querySelector('p') && existingCommentsContainer.querySelector('p').textContent.startsWith('No comments yet')) {
                    existingCommentsContainer.innerHTML = '';
                }
                displayComment(newComment);
                commentTextarea.value = ''; // Clear textarea
            } else {
                alert('Please enter a comment.');
            }
        });
    } else {
        console.warn('Comment form not found on this page.');
    }

    // Load comments when the post content has been successfully loaded
    // We need to make sure this is called *after* singlePostContainer is populated
    // and postFilename is confirmed.
    // The existing try/catch block for post loading is a good place to hook this in.

    // The original post loading code looks like:
    // try {
    //     // ... fetch and display post ...
    //     singlePostContainer.appendChild(article); // Assuming 'article' is the post content
    //     loadComments(); // Call loadComments here
    // } catch (error) {
    //     // ... error handling ...
    // }
    // To implement this, we need to modify the existing try block.
    // The subtask should find the line `singlePostContainer.appendChild(article);`
    // and add `loadComments();` right after it.
    // It should also call `loadComments();` if the post container is being set to an error message
    // for a valid postFilename, to show 'No comments' rather than nothing.
    // However, to simplify, we'll just call it once after successful post load for now.

    // --- End of new comment functionality logic ---
});
