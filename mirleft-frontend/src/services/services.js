import api from './api';

export const authService = {
    register: (data) => api.post('/register', data),
    login: (data) => api.post('/login', data),
    logout: () => api.post('/logout'),
    getProfile: () => api.get('/me'),
    updateProfile: (data) => api.patch('/me', data),
};

export const propertyService = {
    getAll: (params) => api.get('/properties', { params }),
    search: (params) => api.get('/properties/search', { params }),
    getById: (id) => api.get(`/properties/${id}`),
    create: (data) => api.post('/properties', data),
    update: (id, data) => api.patch(`/properties/${id}`, data),
    delete: (id) => api.delete(`/properties/${id}`),
};

export const destinationService = {
    getAll: (params) => api.get('/destinations', { params }),
    getBySlug: (slug) => api.get(`/destinations/${slug}`),
    create: (data) => api.post('/destinations', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    update: (id, data) => api.patch(`/destinations/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
    delete: (id) => api.delete(`/destinations/${id}`),
};

export const restaurantService = {
    getAll: (params) => api.get('/restaurants', { params }),
    search: (params) => api.get('/restaurants/search', { params }),
    getById: (id) => api.get(`/restaurants/${id}`),
    create: (data) => api.post('/restaurants', data),
    update: (id, data) => api.patch(`/restaurants/${id}`, data),
    delete: (id) => api.delete(`/restaurants/${id}`),
};

export const activityService = {
    getAll: (params) => api.get('/activities', { params }),
    search: (params) => api.get('/activities/search', { params }),
    getById: (id) => api.get(`/activities/${id}`),
    create: (data) => api.post('/activities', data),
    update: (id, data) => api.patch(`/activities/${id}`, data),
    delete: (id) => api.delete(`/activities/${id}`),
};

export const homeService = {
    getHome: () => api.get('/home'),
    search: (params) => api.get('/search', { params }),
};

export const vacationRentalService = {
    getAll: (params) => api.get('/vacation-rentals', { params }),
};

export const chatService = {
    send: (message, meta = undefined) => api.post('/chat', meta ? { message, ...meta } : { message }),
};

export const faqService = {
    getAll: (params) => api.get('/faqs', { params }),
};

export const bookingService = {
    create: (data) => api.post('/bookings', data),
    getAll: () => api.get('/bookings'),
    cancel: (id) => api.patch(`/bookings/${id}/cancel`),
};

export const reviewService = {
    getByItem: (params) => api.get('/reviews', { params }),
    create: (data) => api.post('/reviews', data),
    update: (id, data) => api.patch(`/reviews/${id}`, data),
    delete: (id) => api.delete(`/reviews/${id}`),
};

export const favoriteService = {
    getAll: () => api.get('/favorites'),
    toggle: (data) => api.post('/favorites/toggle', data),
    add: (data) => api.post('/favorites', data),
    remove: (id) => api.delete(`/favorites/${id}`),
    isFavorite: (data) => api.post('/favorites/check', data),
};

export const contactService = {
    send: (data) => api.post('/contact', data),
};

export const newsletterService = {
    subscribe: (data) => api.post('/newsletter/subscribe', data),
    unsubscribe: (data) => api.post('/newsletter/unsubscribe', data),
};

export const amenityService = {
    getAll: () => api.get('/amenities'),
};

export const adminService = {
    dashboard: () => api.get('/admin/dashboard'),
    users: (params) => api.get('/admin/users', { params }),
    updateUser: (id, data) => api.patch(`/admin/users/${id}`, data),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    reviews: (params) => api.get('/admin/reviews', { params }),
    moderateReview: (id, status) => api.patch(`/admin/reviews/${id}/moderate`, { status }),
    banUser: (id) => api.patch(`/admin/users/${id}/ban`),
    unbanUser: (id) => api.patch(`/admin/users/${id}/unban`),
};
