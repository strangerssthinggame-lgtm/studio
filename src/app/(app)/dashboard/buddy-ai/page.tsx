import BuddyAiGenerator from "@/components/buddy-ai-generator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BuddyAIPage() {
    const exampleInteraction = `User A: Not much, just chilling and watching a movie. You?
User B: Same here! What are you watching?
User A: The new sci-fi movie on Netflux. It's pretty good so far.`;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-headline font-semibold tracking-tight">
            Buddy AI
          </h1>
          <p className="text-sm text-muted-foreground">
            Your personal conversation assistant. Let Buddy AI suggest your next line.
          </p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle className="font-headline">Generate with Buddy AI</CardTitle>
            <CardDescription>Enter the previous conversation and select some vibe tags to get a suggestion.</CardDescription>
        </CardHeader>
        <CardContent>
             <div className="mb-4">
                <Label htmlFor="conversation">Previous Conversation</Label>
                <Textarea id="conversation" placeholder="Enter previous messages here..." className="mt-2" defaultValue={exampleInteraction} rows={5} readOnly/>
                <p className="text-xs text-muted-foreground mt-1">This is a read-only example. In a real chat, this would be filled automatically.</p>
             </div>
             <BuddyAiGenerator previousInteractions={exampleInteraction} />
        </CardContent>
      </Card>
    </div>
  );
}
