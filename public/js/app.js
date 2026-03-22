document.addEventListener('DOMContentLoaded', () => {
    const API_URL = '/api/articles';
    const articlesContainer = document.getElementById('articlesContainer');
    const searchInput = document.getElementById('searchInput');
    const newPostBtn = document.getElementById('newPostBtn');
    
    // Modal elements
    const postModal = document.getElementById('postModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const articleForm = document.getElementById('articleForm');
    
    // Form Inputs
    const articleIdInput = document.getElementById('articleId');
    const titleInput = document.getElementById('title');
    const authorInput = document.getElementById('author');
    const categoryInput = document.getElementById('category');
    const tagsInput = document.getElementById('tags');
    const contentInput = document.getElementById('content');
    const modalTitle = document.getElementById('modalTitle');
    const submitBtn = document.getElementById('submitBtn');
    
    // Filters
    const categoryFilter = document.getElementById('categoryFilter');
    const authorFilter = document.getElementById('authorFilter');

    // UI Feedback
    const loader = document.getElementById('loader');
    const articleCount = document.getElementById('articleCount');
    const statArticleTotal = document.getElementById('statArticleTotal');

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

    // Filtering handling
    categoryFilter.addEventListener('change', () => applyFilters());
    authorFilter.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => applyFilters(), 400);
    });

    function applyFilters() {
        const cat = categoryFilter.value;
        const auth = authorFilter.value.trim();
        let url = new URL(API_URL, window.location.origin);
        if (cat) url.searchParams.append('category', cat);
        if (auth) url.searchParams.append('author', auth);
        fetchArticles(url.toString());
    }

    // Modal Control
    newPostBtn.addEventListener('click', () => {
        openModal();
    });

    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Form Submission
    articleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="material-symbols-outlined text-sm animate-spin">refresh</span> Enregistrement...';

        const id = articleIdInput.value;
        const payload = {
            title: titleInput.value,
            content: contentInput.value,
            author: authorInput.value,
            category: categoryInput.value,
            tags: tagsInput.value
        };

        try {
            let res;
            if (id) {
                // UPDATE
                res = await fetch(`${API_URL}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                // CREATE
                res = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }
            
            if (!res.ok) {
                 const errData = await res.json().catch(() => ({}));
                 throw new Error(errData.message || "Erreur lors de la sauvegarde.");
            }
            
            closeModal();
            // Automatically clear filters to show the newly added/edited post clearly
            categoryFilter.value = "";
            authorFilter.value = "";
            fetchArticles(); 
        } catch (error) {
            console.error("Erreur de sauvegarde:", error);
            alert("Une erreur s'est produite lors de l'enregistrement: " + error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
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
            submitBtn.innerHTML = '<span class="material-symbols-outlined text-sm">save</span> Mettre à jour';
        } else {
            modalTitle.innerText = "Créer un Article";
            articleForm.reset();
            articleIdInput.value = '';
            submitBtn.innerHTML = '<span class="material-symbols-outlined text-sm">publish</span> Publier';
        }
        postModal.classList.remove('hidden');
        // trigger reflow
        void postModal.offsetWidth;
        postModal.classList.add('show');
    }

    function closeModal() {
        postModal.classList.remove('show');
        setTimeout(() => {
            postModal.classList.add('hidden');
        }, 300); // match transition duration
    }

    globalThis.fetchArticles = async function(url = API_URL) {
        loader.classList.remove('hidden');
        try {
            const response = await fetch(url);
            const articles = await response.json();
            renderArticles(articles);
            
            // Stats
            statArticleTotal.innerText = articles.length;
            articleCount.innerHTML = `Affichage de <span class="text-on-surface font-bold text-primary">${articles.length}</span> articles`;
        } catch (error) {
            console.error("Erreur de chargement:", error);
            articlesContainer.innerHTML = `<tr><td colspan="6" class="px-8 py-6 text-center text-error font-bold">Erreur lors du chargement des articles.</td></tr>`;
        } finally {
            loader.classList.add('hidden');
        }
    }

    globalThis.deleteArticle = async function(id) {
        if(confirm("Êtes-vous sûr de vouloir supprimer cet article de la base de données ?")) {
            try {
                await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
                fetchArticles();
            } catch (error) {
                console.error("Erreur de suppression:", error);
                alert("Erreur réseau");
            }
        }
    }

    globalThis.editArticle = async function(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            const article = await response.json();
            openModal(article);
        } catch (error) {
            console.error("Erreur de récupération:", error);
        }
    }

    function renderArticles(articles) {
        articlesContainer.innerHTML = '';
        if (articles.length === 0) {
            articlesContainer.innerHTML = `
                <tr>
                    <td colspan="6" class="px-8 py-10 text-center text-on-surface-variant">
                        <span class="material-symbols-outlined text-4xl mb-3 opacity-50 block">sentiment_dissatisfied</span>
                        <p class="font-medium text-lg">Aucun article trouvé.</p>
                        <p class="text-sm opacity-75">Essayez de modifier vos filtres ou créez un nouvel article.</p>
                    </td>
                </tr>
            `;
            return;
        }

        articles.forEach(article => {
            const d = new Date(article.date);
            const formattedDate = !isNaN(d) ? d.toLocaleDateString('fr-FR', {
                year: 'numeric', month: 'short', day: 'numeric'
            }) : article.date;

            // Compute an initial for the avatar
            const initials = article.author ? article.author.substring(0, 2).toUpperCase() : '??';

            const row = document.createElement('tr');
            row.className = 'group hover:bg-surface-bright transition-all';
            
            row.innerHTML = `
                <td class="px-8 py-5">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-xl flex-shrink-0 bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shadow-sm">
                            ${initials}
                        </div>
                        <div class="max-w-[250px] overflow-hidden">
                            <div class="font-bold text-on-surface text-base group-hover:text-primary transition-colors truncate" title="${article.title}">${article.title}</div>
                            <div class="text-xs text-on-surface-variant font-medium mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]" title="${article.content}">${article.content}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-5">
                    <div class="flex items-center gap-3">
                        <span class="text-sm font-semibold text-on-surface">${article.author}</span>
                    </div>
                </td>
                <td class="px-6 py-5">
                    <span class="text-xs font-bold text-on-secondary-container bg-secondary-container border border-outline-variant/20 px-3 py-1 rounded-full shadow-sm">${article.category || 'Général'}</span>
                </td>
                <td class="px-6 py-5">
                    <span class="text-xs font-bold text-on-primary-fixed-variant bg-primary-fixed px-3 py-1 rounded-full flex items-center gap-1.5 w-fit shadow-sm">
                        <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> Publié
                    </span>
                </td>
                <td class="px-6 py-5 text-sm font-medium text-on-surface-variant">${formattedDate}</td>
                <td class="px-8 py-5">
                    <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onclick="editArticle(${article.id})" class="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors shadow-sm border border-transparent hover:border-outline-variant/30" title="Modifier">
                            <span class="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button onclick="deleteArticle(${article.id})" class="w-9 h-9 rounded-lg flex items-center justify-center text-error hover:bg-error/10 transition-colors shadow-sm border border-transparent hover:border-error/20" title="Supprimer">
                            <span class="material-symbols-outlined text-lg">delete</span>
                        </button>
                    </div>
                </td>
            `;
            articlesContainer.appendChild(row);
        });
    }

    // Load articles on initialize now that functions are defined
    fetchArticles();
});
