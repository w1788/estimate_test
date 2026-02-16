// ⭐ 3階層のデータ構造
const data = {
    'A': {
        name: 'デザイン',
        sub: {
            'A-1': {
                name: 'ロゴ',
                sub: {
                    'A-1-1': { name: '基本ロゴ', price: 10000 },
                    'A-1-2': { name: 'プレミアムロゴ', price: 30000 }
                }
            },
            'A-2': {
                name: 'バナー',
                sub: {
                    'A-2-1': { name: '小バナー', price: 5000 },
                    'A-2-2': { name: '大バナー', price: 8000 }
                }
            }
        }
    },
    'B': {
        name: '開発',
        sub: {
            'B-1': {
                name: 'フロントエンド',
                sub: {
                    'B-1-1': { name: 'コーディング', price: 50000 },
                    'B-1-2': { name: 'テスト', price: 20000 }
                }
            },
            'B-2': {
                name: 'バックエンド',
                sub: {
                    'B-2-1': { name: 'API作成', price: 60000 },
                    'B-2-2': { name: 'DB構築', price: 40000 }
                }
            }
        }
    },
    'C': {
        name: 'コンテンツ',
        sub: {
            'C-1': {
                name: 'テキスト作成',
                sub: {
                    'C-1-1': { name: '基本ライティング', price: 15000 },
                    'C-1-2': { name: 'SEOライティング', price: 30000 }
                }
            }
        }
    },
    'D': {
        name: '保守',
        sub: {
            'D-1': {
                name: 'サーバー',
                sub: {
                    'D-1-1': { name: '月額管理', price: 10000 },
                    'D-1-2': { name: '緊急対応', price: 50000 }
                }
            }
        }
    },
    'E': {
        name: 'サポート',
        sub: {
            'E-1': {
                name: '対応',
                sub: {
                    'E-1-1': { name: 'メール相談', price: 5000 },
                    'E-1-2': { name: '電話サポート', price: 15000 }
                }
            }
        }
    }
};

let currentEstimateItems = [];

// 大項目を選択
function selectCategory(category) {
    const subContainer = document.getElementById('sub-categories');
    const subSubContainer = document.getElementById('sub-sub-categories');
    subContainer.innerHTML = '';
    subSubContainer.innerHTML = ''; // 小項目をクリア

    if (data[category]) {
        const subItems = data[category].sub;
        for (let subKey in subItems) {
            const item = subItems[subKey];
            const btn = document.createElement('button');
            btn.innerText = subKey + ': ' + item.name;
            // 中項目をクリックしたら小項目を表示
            btn.onclick = () => selectSubCategory(category, subKey);
            subContainer.appendChild(btn);
        }
    }
}

// ⭐ 中項目を選択（ここを修正：ボタンの右隣に個数プルダウン）
function selectSubCategory(category, subKey) {
    const subSubContainer = document.getElementById('sub-sub-categories');
    subSubContainer.innerHTML = ''; // クリア

    const subItems = data[category].sub[subKey].sub;
    for (let subSubKey in subItems) {
        const item = subItems[subSubKey];
        
        // 項目とボタンのコンテナ
        const container = document.createElement('div');
        container.style.marginTop = '15px';
        container.style.display = 'flex'; // 横並びにする
        container.style.alignItems = 'center';
        
        // 項目名ラベル
        const label = document.createElement('span');
        label.innerText = `${subSubKey}: ${item.name} (¥${item.price.toLocaleString()})`;
        label.style.flexGrow = '1'; // ラベルを左に寄せる
        
        // ⭐ 追加ボタンを先に作成
        const btn = document.createElement('button');
        btn.innerText = '見積もりに追加';
        btn.style.marginLeft = '10px';
        
        // ⭐ 個数選択プルダウン (ボタンの右隣)
        const quantitySelect = document.createElement('select');
        quantitySelect.className = 'quantity-select';
        quantitySelect.style.marginLeft = '10px'; // ボタンとの間隔
        for (let i = 1; i <= 50; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.text = i;
            quantitySelect.appendChild(option);
        }
        
        // ボタンのクリック時にプルダウンの値を渡す
        btn.onclick = () => addItemToEstimate(item, parseInt(quantitySelect.value));
        
        container.appendChild(label);
        container.appendChild(btn); // ボタン
        container.appendChild(quantitySelect); // プルダウン
        subSubContainer.appendChild(container);
    }
}

// ⭐ 追加する関数も、指定された個数を受け取るように修正
function addItemToEstimate(item, quantity = 1) {
    const existingItem = currentEstimateItems.find(i => i.name === item.name);
    if (existingItem) {
        existingItem.quantity += quantity; // 指定された個数を追加
    } else {
        currentEstimateItems.push({ ...item, quantity: quantity });
    }
    renderEstimateTable();
}

function renderEstimateTable() {
    const tbody = document.getElementById('summary-list');
    tbody.innerHTML = '';
    let total = 0;

    currentEstimateItems.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>¥${item.price.toLocaleString()}</td>
            <td>
                <select class="quantity-select" onchange="updateQuantity(${index}, this.value)">
                    ${generateQuantityOptions(item.quantity)}
                </select>
            </td>
            <td>¥${subtotal.toLocaleString()}</td>
            <td><button class="delete-btn" onclick="deleteItem(${index})">削除</button></td>
        `;
        tbody.appendChild(row);
    });

    document.getElementById('total-price').innerText = total.toLocaleString();
}

function generateQuantityOptions(currentQty) {
    let options = '';
    for (let i = 1; i <= 50; i++) {
        options += `<option value="${i}" ${i === currentQty ? 'selected' : ''}>${i}</option>`;
    }
    return options;
}

function updateQuantity(index, newQuantity) {
    currentEstimateItems[index].quantity = parseInt(newQuantity);
    renderEstimateTable();
}

function deleteItem(index) {
    currentEstimateItems.splice(index, 1);
    renderEstimateTable();
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.text("Estimate Report", 20, 20);
    doc.text("Total Cost: ¥" + document.getElementById('total-price').innerText, 20, 30);
    
    doc.save("estimate.pdf");
}