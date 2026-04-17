// ---- SUPABASE CONFIGURATION ----
// Replace these with your actual Supabase Project URL and Anon Key
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('projects-grid');
    const searchBar = document.getElementById('searchBar');
    
    // Modal Elements
    const modal = document.getElementById('projectModal');
    const closeModalBtn = document.getElementById('closeModal');
    const mIcon = document.getElementById('m-icon');
    const mTitle = document.getElementById('m-title');
    const mDesc = document.getElementById('m-desc');
    const mFeatures = document.getElementById('m-features');

    // Render cards initially & populate select
    renderProjects(projectsData);
    populateProjectSelect(projectsData);

    // Registration Modal Elements
    const registerModal = document.getElementById('registerModal');
    const openRegisterBtn = document.getElementById('openRegisterBtn');
    const closeRegisterModalBtn = document.getElementById('closeRegisterModal');
    const teamRegisterForm = document.getElementById('teamRegisterForm');
    const formMessages = document.getElementById('formMessages');
    const submitTeamBtn = document.getElementById('submitTeamBtn');

    // Registration Modal Events
    if (openRegisterBtn) {
        openRegisterBtn.addEventListener('click', () => {
            registerModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            formMessages.className = 'form-messages';
            formMessages.textContent = '';
        });
    }

    closeRegisterModalBtn.addEventListener('click', () => {
        registerModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    registerModal.addEventListener('click', (e) => {
        if (e.target === registerModal) {
            registerModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Form Submission Logic
    teamRegisterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!supabase) {
            showMessage('Supabase is not configured yet. Please update JS with your keys.', 'error');
            return;
        }

        const projectTitle = document.getElementById('projectSelect').options[document.getElementById('projectSelect').selectedIndex].text;
        const teamIdea = document.getElementById('teamIdea').value;
        const leaderName = document.getElementById('leaderName').value;
        const membersList = document.getElementById('membersList').value;

        submitTeamBtn.disabled = true;
        submitTeamBtn.innerHTML = 'Registering... <i class="fa-solid fa-spinner fa-spin"></i>';
        
        try {
            const { data, error } = await supabase
                .from('teams')
                .insert([
                    { 
                        project_title: projectTitle, 
                        team_idea: teamIdea,
                        leader_name: leaderName,
                        members: membersList 
                    }
                ]);

            if (error) throw error;

            showMessage('Team registered successfully! We will contact you soon.', 'success');
            teamRegisterForm.reset();
            setTimeout(() => {
                registerModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }, 3000);
        } catch (error) {
            console.error('Error inserting data:', error);
            showMessage('Error registering team. Please try again or check setup.', 'error');
        } finally {
            submitTeamBtn.disabled = false;
            submitTeamBtn.innerHTML = 'Register Now <i class="fa-solid fa-paper-plane"></i>';
        }
    });

    function showMessage(msg, type) {
        formMessages.textContent = msg;
        formMessages.className = `form-messages ${type}`;
    }

    // Search functionality
    searchBar.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = projectsData.filter(p => 
            p.title.toLowerCase().includes(term) || 
            p.description.toLowerCase().includes(term) ||
            p.features.some(f => f.toLowerCase().includes(term))
        );
        renderProjects(filtered);
    });

    // Close Modal Events
    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    function renderProjects(data) {
        grid.innerHTML = '';
        if(data.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color: var(--text-muted)">No projects found matching your search.</p>';
            return;
        }

        data.forEach(project => {
            const card = document.createElement('div');
            card.classList.add('project-card');
            card.innerHTML = `
                <div class="card-icon">
                    <i class="fa-solid ${project.icon}"></i>
                </div>
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="card-footer">
                    <span>View Requirements</span>
                    <i class="fa-solid fa-arrow-right"></i>
                </div>
            `;
            
            card.addEventListener('click', () => openModal(project));
            grid.appendChild(card);
        });
    }

    function openModal(project) {
        mIcon.className = `fa-solid ${project.icon}`;
        mTitle.textContent = project.title;
        mDesc.textContent = project.description;
        
        mFeatures.innerHTML = '';
        project.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            mFeatures.appendChild(li);
        });

        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    function populateProjectSelect(data) {
        const select = document.getElementById('projectSelect');
        if (!select) return;
        
        data.forEach(project => {
            const option = document.createElement('option');
            option.value = project.id;
            option.textContent = project.title;
            select.appendChild(option);
        });
    }
});
