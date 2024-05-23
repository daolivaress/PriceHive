document.getElementById('search-btn').addEventListener('click', function () {
    const searchTerm = document.getElementById('search-bar').value;
    window.location.href = `results.html?term=${encodeURIComponent(searchTerm)}`;
});
