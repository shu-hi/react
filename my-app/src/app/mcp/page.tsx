'use client';

import { useState, useEffect } from 'react';

type CredentialType = 'gmail' | 'facebook' | 'instagram' | 'twitter' | 'tiktok';

interface PlaceholderData {
  example?: Record<string, string>;
  requirement?: string;
  source?: string;
}

export default function CredentialsPage() {
  const [credentialType, setCredentialType] = useState<CredentialType>('gmail');
  const [userId, setUserId] = useState('');
  const [credentialsJson, setCredentialsJson] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [registeredCount, setRegisteredCount] = useState<number>(0);
  const [showList, setShowList] = useState(false);
  const [placeholder, setPlaceholder] = useState<PlaceholderData | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // プレースホルダーを読み込む
  useEffect(() => {
    const loadPlaceholder = async () => {
      try {
        const response = await fetch(`/config/mcp/credentials.${credentialType}.example.json`);
        if (response.ok) {
          const data = await response.json();
          setPlaceholder(data);
        }
      } catch (err) {
        console.error('Failed to load placeholder:', err);
      }
    };
    loadPlaceholder();
  }, [credentialType]);

  const resetForm = () => {
    setUserId('');
    setCredentialsJson('');
    setMessage('');
    setError('');
  };

  // Credentials を保存
  const handleSave = async () => {
    if (!userId || !credentialsJson) {
      setError('User ID と Credentials JSON を入力してください');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/credentials/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          credential_type: credentialType,
          credentials_json: credentialsJson,
        }),
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('このユーザーは登録されていません（subscribed_users に存在しません）');
        }
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to save credentials');
      }

      const data = await response.json();
      setMessage(`✅ ${data.message}`);
      resetForm();
    } catch (err) {
      setError(`❌ Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Credentials を取得
  const handleGet = async () => {
    if (!userId) {
      setError('User ID を入力してください');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/credentials/get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          credential_type: credentialType,
        }),
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('このユーザーは登録されていません（subscribed_users に存在しません）');
        }
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to get credentials');
      }

      const data = await response.json();
      // is_registered: true のみが返される（認証情報はマスク）
      if (data.is_registered) {
        setCredentialsJson('[登録済み - 認証情報は隠蔽されています]');
        setMessage('✅ 登録済み状態を確認しました（詳細は隠蔽）');
      } else {
        setCredentialsJson('');
        setMessage('⚠️ 未登録状態です');
      }
      setError('');
    } catch (err) {
      setError(`❌ Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Credentials を削除
  const handleDelete = async () => {
    if (!userId) {
      setError('User ID を入力してください');
      return;
    }

    if (!window.confirm(`${credentialType} の credentials を削除しますか？`)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/credentials/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          credential_type: credentialType,
        }),
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('このユーザーは登録されていません（subscribed_users に存在しません）');
        }
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete credentials');
      }

      const data = await response.json();
      setMessage(`✅ ${data.message}`);
      resetForm();
    } catch (err) {
      setError(`❌ Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // 登録済みユーザー数を取得
  const handleListUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/credentials/list/${credentialType}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to list users');
      }

      const data = await response.json();
      // APIはユーザー数のみを返す（詳細情報はマスク）
      setRegisteredCount(data.registered_count || 0);
      setShowList(true);
      setError('');
    } catch (err) {
      setError(`❌ Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Credentials Manager</h1>
          <p className="text-slate-400">Gmail と SNS の認証情報を一元管理</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* メインフォーム */}
          <div className="lg:col-span-2 space-y-6">
            {/* Credential Type セレクト */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <label className="block text-sm font-semibold text-slate-200 mb-3">
                Credential Type
              </label>
              <select
                value={credentialType}
                onChange={(e) => {
                  setCredentialType(e.target.value);
                  resetForm();
                }}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="gmail">Gmail</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="twitter">Twitter</option>
                <option value="tiktok">TikTok</option>
              </select>
            </div>

            {/* User ID */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <label className="block text-sm font-semibold text-slate-200 mb-3">
                User ID
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="例: user123"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Credentials JSON */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <label className="block text-sm font-semibold text-slate-200 mb-3">
                Credentials JSON
              </label>
              <textarea
                value={credentialsJson}
                onChange={(e) => setCredentialsJson(e.target.value)}
                placeholder='例: {"access_token": "..."}'
                className="w-full h-40 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              />
              {/* プレースホルダー情報 */}
              {placeholder && (
                <div className="mt-4 pt-4 border-t border-slate-600">
                  {placeholder.requirement && (
                    <div className="mb-3 text-sm">
                      <span className="text-amber-400 font-semibold">⚠️ 要件: </span>
                      <span className="text-slate-300">{placeholder.requirement}</span>
                    </div>
                  )}
                  <div className="mb-3">
                    <div className="text-sm text-slate-400 mb-2">📋 プレースホルダー例:</div>
                    <pre className="bg-slate-900 p-3 rounded text-xs text-slate-300 overflow-x-auto">
                      {JSON.stringify(placeholder.example, null, 2)}
                    </pre>
                  </div>
                  {placeholder.source && (
                    <div className="text-xs text-slate-400">
                      📌 取得元: {placeholder.source}
                    </div>
                  )}
                  <button
                    onClick={() => setCredentialsJson(JSON.stringify(placeholder.example, null, 2))}
                    className="mt-3 text-blue-400 hover:text-blue-300 text-sm font-semibold"
                  >
                    → プレースホルダーを入力欄にコピー
                  </button>
                </div>
              )}
            </div>

            {/* メッセージ表示 */}
            {message && (
              <div className="bg-green-900 border border-green-700 text-green-200 px-4 py-3 rounded-lg">
                {message}
              </div>
            )}

            {error && (
              <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* ボタングループ */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                💾 保存
              </button>
              <button
                onClick={handleGet}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                📥 取得
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 col-span-2"
              >
                🗑️ 削除
              </button>
            </div>
          </div>

          {/* サイドバー - ユーザー一覧 */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 h-fit">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">登録済みユーザー</h2>
              <button
                onClick={handleListUsers}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                🔄 更新
              </button>
            </div>

            {showList ? (
              <>
                {registeredCount > 0 ? (
                  <div className="bg-slate-700 rounded p-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-300 mb-2">
                        {registeredCount}
                      </div>
                      <div className="text-sm text-slate-300">
                        ユーザーが登録済み
                      </div>
                      <div className="text-xs text-slate-400 mt-3">
                        ※ 詳細情報はマスクされています
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-400 text-sm">
                    登録済みユーザーなし
                  </div>
                )}
              </>
            ) : (
              <div className="text-slate-400 text-sm">
                更新ボタンをクリックして登録済みユーザー数を表示
              </div>
            )}
          </div>
        </div>

        {/* フッター */}
        <div className="mt-12 pt-8 border-t border-slate-700 text-center text-slate-400 text-sm">
          <p>API Base URL: {API_BASE_URL}</p>
          <p className="mt-2">環境変数 <code className="bg-slate-700 px-2 py-1 rounded">NEXT_PUBLIC_API_URL</code> で変更可能</p>
        </div>
      </div>
    </div>
  );
}
