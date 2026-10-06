import React from 'react';
import { useParams } from 'react-router-dom';
import DynamicCMSPage from './DynamicCMSPage';

export const FeaturePage = ({ slug: slugProp }) => {
  const params = useParams();
  const slug = slugProp || params.slug || 'multi-device-ringing';
  return <DynamicCMSPage slug={slug} />;
};

export default FeaturePage;
