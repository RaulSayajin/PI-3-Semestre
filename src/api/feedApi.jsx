const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/avaliacoes';

// Helper para requisições com token
const request = async (endpoint, { method = 'GET', body, token } = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));    
    throw new Error(errorData.message || 'Erro na requisição');
  }

  return res.json();
};

// --- Funções completas do feed/avaliações ---
export const AvaliacaoAPI = {
  // CRUD de avaliações
  createRating: (data, token) => request('/', { method: 'POST', body: data, token }),
  updateRating: (id, data, token) => request(`/${id}`, { method: 'PUT', body: data, token }),
  deleteRating: (id, token) => request(`/${id}`, { method: 'DELETE', token }), // Token é necessário para autorização
  
  // Interações
  toggleLike: (id, token) => request(`/${id}/like`, { method: 'POST', token }),
  addComment: (id, texto, token) => request(`/${id}/comment`, { method: 'POST', body: { texto }, token }),
  shareReview: (id) => request(`/${id}/share`, { method: 'POST' }),

  // Feed
  getGlobalFeed: () => request('/feed/global'),
  getFollowingFeed: (token) => request('/feed/following', { token }),
  getTrendingFeed: () => request('/feed/trending'),
  getRatingsForItem: (itemId) => request(`/item/${itemId}`),
  
  // Perfil do usuário
  getUserTopArtists: (token) => request('/user/top-artists', { token }),
  getUserTopTracks: (token) => request('/user/top-tracks', { token }),
  getUserReviews: (token) => request('/user/me', { token }),

  // Atualização do perfil do usuário
  updateUserProfile: (data, token) => request('/user/profile', { method: 'PUT', body: data, token, baseUrl: 'http://localhost:3000/api' }),

  // Upload de imagem de capa
  uploadCapa: async (formData, token) => {
    const res = await fetch(`http://localhost:3000/api/user/profile/capa`, {
      method: 'POST',
      headers: {
        // Não defina 'Content-Type', o navegador fará isso automaticamente para FormData
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Erro no upload da imagem');
    }

    return res.json();
  },
};