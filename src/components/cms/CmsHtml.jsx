import React from 'react';

const sanitize = (html = '') => String(html)
  .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
  .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, '')
  .replace(/javascript:/gi, '')
  .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, '');

export const CmsHtml = ({ html, className = '' }) => (
  <div className={className} dangerouslySetInnerHTML={{ __html: sanitize(html || '') }} />
);
