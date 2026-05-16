// All 48 qualified teams for FIFA World Cup 2026
// Groups and flags use emoji for zero-dependency display
export const WORLD_CUP_TEAMS = [
  // CONMEBOL (6)
  { name: 'Argentina', flag: '🇦🇷', confederation: 'CONMEBOL' },
  { name: 'Brazil', flag: '🇧🇷', confederation: 'CONMEBOL' },
  { name: 'Colombia', flag: '🇨🇴', confederation: 'CONMEBOL' },
  { name: 'Ecuador', flag: '🇪🇨', confederation: 'CONMEBOL' },
  { name: 'Uruguay', flag: '🇺🇾', confederation: 'CONMEBOL' },
  { name: 'Paraguay', flag: '🇵🇾', confederation: 'CONMEBOL' },

  // UEFA (16)
  { name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', confederation: 'UEFA' },
  { name: 'France', flag: '🇫🇷', confederation: 'UEFA' },
  { name: 'Germany', flag: '🇩🇪', confederation: 'UEFA' },
  { name: 'Spain', flag: '🇪🇸', confederation: 'UEFA' },
  { name: 'Portugal', flag: '🇵🇹', confederation: 'UEFA' },
  { name: 'Netherlands', flag: '🇳🇱', confederation: 'UEFA' },
  { name: 'Belgium', flag: '🇧🇪', confederation: 'UEFA' },
  { name: 'Croatia', flag: '🇭🇷', confederation: 'UEFA' },
  { name: 'Switzerland', flag: '🇨🇭', confederation: 'UEFA' },
  { name: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', confederation: 'UEFA' },
  { name: 'Austria', flag: '🇦🇹', confederation: 'UEFA' },
  { name: 'Norway', flag: '🇳🇴', confederation: 'UEFA' },
  { name: 'Bosnia and Herzegovina', flag: '🇧🇦', confederation: 'UEFA' },
  { name: 'Sweden', flag: '🇸🇪', confederation: 'UEFA' },
  { name: 'Turkey', flag: '🇹🇷', confederation: 'UEFA' },
  { name: 'Czech Republic', flag: '🇨🇿', confederation: 'UEFA' },

  // CONCACAF (6)
  { name: 'United States', flag: '🇺🇸', confederation: 'CONCACAF' },
  { name: 'Mexico', flag: '🇲🇽', confederation: 'CONCACAF' },
  { name: 'Canada', flag: '🇨🇦', confederation: 'CONCACAF' },
  { name: 'Haiti', flag: '🇭🇹', confederation: 'CONCACAF' },
  { name: 'Panama', flag: '🇵🇦', confederation: 'CONCACAF' },
  { name: 'Curaçao', flag: '🇨🇼', confederation: 'CONCACAF' },

  // CAF (10)
  { name: 'Morocco', flag: '🇲🇦', confederation: 'CAF' },
  { name: 'Senegal', flag: '🇸🇳', confederation: 'CAF' },
  { name: 'Egypt', flag: '🇪🇬', confederation: 'CAF' },
  { name: 'Ivory Coast', flag: '🇨🇮', confederation: 'CAF' },
  { name: 'Algeria', flag: '🇩🇿', confederation: 'CAF' },
  { name: 'Ghana', flag: '🇬🇭', confederation: 'CAF' },
  { name: 'South Africa', flag: '🇿🇦', confederation: 'CAF' },
  { name: 'Cape Verde', flag: '🇨🇻', confederation: 'CAF' },
  { name: 'Tunisia', flag: '🇹🇳', confederation: 'CAF' },
  { name: 'DR Congo', flag: '🇨🇩', confederation: 'CAF' },

  // AFC (9)
  { name: 'Japan', flag: '🇯🇵', confederation: 'AFC' },
  { name: 'South Korea', flag: '🇰🇷', confederation: 'AFC' },
  { name: 'Australia', flag: '🇦🇺', confederation: 'AFC' },
  { name: 'Iran', flag: '🇮🇷', confederation: 'AFC' },
  { name: 'Saudi Arabia', flag: '🇸🇦', confederation: 'AFC' },
  { name: 'Qatar', flag: '🇶🇦', confederation: 'AFC' },
  { name: 'Uzbekistan', flag: '🇺🇿', confederation: 'AFC' },
  { name: 'Iraq', flag: '🇮🇶', confederation: 'AFC' },
  { name: 'Jordan', flag: '🇯🇴', confederation: 'AFC' },

  // OFC (1)
  { name: 'New Zealand', flag: '🇳🇿', confederation: 'OFC' },
]

export const CONFEDERATION_COLORS = {
  UEFA: 'bg-blue-100 text-blue-800',
  CONMEBOL: 'bg-green-100 text-green-800',
  CONCACAF: 'bg-red-100 text-red-800',
  CAF: 'bg-yellow-100 text-yellow-800',
  AFC: 'bg-purple-100 text-purple-800',
  OFC: 'bg-gray-100 text-gray-800',
}
