-- SQL script to populate the posts table with mock data

-- Insert first post
INSERT INTO public.posts (title, slug, content, excerpt, published_at, updated_at, category, tags, author, author_image, cover_image)
VALUES (
  'Building AI-Powered Data Pipelines with Python and Docker',
  'ai-data-pipelines',
  '# Building AI-Powered Data Pipelines with Python and Docker

This is a sample blog post about AI-powered data pipelines.',
  'Learn how to create efficient, scalable data pipelines that leverage machine learning for real-time insights.',
  '2025-03-10T10:00:00Z',
  '2025-03-10T10:00:00Z',
  'AI/ML',
  ARRAY['Python', 'Docker', 'Machine Learning', 'Data Engineering'],
  'Rowand Mohammad',
  NULL,
  NULL
);

-- Insert second post
INSERT INTO public.posts (title, slug, content, excerpt, published_at, updated_at, category, tags, author, author_image, cover_image)
VALUES (
  'Raspberry Pi Cluster: Building a Mini Kubernetes Environment',
  'raspberry-pi-kubernetes',
  '# Raspberry Pi Cluster: Building a Mini Kubernetes Environment

This is a sample blog post about building a Raspberry Pi Kubernetes cluster.',
  'A step-by-step guide to creating your own mini K8s cluster for learning and development.',
  '2025-03-05T14:30:00Z',
  '2025-03-05T14:30:00Z',
  'Hardware Integration',
  ARRAY['Raspberry Pi', 'Kubernetes', 'DevOps', 'Homelab'],
  'Rowand Mohammad',
  NULL,
  NULL
);

-- Insert third post
INSERT INTO public.posts (title, slug, content, excerpt, published_at, updated_at, category, tags, author, author_image, cover_image)
VALUES (
  'Implementing Zero-Trust Security in Enterprise Environments',
  'zero-trust-security',
  '# Implementing Zero-Trust Security in Enterprise Environments

This is a sample blog post about implementing zero-trust security.',
  'How to architect and deploy modern security principles in complex organizational setups.',
  '2025-02-28T09:15:00Z',
  '2025-02-28T09:15:00Z',
  'Enterprise Solutions',
  ARRAY['Security', 'Zero-Trust', 'Enterprise', 'Cybersecurity'],
  'Rowand Mohammad',
  NULL,
  NULL
); 