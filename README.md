# My Simple GitHub Blog

This is a simple blog system that uses GitHub Pages to host a static website. Blog posts are loaded dynamically using JavaScript.

## Features

*   Posts are written in simple HTML.
*   Posts are listed on the main page, newest first.
*   Uses a template for consistent post formatting.

## How to Add a New Blog Post

To add a new blog post, follow these steps:

1.  **Create the Post Content File:**
    *   Navigate to the `posts/` directory in your repository.
    *   Create a new HTML file for your post content. For example, `2023-10-27-my-new-post.html`.
    *   Write the content of your blog post directly in this HTML file. This file should *only* contain the content itself (e.g., paragraphs, images), not the full HTML page structure.
        ```html
        <p>This is the beginning of my new blog post.</p>
        <p>Here is another paragraph with more details.</p>
        ```

2.  **Update `js/main.js`:**
    *   Open the `js/main.js` file in the root of your repository.
    *   Locate the `posts` array. It looks like this:
        ```javascript
        const posts = [
            // ... other posts
        ];
        ```
    *   Add a new JavaScript object to this array for your new post. **Make sure to add it as the first element in the array if you want it to appear at the top before sorting, though the script now sorts by date.** The important fields are:
        *   `title`: The title of your blog post (string).
        *   `date`: The publication date of your post in 'YYYY-MM-DD' format (string). This is crucial for correct sorting.
        *   `contentFile`: The path to the HTML content file you created in step 1 (e.g., `'posts/2023-10-27-my-new-post.html'`).

    *   Example of adding a new post to the array:
        ```javascript
        const posts = [
            {
                title: 'My New Awesome Post',
                date: '2023-10-27',
                contentFile: 'posts/2023-10-27-my-new-post.html'
            },
            // ... other existing posts (ensure a comma separates objects)
            {
                title: 'Another Interesting Article',
                date: '2023-01-20',
                contentFile: 'posts/another-post.html'
            },
            {
                title: 'My First Blog Post',
                date: '2023-01-15',
                contentFile: 'posts/first-post.html'
            }
        ];
        ```
    *   **Note:** The script will automatically sort posts by the `date` field in reverse chronological order (newest first).

3.  **Commit and Push Changes:**
    *   Save both the new content file in the `posts/` directory and the modified `js/main.js` file.
    *   Commit these changes to your Git repository and push them to GitHub.
        ```bash
        git add posts/your-new-post-file.html js/main.js
        git commit -m "Add new blog post: [Your Post Title]"
        git push
        ```

Your new blog post should now appear on the website.

## Viewing Your Blog (Setting up GitHub Pages)

To make your blog accessible online, you need to enable GitHub Pages for this repository:

1.  **Go to Repository Settings:**
    *   Navigate to the main page of your repository on GitHub.
    *   Click on the "Settings" tab (usually near the top right).

2.  **Navigate to Pages Settings:**
    *   In the left sidebar of the Settings page, click on "Pages".

3.  **Configure GitHub Pages:**
    *   **Source:** Under "Build and deployment", for "Source", select "Deploy from a branch".
    *   **Branch:**
        *   Choose the branch you want to deploy from (e.g., `main` or `master`).
        *   For the folder, select `/ (root)`.
    *   Click "Save".

4.  **Access Your Blog:**
    *   GitHub Pages will build your site. This might take a minute or two.
    *   Once deployed, GitHub will display the URL for your live blog at the top of the Pages settings. It will typically be in the format:
        `https://<your-username>.github.io/<your-repository-name>/`
    *   If you are using `index.html` as the main page, this URL should take you directly to your blog.

    *   **Note:** It might take a few minutes for the site to become live after saving the settings. If you see a 404 error, wait a bit and try refreshing. Also, ensure your `index.html` is in the root of the branch you selected.

Your blog should now be live at the provided URL!
