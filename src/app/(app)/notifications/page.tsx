import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, MessageSquare, Heart, Zap } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const notifications = [
  {
    id: 1,
    type: "new_match",
    title: "New Match!",
    description: "You and Sophia have liked each other.",
    time: "5m ago",
    read: false,
    icon: <Heart className="w-5 h-5 text-rose-500" />,
  },
  {
    id: 2,
    type: "new_message",
    title: "New Message from Liam",
    description: "That was a fun game! Rematch soon?",
    time: "1h ago",
    read: false,
    icon: <MessageSquare className="w-5 h-5 text-blue-500" />,
  },
  {
    id: 3,
    type: "game_invite",
    title: "Game Invite from Chloe",
    description: "Chloe wants to play the 'Spicy' deck with you.",
    time: "3h ago",
    read: true,
    icon: <Zap className="w-5 h-5 text-orange-500" />,
  },
    {
    id: 4,
    type: "new_message",
    title: "New Message from Mason",
    description: "Let's do this! Vibe Check, Date mode?",
    time: "1d ago",
    read: true,
    icon: <MessageSquare className="w-5 h-5 text-blue-500" />,
  },
];

export default function NotificationsPage() {
  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-headline font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground">You have {unreadNotifications} unread notifications.</p>
        </div>
        <Button variant="outline">Mark all as read</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col">
            {notifications.map((notification, index) => (
              <div key={notification.id}>
                <div className={cn(
                    "flex items-start gap-4 p-4 hover:bg-muted/50 cursor-pointer transition-colors duration-200",
                    !notification.read && "bg-primary/5"
                    )}>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                    {notification.icon}
                  </div>
                  <div className="grid gap-1.5 flex-1">
                    <div className="flex items-baseline gap-2">
                        <p className={cn("font-semibold", !notification.read && "text-primary")}>{notification.title}</p>
                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                  </div>
                  {!notification.read && (
                      <div className="h-2.5 w-2.5 rounded-full bg-primary mt-2"></div>
                  )}
                </div>
                {index < notifications.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
