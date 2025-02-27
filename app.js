// DOM要素の取得
const form = document.getElementById('memoryForm');
const saveButton = document.getElementById('saveButton');
const loadButton = document.getElementById('loadButton');
const clearButton = document.getElementById('clearButton');
const notification = document.getElementById('notification');

// フォームフィールドの数
const FIELD_COUNT = 10;

// 通知を表示する関数
function showNotification(message) {
    notification.textContent = message;
    notification.classList.remove('hidden');
    
    // 3秒後に通知を非表示にする
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

// フォームデータを保存する関数
function saveFormData() {
    const formData = {};
    
    // 各フィールドの値を取得
    for (let i = 1; i <= FIELD_COUNT; i++) {
        const fieldId = `field${i}`;
        const fieldValue = document.getElementById(fieldId).value;
        formData[fieldId] = fieldValue;
    }
    
    // ローカルストレージに保存
    try {
        localStorage.setItem('formData', JSON.stringify(formData));
        showNotification('データが正常に保存されました');
    } catch (error) {
        console.error('データの保存に失敗しました:', error);
        showNotification('データの保存に失敗しました');
    }
}

// フォームデータを読み込む関数
function loadFormData() {
    try {
        // ローカルストレージからデータを取得
        const formData = JSON.parse(localStorage.getItem('formData'));
        
        if (!formData) {
            showNotification('保存されたデータがありません');
            return;
        }
        
        // 各フィールドに値をセット
        for (let i = 1; i <= FIELD_COUNT; i++) {
            const fieldId = `field${i}`;
            if (formData[fieldId]) {
                document.getElementById(fieldId).value = formData[fieldId];
            }
        }
        
        showNotification('データを読み込みました');
    } catch (error) {
        console.error('データの読み込みに失敗しました:', error);
        showNotification('データの読み込みに失敗しました');
    }
}

// フォームをクリアする関数
function clearForm() {
    form.reset();
    showNotification('フォームをクリアしました');
}

// イベントリスナーの設定
saveButton.addEventListener('click', saveFormData);
loadButton.addEventListener('click', loadFormData);
clearButton.addEventListener('click', clearForm);

// ページ読み込み時に保存データがあれば自動的に読み込む
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('formData')) {
        loadFormData();
    }
});

// オフライン状態の検出
window.addEventListener('online', () => {
    showNotification('オンラインに戻りました');
});

window.addEventListener('offline', () => {
    showNotification('オフラインになりました。データは端末に保存されます');
});