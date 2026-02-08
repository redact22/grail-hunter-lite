/**
 * Badge definitions for Grail Hunter gamification.
 */

export interface BadgeDef {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon name reference
}

export const BADGES: BadgeDef[] = [
  {
    id: 'first-scan',
    name: 'First Scan',
    description: 'Complete your first authentication scan',
    icon: 'Scan',
  },
  {
    id: 'eagle-eye',
    name: 'Eagle Eye',
    description: 'Get 3 scans with >90% confidence',
    icon: 'Eye',
  },
  {
    id: 'grail-hunter',
    name: 'Grail Hunter',
    description: 'Discover a Grail-tier item',
    icon: 'Trophy',
  },
  {
    id: 'forensic-expert',
    name: 'Forensic Expert',
    description: 'Complete 10 scans',
    icon: 'Fingerprint',
  },
  {
    id: 'authenticator',
    name: 'Authenticator',
    description: 'Authenticate 5 genuine items',
    icon: 'ShieldCheck',
  },
  {
    id: 'void-walker',
    name: 'Void Walker',
    description: 'Visit all 4 tabs',
    icon: 'Compass',
  },
];
