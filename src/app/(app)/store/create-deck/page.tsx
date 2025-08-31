
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { X, Wand2, PlusCircle, Save, FileText, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateQuestion } from '@/ai/flows/generate-question-flow';

export default function CreateDeckPage() {
    const [deckName, setDeckName] = useState('');
    const [deckDescription, setDeckDescription] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [questions, setQuestions] = useState<string[]>([]);
    const [aiTopic, setAiTopic] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const { toast } = useToast();

    const handleAddQuestion = () => {
        if (currentQuestion.trim() === '') return;
        setQuestions([...questions, currentQuestion.trim()]);
        setCurrentQuestion('');
    };

    const handleRemoveQuestion = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const handleAiGenerate = async () => {
        if(aiTopic.trim() === '') {
            toast({ variant: 'destructive', title: 'Error', description: 'Please provide a topic for the AI.' });
            return;
        }
        setIsGenerating(true);
        try {
            const result = await generateQuestion({ topic: aiTopic });
            if (result.question) {
                setCurrentQuestion(result.question);
                toast({ title: 'AI Suggestion', description: 'A new question has been generated for you.' });
            }
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate AI question.' });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSaveDeck = () => {
        if (deckName.trim() === '' || questions.length === 0) {
            toast({
                variant: 'destructive',
                title: 'Cannot Save Deck',
                description: 'Please provide a deck name and add at least one question.',
            });
            return;
        }
        // In a real app, you would save this to a database
        console.log({ deckName, deckDescription, questions });
        toast({
            title: 'Deck Saved!',
            description: `Your custom deck "${deckName}" has been saved.`,
        });
    }

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-headline font-bold tracking-tight">Create Your Own Deck</h1>
                <Button onClick={handleSaveDeck}><Save className="mr-2"/>Save Deck</Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2"><FileText/> Deck Details</CardTitle>
                            <CardDescription>Give your new deck a name and a short description.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="deck-name">Deck Name</Label>
                                <Input 
                                    id="deck-name" 
                                    placeholder="e.g., Late Night Conversations" 
                                    value={deckName}
                                    onChange={(e) => setDeckName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="deck-description">Description</Label>
                                <Textarea 
                                    id="deck-description" 
                                    placeholder="e.g., Deep questions for after midnight." 
                                    value={deckDescription}
                                    onChange={(e) => setDeckDescription(e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2"><PlusCircle/> Add Questions</CardTitle>
                            <CardDescription>Add the questions for your deck. You have {questions.length} question(s) so far.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                <Textarea
                                    placeholder="Type your question here..."
                                    value={currentQuestion}
                                    onChange={(e) => setCurrentQuestion(e.target.value)}
                                    rows={3}
                                />
                                <Button onClick={handleAddQuestion} className="h-auto">Add</Button>
                            </div>

                            {questions.length > 0 && (
                                <>
                                    <Separator className="my-4" />
                                    <ul className="space-y-2 max-h-60 overflow-y-auto">
                                        {questions.map((q, index) => (
                                            <li key={index} className="flex items-center justify-between p-2 rounded-md bg-muted/50 text-sm">
                                                <span>{q}</span>
                                                <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => handleRemoveQuestion(index)}>
                                                    <X className="w-4 h-4 text-destructive" />
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
                
                <div className="lg:col-span-1">
                    <Card className="sticky top-6">
                        <CardHeader>
                            <CardTitle className="font-headline flex items-center gap-2"><Bot/> AI Assistant</CardTitle>
                            <CardDescription>Stuck for ideas? Let our AI help you out.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="ai-topic">Question Topic</Label>
                                <Input 
                                    id="ai-topic" 
                                    placeholder="e.g., First dates, self-love"
                                    value={aiTopic}
                                    onChange={(e) => setAiTopic(e.target.value)}
                                />
                            </div>
                            <Button className="w-full" onClick={handleAiGenerate} disabled={isGenerating}>
                                <Wand2 className="mr-2"/>
                                {isGenerating ? 'Generating...' : 'Generate Question'}
                            </Button>
                             <p className="text-xs text-muted-foreground text-center">The generated question will appear in the input box on the left, ready to be added.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
