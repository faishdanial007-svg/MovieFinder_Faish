
const movieInput = document.getElementById('movieInput');
const searchBtn = document.getElementById('searchBtn');
const movieGrid = document.getElementById('movieGrid');
const statusMessage = document.getElementById('statusMessage');

// butang carian
searchBtn.addEventListener('click', () => {
    const query = movieInput.value.trim();
    if (query) {
        searchMovies(query);
    } else {
        showMessage('Sila masukkan tajuk dahulu!', 'error');
    }
});


document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', () => {
        const query = tag.textContent;
        movieInput.value = query;
        searchMovies(query);
    });
});


async function searchMovies(query) {
    try {
       
        movieGrid.innerHTML = '<div class="spinner"></div>';
        statusMessage.textContent = 'Sedang mencari...';

        const response = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`);
        const data = await response.json();

        if (data.length > 0) {
            displayMovies(data);
            statusMessage.textContent = `Dijumpai ${data.length} hasil untuk "${query}"`;
        } else {
            movieGrid.innerHTML = `<div class="placeholder-text">Maaf, "${query}" tidak ditemui.</div>`;
            statusMessage.textContent = '';
        }
    } catch (error) {
        console.error('Ralat API:', error);
        movieGrid.innerHTML = '<div class="placeholder-text">Berlaku ralat teknikal. Sila cuba sebentar lagi.</div>';
        statusMessage.textContent = '';
    }
}

// memaparkan data 
function displayMovies(results) {
    movieGrid.innerHTML = ''; 

    results.forEach(item => {
        const show = item.show;
        const card = document.createElement('div');
        card.classList.add('movie-card');

        
        const poster = show.image ? show.image.medium : 'https://via.placeholder.com/210x295?text=Tiada+Poster';
        
       
        const year = show.premiered ? show.premiered.split('-')[0] : 'N/A';

        card.innerHTML = `
            <img src="${poster}" alt="${show.name}" loading="lazy">
            <div class="movie-info">
                <h3>${show.name}</h3>
                <p>
                    <span>${show.type || 'Show'}</span>
                    <span class="year-badge">${year}</span>
                </p>
            </div>
        `;

        movieGrid.appendChild(card);
    });
}

function showMessage(msg, type) {
    statusMessage.textContent = msg;
    statusMessage.style.color = type === 'error' ? '#fb7185' : '#6366f1';
}
