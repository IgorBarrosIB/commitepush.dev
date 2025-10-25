let versions = {};

// Carregar JSON
async function loadVersions() {
    try {
        document.getElementById('loading').style.display = 'block';
        document.getElementById('content').style.display = 'none';
        
        const response = await fetch('versions.json');
        if (!response.ok) {
            throw new Error('Erro ao carregar versions.json');
        }
        
        versions = await response.json();
        
        document.getElementById('loading').style.display = 'none';
        document.getElementById('content').style.display = 'block';
        
        renderVersions();
    } catch (error) {
        document.getElementById('loading').innerHTML = `
            <div class="error">
                ❌ Erro ao carregar o arquivo versions.json<br>
                Certifique-se de que o arquivo existe no mesmo diretório.<br>
                <small>${error.message}</small>
            </div>
        `;
    }
}

// Renderizar versões
function renderVersions() {
    const grid = document.getElementById('versionGrid');
    grid.innerHTML = '';

    for (let key in versions) {
        const version = versions[key];
        const card = document.createElement('div');
        card.className = `version-card ${version.active ? 'active' : ''}`;
        card.onclick = () => activateVersion(key);
        
        card.innerHTML = `
            <div class="emoji">${version.emoji}</div>
            <h3>${version.name}</h3>
            <p>${version.description}</p>
            <span class="status ${version.active ? 'active' : 'inactive'}">
                ${version.active ? '✓ ATIVA' : 'Inativa'}
            </span>
        `;
        
        grid.appendChild(card);
    }

    updateActiveDisplay();
    updateJSON();
}

// Atualizar display da versão ativa
function updateActiveDisplay() {
    const activeVersion = Object.values(versions).find(v => v.active);
    if (activeVersion) {
        document.getElementById('activeProfile').textContent = activeVersion.emoji;
        document.getElementById('activeId').textContent = activeVersion.id;
        document.getElementById('activeName').textContent = activeVersion.name;
        document.getElementById('activeDesc').textContent = activeVersion.description;
    }
}

// Ativar versão específica
function activateVersion(versionId) {
    // Desativar todas
    for (let key in versions) {
        versions[key].active = false;
    }
    // Ativar selecionada
    versions[versionId].active = true;
    renderVersions();
}

// Ativar versão aleatória
function activateRandom() {
    const keys = Object.keys(versions);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    activateVersion(randomKey);
}

// Atualizar visualizador JSON
function updateJSON() {
    const jsonViewer = document.getElementById('jsonViewer');
    jsonViewer.textContent = JSON.stringify(versions, null, 2);
}

// Mostrar/ocultar JSON
function toggleJSON() {
    const jsonSection = document.getElementById('jsonSection');
    jsonSection.style.display = jsonSection.style.display === 'none' ? 'block' : 'none';
}

// Salvar alterações (download do JSON atualizado)
function saveVersions() {
    const dataStr = JSON.stringify(versions, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'versions.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert('✅ Arquivo versions.json baixado com as alterações!');
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', loadVersions);