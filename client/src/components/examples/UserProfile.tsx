import UserProfile from '../UserProfile';

export default function UserProfileExample() {
  const mockStats = {
    totalKg: 45.5,
    points: 650,
    streakDays: 12
  };

  return (
    <div className="h-screen">
      <UserProfile stats={mockStats} />
    </div>
  );
}
