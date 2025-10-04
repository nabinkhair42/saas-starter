import {
  FaGlobe,
  FaGithub,
  FaXTwitter,
  FaLinkedin,
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaTiktok,
  FaDiscord,
} from 'react-icons/fa6';

// Social platform constants
export const SOCIAL_PLATFORMS = {
  website: {
    label: 'Website',
    icon: FaGlobe,
    placeholder: 'https://yourwebsite.com',
  },
  github: {
    label: 'GitHub',
    icon: FaGithub,
    placeholder: 'https://github.com/username',
  },
  twitter: {
    label: 'Twitter',
    icon: FaXTwitter,
    placeholder: 'https://twitter.com/username',
  },
  linkedin: {
    label: 'LinkedIn',
    icon: FaLinkedin,
    placeholder: 'https://linkedin.com/in/username',
  },
  instagram: {
    label: 'Instagram',
    icon: FaInstagram,
    placeholder: 'https://instagram.com/username',
  },
  facebook: {
    label: 'Facebook',
    icon: FaFacebook,
    placeholder: 'https://facebook.com/username',
  },
  youtube: {
    label: 'YouTube',
    icon: FaYoutube,
    placeholder: 'https://youtube.com/@username',
  },
  tiktok: {
    label: 'TikTok',
    icon: FaTiktok,
    placeholder: 'https://tiktok.com/@username',
  },
  discord: {
    label: 'Discord',
    icon: FaDiscord,
    placeholder: 'https://discord.gg/server',
  },
  other: { label: 'Other', icon: FaGlobe, placeholder: 'https://example.com' },
} as const;
