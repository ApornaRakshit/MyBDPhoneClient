import API from './api';

export const cmsApi = {
  header: () => API.get('/cms/public/header'),
  footer: () => API.get('/cms/public/footer'),
  contact: () => API.get('/cms/public/contact'),
  home: () => API.get('/cms/public/home'),
  page: (slug) => API.get(`/cms/public/page/${encodeURIComponent(slug)}`),
  collection: (key) => API.get(`/cms/public/collection/${encodeURIComponent(key)}`),
};
