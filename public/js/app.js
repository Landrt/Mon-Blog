document.addEventListener('DOMContentLoaded', () => {
    const API_URL = '/api/articles';
    const articlesContainer = document.getElementById('articlesContainer');
    const searchInput = document.getElementById('searchInput');
    const newPostBtn = document.getElementById('newPostBtn');
    const postModal = document.getElementById('postModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const articleForm = document.getElementById('articleForm');
    const loader = document.getElementById('loader');

    // DOM Elements specific to form
    const articleIdInput = document.getElementById('articleId');
    const titleInput = document.getElementById('title');
    const authorInput = document.getElementById('author');
    const categoryInput = document.getElementById('category');
    const tagsInput = document.getElementById('tags');
    const contentInput = document.getElementById('content');
    const modalTitle = document.getElementById('modalTitle');
    const submitBtn = document.getElementById('submitBtn');

    // Load articles on start
    fetchArticles();

    // =============== EVENTS =============== //

    // Search with debounce
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const query = e.target.value.trim();
            if (query.length > 0) {
                fetchArticles(`${API_URL}/search?query=${encodeURIComponent(query)}`);
            } else {
                fetchArticles();
            }
        }, 300);
    });

    // Modal Control
    newPostBtn.addEventListener('click', () => {
        openModal();
    });

    closeModalBtn.addEventListener('click', () => {
        closeModal();
    });

    // Handle create / update
    articleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Envoi...';

        const id = articleIdInput.value;
        const payload = {
            title: titleInput.value,
            content: contentInput.value,
            author: authorInput.value,
            category: categoryInput.value,
            tags: tagsInput.value
        };

        try {
            if (id) {
                // UPDATE
                await fetch(`${API_URL}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                // CREATE
                await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }
            closeModal();
            fetchArticles();
        } catch (error) {
            console.error("Erreur de sauvegarde:", error);
            alert("Une erreur s'est produite lors de l'enregistrement.");
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = 'Publier';
        }
    });

    // =============== FUNCTIONS =============== //

    function openModal(article = null) {
        if (article) {
            modalTitle.innerText = "Modifier l'Article";
            articleIdInput.value = article.id;
            titleInput.value = article.title;
            authorInput.value = article.author;
            categoryInput.value = article.category || '';
            tagsInput.value = article.tags || '';
            contentInput.value = article.content;
            submitBtn.innerText = 'Mettre à jour';
        } else {
            modalTitle.innerText = "Créer un Article";
            articleForm.reset();
            articleIdInput.value = '';
            submitBtn.innerText = 'Publier';
        }
        postModal.classList.remove('hidden');
    }

    function closeModal() {
        postModal.classList.add('hidden');
    }

    async function fetchArticles(url = API_URL) {
        showLoader();
        try {
            const response = await fetch(url);
            const articles = await response.json();
            renderArticles(articles);
        } catch (error) {
            console.error("Erreur de chargement:", error);
            articlesContainer.innerHTML = `<p style="color:var(--danger)">Erreur lors du chargement des articles.</p>`;
        } finally {
            hideLoader();
        }
    }

    window.deleteArticle = async function(id) {
        if(confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
            try {
                await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
                fetchArticles();
            } catch (error) {
                console.error("Erreur de suppression:", error);
            }
        }
    }

    window.editArticle = async function(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            const article = await response.json();
            openModal(article);
        } catch (error) {
            console.error("Erreur lors de la récupération de l'article:", error);
        }
    }

    function renderArticles(articles) {
        articlesContainer.innerHTML = '';
        if (articles.length === 0) {
            articlesContainer.innerHTML = '<p style="color:var(--text-secondary)">Aucun article trouvé.</p>';
            return;
        }

        articles.forEach(article => {
            const date = new Date(article.date).toLocaleDateString('fr-FR', {
                year: 'numeric', month: 'short', day: 'numeric'
            });

            // Handle tags split safely
            let tagsHtml = '';
            if (article.tags) {
                const tagsList = article.tags.split(',').map(t => t.trim()).filter(t => t);
                tagsHtml = tagsList.map(tag => `<span class="tag">#${tag}</span>`).join('');
            }

            const card = document.createElement('article');
            card.className = 'glass-card';
            card.innerHTML = `
                <div class="card-header">
                    <span class="card-category">${article.category || 'Général'}</span>
                    <div class="card-actions">
                        <button class="icon-btn edit-btn" onclick="editArticle(${article.id})" title="Modifier">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button class="icon-btn" onclick="deleteArticle(${article.id})" title="Supprimer">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
                <h3 class="card-title">${article.title}</h3>
                <div class="card-meta">
                    <span><i class="fa-solid fa-user"></i> ${article.author}</span>
                    <span><i class="fa-regular fa-calendar"></i> ${date}</span>
                </div>
                <div class="card-content">
                    ${article.content}
                </div>
                <div class="card-tags">
                    ${tagsHtml}
                </div>
            `;
            articlesContainer.appendChild(card);
        });
    }

    function showLoader() {
        loader.classList.remove('hidden');
    }

    function hideLoader() {
        loader.classList.add('hidden');
    }
});
