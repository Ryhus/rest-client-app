import GHLogo from '@/assets/img/gh_logo.png';
import './Card.scss';

interface Profile {
  id: number;
  image: string;
  name: string;
  role: string;
  description: string;
  gh: string;
}

export default function Card(profile: Profile) {
  return (
    <div className="card-container">
      <div className="card-image">
        <img src={profile.image} alt={profile.name} />
      </div>
      <div className="card-content">
        <h1 className="card-title">{profile.name}</h1>
        <p className="card-role">{profile.role}</p>
        <p className="card-description">{profile.description}</p>
        <a
          className={profile.role === 'team lead' ? 'card-link-primary' : 'card-link'}
          href={profile.gh}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={GHLogo} alt="GH Logo" />
        </a>
      </div>
    </div>
  );
}
