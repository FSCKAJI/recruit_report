// 店舗管理関連の機能

// 店舗管理モーダルを表示
function showManageStoresModal() {
    document.getElementById('manageStoresModal').classList.add('show');
    renderStoresList();
}

// 店舗管理モーダルを閉じる
function closeManageStoresModal() {
    document.getElementById('manageStoresModal').classList.remove('show');
}

// 店舗リストを表示
function renderStoresList() {
    const container = document.getElementById('storesListContainer');
    container.innerHTML = '';
    
    // 地域ごとの店舗を表示
    Object.entries(storesByRegion).forEach(([region, stores]) => {
        if (stores.length === 0) return;
        
        const regionHeader = document.createElement('h4');
        regionHeader.textContent = region;
        regionHeader.style.margin = '15px 0 10px';
        container.appendChild(regionHeader);
        
        // 店舗リスト
        const storesList = document.createElement('div');
        storesList.style.marginLeft = '15px';
        
        stores.forEach(store => {
            const storeItem = document.createElement('div');
            storeItem.style.marginBottom = '10px';
            storeItem.style.display = 'flex';
            storeItem.style.justifyContent = 'space-between';
            storeItem.style.alignItems = 'center';
            
            const storeInfo = document.createElement('div');
            storeInfo.innerHTML = `
                <strong>${store.name}</strong><br>
                <small style="color: #7f8c8d;">${store.address || '住所未登録'}</small>
            `;
            
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '削除';
            deleteBtn.className = 'action-btn delete';
            deleteBtn.style.padding = '5px 10px';
            deleteBtn.style.fontSize = '12px';
            deleteBtn.onclick = () => {
                if (confirm(`本当に「${store.name}」を削除しますか？`)) {
                    deleteStore(store.name, region);
                }
            };
            
            storeItem.appendChild(storeInfo);
            storeItem.appendChild(deleteBtn);
            storesList.appendChild(storeItem);
        });
        
        container.appendChild(storesList);
    });
}

// 新しい店舗を追加
function addNewStore() {
    const storeName = document.getElementById('newStoreName').value.trim();
    const storeAddress = document.getElementById('newStoreAddress').value.trim();
    const region = document.getElementById('newStoreRegion').value;
    
    if (!storeName) {
        alert('店舗名を入力してください');
        return;
    }
    
    // 既存の店舗名と重複していないか確認
    for (const regionStores of Object.values(storesByRegion)) {
        const isDuplicate = regionStores.some(store => store.name === storeName);
        if (isDuplicate) {
            alert('この店舗名は既に登録されています');
            return;
        }
    }
    
    // 新しい店舗を追加
    const newStore = {
        name: storeName,
        address: storeAddress
    };
    
    // 地域に店舗を追加
    if (!storesByRegion[region]) {
        storesByRegion[region] = [];
    }
    storesByRegion[region].push(newStore);
    
    // 全店舗リストにも追加
    storesList.push(newStore);
    
    // フォームをリセット
    document.getElementById('newStoreName').value = '';
    document.getElementById('newStoreAddress').value = '';
    
    // 店舗リストと店舗選択リストを更新
    renderStoresList();
    updateStoreSelectors();
    
    alert(`「${storeName}」を追加しました`);
}

// 店舗を削除
function deleteStore(storeName, region) {
    // 地域の店舗リストから削除
    if (storesByRegion[region]) {
        storesByRegion[region] = storesByRegion[region].filter(store => store.name !== storeName);
    }
    
    // 全店舗リストからも削除
    const storeIndex = storesList.findIndex(store => store.name === storeName);
    if (storeIndex !== -1) {
        storesList.splice(storeIndex, 1);
    }
    
    // 店舗リストと店舗選択リストを更新
    renderStoresList();
    updateStoreSelectors();
    
    alert(`「${storeName}」を削除しました`);
}