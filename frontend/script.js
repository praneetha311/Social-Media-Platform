const API_URL = 'http://localhost:3005/api';

let currentUser = null;

document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (username && password) {
    login(username, password);
  }
});

async function login(username, password) {
  const response = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
    const data = await response.json();
    currentUser = data.user;
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('feed').style.display = 'block';
    fetchPosts();
  } else {
    alert('Invalid username or password');
  }
}

async function register() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (username && password) {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      alert('Registration successful');
    } else {
      alert('Registration failed');
    }
  }
}

async function createPost() {
  const content = document.getElementById('post-content').value;

  if (content) {
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentUser.token}`,
      },
      body: JSON.stringify({ content }),
    });

    if (response.ok) {
      document.getElementById('post-content').value = '';
      fetchPosts();
    } else {
      alert('Failed to create post');
    }
  }
}

async function fetchPosts() {
  const response = await fetch(`${API_URL}/posts`);

  if (response.ok) {
    const data = await response.json();
    const postsElement = document.getElementById('posts');
    postsElement.innerHTML = '';

    data.forEach((post) => {
      const postElement = document.createElement('div');
      postElement.classList.add('post');

      const headerElement = document.createElement('div');
      headerElement.classList.add('post-header');

      const usernameElement = document.createElement('span');
      usernameElement.classList.add('post-username');
      usernameElement.textContent = post.userId.username;

      const contentElement = document.createElement('p');
      contentElement.classList.add('post-content');
      contentElement.textContent = post.content;

      const commentsElement = document.createElement('div');
      commentsElement.classList.add('post-comments');

      post.comments.forEach((comment) => {
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');

        const commentUsernameElement = document.createElement('span');
        commentUsernameElement.classList.add('comment-username');
        commentUsernameElement.textContent = comment.userId.username;

        const commentContentElement = document.createElement('span');
        commentContentElement.classList.add('comment-content');
        commentContentElement.textContent = comment.content;

        commentElement.appendChild(commentUsernameElement);
        commentElement.appendChild(commentContentElement);
        commentsElement.appendChild(commentElement);
      });

      headerElement.appendChild(usernameElement);
      postElement.appendChild(headerElement);
      postElement.appendChild(contentElement);
      postElement.appendChild(commentsElement);
      postsElement.appendChild(postElement);
    });
  } else {
    alert('Failed to fetch posts');
  }
}