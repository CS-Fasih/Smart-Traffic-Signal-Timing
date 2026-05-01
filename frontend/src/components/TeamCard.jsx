import './TeamCard.css';

const avatarColors = [
  'linear-gradient(135deg, #00d4ff, #7b2ff7)',
  'linear-gradient(135deg, #00ff88, #00d4ff)',
  'linear-gradient(135deg, #ff6b35, #ffa726)',
  'linear-gradient(135deg, #ff4757, #ff6b35)',
  'linear-gradient(135deg, #7b2ff7, #448aff)',
];

export default function TeamCard({ name, rollNo, index = 0 }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="team-card glass-card animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="team-avatar" style={{ background: avatarColors[index % avatarColors.length] }}>
        {initials}
      </div>
      <h3 className="team-name">{name}</h3>
      <span className="team-roll badge badge-info">{rollNo}</span>
    </div>
  );
}
