// キャッシュの名前とバージョン
const CACHE_NAME = 'form-memory-app-v1';

// キャッシュするファイルのリスト
const CACHE_ASSETS = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/manifest.json'
];

// サービスワーカーのインストール
self.addEventListener('install', event => {
    console.log('サービスワーカーがインストールされました');
    
    // キャッシュの作成とファイルの追加
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('キャッシュを作成しました');
                return cache.addAll(CACHE_ASSETS);
            })
            .catch(error => {
                console.error('キャッシュの作成に失敗しました:', error);
            })
    );
});

// サービスワーカーのアクティベート
self.addEventListener('activate', event => {
    console.log('サービスワーカーがアクティベートされました');
    
    // 古いキャッシュの削除
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('古いキャッシュを削除しました:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    
    // 新しいサービスワーカーをすぐにアクティベート
    return self.clients.claim();
});

// フェッチイベントの処理
self.addEventListener('fetch', event => {
    // キャッシュファースト戦略
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // キャッシュにあればそれを返す
                if (response) {
                    return response;
                }
                
                // キャッシュになければネットワークからフェッチ
                return fetch(event.request)
                    .then(response => {
                        // レスポンスが有効でなければそのまま返す
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // レスポンスをクローンしてキャッシュに追加
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                            
                        return response;
                    });
            })
            .catch(error => {
                console.error('フェッチに失敗しました:', error);
                // オフラインフォールバックページがあれば返す
                // return caches.match('/offline.html');
            })
    );
});