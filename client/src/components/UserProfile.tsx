import { Leaf, Award, Calendar, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface UserStats {
  totalKg: number;
  points: number;
  streakDays: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  icon: string;
}

interface UserProfileProps {
  stats: UserStats;
}

export default function UserProfile({ stats }: UserProfileProps) {
  const monthlyData = [
    { month: "Ene", kg: 12 },
    { month: "Feb", kg: 15 },
    { month: "Mar", kg: 8 },
    { month: "Abr", kg: 18 },
    { month: "May", kg: 22 },
    { month: "Jun", kg: 25 },
  ];

  const achievements: Achievement[] = [
    {
      id: "1",
      name: "Primer paso",
      description: "Reciclaste por primera vez",
      unlocked: true,
      icon: "🌱"
    },
    {
      id: "2",
      name: "Eco guerrero",
      description: "10kg de material reciclado",
      unlocked: true,
      icon: "♻️"
    },
    {
      id: "3",
      name: "Racha de 7 días",
      description: "Reciclaste 7 días seguidos",
      unlocked: stats.streakDays >= 7,
      icon: "🔥"
    },
    {
      id: "4",
      name: "Experto",
      description: "50kg de material reciclado",
      unlocked: stats.totalKg >= 50,
      icon: "🏆"
    },
    {
      id: "5",
      name: "Guardián del planeta",
      description: "100kg de material reciclado",
      unlocked: stats.totalKg >= 100,
      icon: "🌍"
    },
  ];

  const nextLevelPoints = 1000;
  const progressToNextLevel = (stats.points / nextLevelPoints) * 100;

  return (
    <div className="h-full overflow-auto p-4 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Mi Perfil</h2>
        <p className="text-muted-foreground">Rastrea tu impacto ambiental</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-md">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Reciclado</p>
              <p className="text-3xl font-bold" data-testid="text-total-kg">{stats.totalKg} kg</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent rounded-md">
              <Award className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Puntos</p>
              <p className="text-3xl font-bold" data-testid="text-points">{stats.points}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-container-medium/10 rounded-md">
              <Calendar className="h-6 w-6 text-container-medium" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Racha</p>
              <p className="text-3xl font-bold" data-testid="text-streak">{stats.streakDays} días</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Progreso al siguiente nivel</h3>
              <p className="text-sm text-muted-foreground">{stats.points} / {nextLevelPoints} puntos</p>
            </div>
            <Badge variant="outline" className="text-base">
              Nivel {Math.floor(stats.points / 100) + 1}
            </Badge>
          </div>
          <Progress value={progressToNextLevel} className="h-3" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Estadísticas mensuales</h3>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="month" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <Bar dataKey="kg" fill="hsl(142 71% 45%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <div>
        <h3 className="text-lg font-semibold mb-4">Logros</h3>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
          {achievements.map((achievement) => (
            <button
              key={achievement.id}
              data-testid={`achievement-${achievement.id}`}
              className={`p-4 rounded-md hover-elevate active-elevate-2 transition-all ${
                achievement.unlocked ? 'bg-card' : 'bg-muted opacity-50'
              }`}
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <span className="text-3xl">{achievement.icon}</span>
                <span className="text-xs font-medium">{achievement.name}</span>
                {achievement.unlocked && (
                  <Badge variant="outline" className="text-xs">
                    Desbloqueado
                  </Badge>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
