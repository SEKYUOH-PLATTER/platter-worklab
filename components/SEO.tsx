
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonical?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title = "Platter WorkLab | B2B AI Education", 
  description = "비전공자 실무팀을 위한 데이터 기반 일하는 방식 & AI 활용 워크숍. 단순 툴 교육이 아닌, 일을 바라보는 관점을 바꿉니다.", 
  ogImage = "https://platter.lab/og-image.jpg",
  ogType = "website",
  canonical
}) => {
  const fullTitle = title.includes("Platter") ? title : `${title} | Platter WorkLab`;
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Platter WorkLab" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {canonical && <link rel="canonical" href={canonical} />}
    </Helmet>
  );
};

export default SEO;