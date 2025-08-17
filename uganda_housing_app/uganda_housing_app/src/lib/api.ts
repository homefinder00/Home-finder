// API utility for connecting to the backend with Sanctum authentication

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Cache system to prevent duplicate requests and store responses
const requestCache = new Map<string, Promise<any>>();
const responseCache = new Map<string, { data: any, timestamp: number }>();
const requestCacheTimeout = 5000; // 5 seconds for ongoing requests
const responseCacheTimeout = 5 * 60 * 1000; // 5 minutes for cached responses

// Clear cache function
export const clearApiCache = () => {
  requestCache.clear();
  responseCache.clear();
};

// Clear cache on startup to ensure fresh data
clearApiCache();

interface AuthTokens {
  access_token?: string;
  token?: string;
  token_type?: string;
}

// Token management
export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const setUser = (user: any) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export async function apiFetch(path: string, options?: RequestInit) {
  const url = `${API_BASE}${path.startsWith('/') ? path : '/' + path}`;
  const method = options?.method || 'GET';
  const cacheKey = `${method}:${url}`;
  
  // For GET requests, check response cache first
  if (method === 'GET') {
    const cachedResponse = responseCache.get(cacheKey);
    if (cachedResponse && Date.now() - cachedResponse.timestamp < responseCacheTimeout) {
      console.log(`Using cached response for: ${url}`);
      return cachedResponse.data;
    }
    
    // Check for ongoing request
    if (requestCache.has(cacheKey)) {
      console.log(`Using ongoing request for: ${url}`);
      return requestCache.get(cacheKey);
    }
  }
  
  const token = getAuthToken();
  
  console.log(`Making new API request to: ${url}`);
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // Add any existing headers from options
  if (options?.headers) {
    Object.assign(headers, options.headers);
  }

  // Add authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const requestPromise = fetch(url, {
    credentials: 'include', // Important for Sanctum
    headers,
    ...options,
  }).then(async (response) => {
    if (!response.ok) {
      // Handle unauthorized responses
      if (response.status === 401) {
        removeAuthToken();
        throw new Error('Authentication required');
      }
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Cache successful GET responses
    if (method === 'GET') {
      responseCache.set(cacheKey, { data, timestamp: Date.now() });
    }
    
    return data;
  }).catch((error) => {
    console.error('API request failed:', error);
    throw error;
  }).finally(() => {
    // Remove from request cache after completion
    requestCache.delete(cacheKey);
  });
  
  // Cache ongoing requests for GET methods
  if (method === 'GET') {
    requestCache.set(cacheKey, requestPromise);
  }
  
  return requestPromise;
}

// Authentication functions
export const login = async (email: string, password: string) => {
  const response = await apiFetch('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  if (response.success && response.data) {
    setAuthToken(response.data.token);
    setUser(response.data.user);
  }
  
  return response;
};

export const register = async (userData: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  user_type: 'tenant' | 'landlord';
}) => {
  const response = await apiFetch('/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  
  if (response.success && response.data) {
    setAuthToken(response.data.token);
    setUser(response.data.user);
  }
  
  return response;
};

export const logout = async () => {
  try {
    await apiFetch('/logout', {
      method: 'POST',
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    removeAuthToken();
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await apiFetch('/user');
    if (response.success && response.data) {
      setUser(response.data.user);
      return response.data.user;
    }
  } catch (error) {
    console.error('Get current user error:', error);
    removeAuthToken();
  }
  return null;
};

export const refreshToken = async () => {
  try {
    const response = await apiFetch('/refresh-token', {
      method: 'POST',
    });
    
    if (response.success && response.data) {
      setAuthToken(response.data.token);
      return true;
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    removeAuthToken();
  }
  return false;
};

// Property functions
export const fetchProperties = () => apiFetch('/properties');

export const fetchProperty = (id: number) => apiFetch(`/properties/${id}`);

export const createProperty = (data: any) => 
  apiFetch('/properties', {
    method: 'POST',
    body: JSON.stringify(data)
  });

export const updateProperty = (id: number, data: any) => 
  apiFetch(`/properties/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });

export const contactLandlord = (propertyId: string, phone: string) =>
  apiFetch('/contact-landlord', {
    method: 'POST',
    body: JSON.stringify({ propertyId, phone }),
  });

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Check if user is landlord
export const isLandlord = (): boolean => {
  const user = getUser();
  return user?.user_type === 'landlord';
};

// Check if user is tenant
export const isTenant = (): boolean => {
  const user = getUser();
  return user?.user_type === 'tenant';
};
