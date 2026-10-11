// Research Opportunity Portal - Frontend JavaScript
// This file handles all the API calls and DOM manipulation

const API_URL = '/api/opportunities';

// load all opportunities when page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchAllOpportunities();
});

// --- Fetching and Displaying Opportunities ---

async function fetchAllOpportunities() {
    const container = document.getElementById('cardsContainer');
    container.innerHTML = '<p class="loading-text">Loading opportunities...</p>';

    try {
        const response = await fetch(API_URL);
        const result = await response.json();

        if (result.success && result.data.length > 0) {
            container.innerHTML = '';
            result.data.forEach(opp => {
                container.innerHTML += createOpportunityCard(opp);
            });
        } else {
            container.innerHTML = '<p class="no-data">No research opportunities found. Click "Add New Opportunity" to create one.</p>';
        }
    } catch (error) {
        console.error('Error loading opportunities:', error);
        container.innerHTML = '<p class="no-data">Failed to load opportunities. Make sure the server is running.</p>';
    }
}

// creating a card HTML for each opportunity
function createOpportunityCard(opp) {
    const statusClass = opp.status === 'Open' ? 'status-open' : 'status-closed';
    const cardClass = opp.status === 'Closed' ? 'closed' : '';
    
    // formatting the deadline date nicely
    const deadline = new Date(opp.deadline).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });

    return `
        <div class="opportunity-card ${cardClass}">
            <div class="card-header">
                <h3 onclick="viewDetails(${opp.id})">${opp.title}</h3>
                <span class="status-badge ${statusClass}">${opp.status}</span>
            </div>
            <div class="card-info">
                <span>📚 ${opp.research_area}</span>
                <span>👨‍🏫 ${opp.faculty_name}</span>
                <span>🏛️ ${opp.department}</span>
                <span>👥 ${opp.positions} position(s)</span>
                <span>📅 Deadline: ${deadline}</span>
            </div>
            <div class="card-actions">
                <button class="btn btn-info btn-sm" onclick="viewDetails(${opp.id})">View Details</button>
                <button class="btn btn-warning btn-sm" onclick="editOpportunity(${opp.id})">Edit</button>
                ${opp.status === 'Open' ? 
                    `<button class="btn btn-secondary btn-sm" onclick="closeOpportunity(${opp.id})">Close</button>` : 
                    ''}
                <button class="btn btn-danger btn-sm" onclick="deleteOpportunity(${opp.id})">Delete</button>
            </div>
        </div>
    `;
}

// --- View Details ---

async function viewDetails(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const result = await response.json();

        if (!result.success) {
            showMessage(result.message, 'error');
            return;
        }

        const opp = result.data;
        const deadline = new Date(opp.deadline).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
        const createdAt = new Date(opp.created_at).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });

        const statusClass = opp.status === 'Open' ? 'status-open' : 'status-closed';

        document.getElementById('detailContent').innerHTML = `
            <h2 class="detail-title">${opp.title}</h2>
            <span class="status-badge ${statusClass}" style="margin-bottom: 15px; display: inline-block;">${opp.status}</span>
            
            <div class="detail-row">
                <strong>Description</strong>
                <p>${opp.description}</p>
            </div>
            <div class="detail-row">
                <strong>Research Area</strong>
                <p>${opp.research_area}</p>
            </div>
            <div class="detail-row">
                <strong>Faculty Member</strong>
                <p>${opp.faculty_name}</p>
            </div>
            <div class="detail-row">
                <strong>Department</strong>
                <p>${opp.department}</p>
            </div>
            <div class="detail-row">
                <strong>Required Skills</strong>
                <p>${opp.required_skills}</p>
            </div>
            <div class="detail-row">
                <strong>Available Positions</strong>
                <p>${opp.positions}</p>
            </div>
            <div class="detail-row">
                <strong>Application Deadline</strong>
                <p>${deadline}</p>
            </div>
            <div class="detail-row">
                <strong>Created On</strong>
                <p>${createdAt}</p>
            </div>
            <div class="detail-row">
                <strong>Opportunity ID</strong>
                <p>${opp.id}</p>
            </div>
        `;

        document.getElementById('detailModal').style.display = 'flex';
    } catch (error) {
        console.error('Error fetching details:', error);
        showMessage('Could not load opportunity details.', 'error');
    }
}

function closeModal() {
    document.getElementById('detailModal').style.display = 'none';
}

// close modal when clicking outside of it
document.addEventListener('click', (e) => {
    if (e.target.id === 'detailModal') {
        closeModal();
    }
});

// --- Create / Edit Form ---

function toggleCreateForm() {
    const formSection = document.getElementById('formSection');
    if (formSection.style.display === 'none') {
        // reset form for creating new
        document.getElementById('opportunityForm').reset();
        document.getElementById('editId').value = '';
        document.getElementById('formTitle').textContent = 'Create New Research Opportunity';
        document.getElementById('submitBtn').textContent = 'Create Opportunity';
        formSection.style.display = 'block';
        formSection.scrollIntoView({ behavior: 'smooth' });
    } else {
        formSection.style.display = 'none';
    }
}

function cancelForm() {
    document.getElementById('formSection').style.display = 'none';
    document.getElementById('opportunityForm').reset();
    document.getElementById('editId').value = '';
}

async function handleFormSubmit(event) {
    event.preventDefault();

    const editId = document.getElementById('editId').value;

    // getting form data
    const data = {
        title: document.getElementById('title').value.trim(),
        description: document.getElementById('description').value.trim(),
        research_area: document.getElementById('research_area').value.trim(),
        faculty_name: document.getElementById('faculty_name').value.trim(),
        department: document.getElementById('department').value.trim(),
        required_skills: document.getElementById('required_skills').value.trim(),
        positions: parseInt(document.getElementById('positions').value),
        deadline: document.getElementById('deadline').value,
        status: document.getElementById('status').value
    };

    // basic front-end validation
    if (!data.title || !data.description || !data.research_area || !data.faculty_name || !data.department || !data.required_skills || !data.positions || !data.deadline) {
        showMessage('Please fill in all required fields.', 'error');
        return;
    }

    try {
        let response;

        if (editId) {
            // updating existing opportunity
            response = await fetch(`${API_URL}/${editId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } else {
            // creating new opportunity
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        }

        const result = await response.json();

        if (result.success) {
            showMessage(result.message, 'success');
            cancelForm();
            fetchAllOpportunities(); // refresh the list
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        showMessage('Failed to submit. Check if the server is running.', 'error');
    }
}

// --- Edit Opportunity ---

async function editOpportunity(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const result = await response.json();

        if (!result.success) {
            showMessage(result.message, 'error');
            return;
        }

        const opp = result.data;

        // fill the form with existing data
        document.getElementById('editId').value = opp.id;
        document.getElementById('title').value = opp.title;
        document.getElementById('description').value = opp.description;
        document.getElementById('research_area').value = opp.research_area;
        document.getElementById('faculty_name').value = opp.faculty_name;
        document.getElementById('department').value = opp.department;
        document.getElementById('required_skills').value = opp.required_skills;
        document.getElementById('positions').value = opp.positions;
        
        // formatting the date for the input field
        const deadlineDate = new Date(opp.deadline);
        const formattedDate = deadlineDate.toISOString().split('T')[0];
        document.getElementById('deadline').value = formattedDate;
        
        document.getElementById('status').value = opp.status;

        // change form title and button text
        document.getElementById('formTitle').textContent = 'Edit Research Opportunity';
        document.getElementById('submitBtn').textContent = 'Update Opportunity';

        // show the form
        document.getElementById('formSection').style.display = 'block';
        document.getElementById('formSection').scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('Error loading opportunity for edit:', error);
        showMessage('Failed to load opportunity data for editing.', 'error');
    }
}

// --- Close (change status to Closed) ---

async function closeOpportunity(id) {
    if (!confirm('Are you sure you want to close this opportunity?')) return;

    try {
        // first get the current data
        const getResponse = await fetch(`${API_URL}/${id}`);
        const getResult = await getResponse.json();

        if (!getResult.success) {
            showMessage(getResult.message, 'error');
            return;
        }

        const opp = getResult.data;
        opp.status = 'Closed';

        // formatting deadline for the request
        const deadlineDate = new Date(opp.deadline);
        opp.deadline = deadlineDate.toISOString().split('T')[0];

        // send update request
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(opp)
        });

        const result = await response.json();

        if (result.success) {
            showMessage('Opportunity status changed to Closed!', 'success');
            fetchAllOpportunities();
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        console.error('Error closing opportunity:', error);
        showMessage('Failed to close the opportunity.', 'error');
    }
}

// --- Delete Opportunity ---

async function deleteOpportunity(id) {
    if (!confirm('Are you sure you want to delete this opportunity? This cannot be undone.')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            showMessage(result.message, 'success');
            fetchAllOpportunities();
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        console.error('Error deleting opportunity:', error);
        showMessage('Failed to delete the opportunity.', 'error');
    }
}

// --- Message Display ---

function showMessage(message, type) {
    const messageBox = document.getElementById('messageBox');
    messageBox.textContent = message;
    messageBox.className = 'message-box ' + (type === 'success' ? 'message-success' : 'message-error');
    messageBox.style.display = 'block';

    // scroll to top to show the message
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // auto-hide after 4 seconds
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 4000);
}
