
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send, MoreVertical, Zap, Wand2 } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import GameSelectionDialog from "@/components/game-selection-dialog";
import CoinToss from "@/components/coin-toss";
import GameCard from "@/components/game-card";
import VibeCheckCard from "@/components/vibe-check-card";
import { VibeCheckResults } from "@/components/vibe-check-results";
import { notFound, useRouter, useParams } from 'next/navigation';
import Link from "next/link";
import { AIPromptPopover } from "@/components/ai-prompt-popover";
import { ChallengeCard } from "@/components/challenge-card";
import { useAuth } from "@/hooks/use-auth";
import { firestore } from "@/lib/firebase";
import { doc, getDoc, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";
import type { Chat } from "@/lib/chat-data";
import { useChatMessages, Message } from "@/hooks/use-chat-messages";
import { Skeleton } from "@/components/ui/skeleton";


export type DeckTheme = 'default' | 'friends' | 'date' | 'spicy';
export type GameType = 'vibe' | 'truth-or-dare';
export type GameLevel = 1 | 2 | 3;

export default function ChatPage() {
  const params = useParams();
  const chatId = params.id as string;
  const { user: currentUser, loading: authLoading } = useAuth();
  const router = useRouter();

  const [chat, setChat] = useState<Chat | null>(null);
  const { messages, loading: messagesLoading } = useChatMessages(chatId);
  const [otherUser, setOtherUser] = useState<{ id: string; name: string; avatar: string } | null>(null);
  
  const [inputValue, setInputValue] = useState("");
  const [isGameSelectionOpen, setIsGameSelectionOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState<DeckTheme>(chat?.vibe as DeckTheme || 'default');
  const [gameStage, setGameStage] = useState<'none' | 'toss' | 'playing'>('none');
  const [deckName, setDeckName] = useState<'Friends' | 'Date' | 'Spicy' | ''>('');
  const [gameType, setGameType] = useState<GameType | null>(null);
  const [gameLevel, setGameLevel] = useState<GameLevel | null>(null);
  const [gameTurn, setGameTurn] = useState<'me' | 'them' | null>(null);
  const [isAwaitingAnswer, setIsAwaitingAnswer] = useState(false);
  const [vibeCheckState, setVibeCheckState] = useState<'needed' | 'in_progress' | 'complete'>('needed');
  const [vibeCheckMatches, setVibeCheckMatches] = useState(0);

  useEffect(() => {
    if (!chatId || !currentUser) return;

    const fetchChatInfo = async () => {
        const chatDocRef = doc(firestore, 'chats', chatId);
        const chatDocSnap = await getDoc(chatDocRef);

        if (!chatDocSnap.exists()) {
            return notFound();
        }

        const chatData = chatDocSnap.data() as Chat;
        setChat(chatData);
        setActiveTheme(chatData.vibe as DeckTheme || 'default');

        const otherUserId = chatData.userIds.find(id => id !== currentUser.uid);
        if (otherUserId) {
            const userDocRef = doc(firestore, 'users', otherUserId);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                setOtherUser({
                    id: userDocSnap.id,
                    name: userData.name,
                    avatar: userData.avatar,
                });
            }
        }
    };

    fetchChatInfo();
  }, [chatId, currentUser]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '' || !canAnswer || !currentUser || !chatId) return;

    const messagesCollectionRef = collection(firestore, 'chats', chatId, 'messages');
    
    await addDoc(messagesCollectionRef, {
        text: inputValue,
        senderId: currentUser.uid,
        timestamp: serverTimestamp(),
        type: 'answer',
    });

    setInputValue('');
    setIsAwaitingAnswer(false);
    
    // After I answer, it becomes the opponent's turn to ask a question.
    setGameTurn('them'); 
  };

  const handleGameSelect = (deck: 'Friends' | 'Date' | 'Spicy', type: GameType, level: GameLevel) => {
    setActiveTheme(deck.toLowerCase() as DeckTheme);
    setDeckName(deck);
    setGameType(type);
    setGameLevel(level);
    setIsGameSelectionOpen(false);
    setGameStage('toss');
  }

  const handleTossFinish = (winner: 'You' | string) => {
    setGameStage('playing');
    setGameTurn(winner === 'You' ? 'me' : 'them');
  }
  
  const handleGameFinish = () => {
    setGameStage('none');
    setActiveTheme(chat?.vibe as DeckTheme || 'default');
    setDeckName('');
    setGameType(null);
    setGameLevel(null);
    setGameTurn(null);
    setIsAwaitingAnswer(false);
  }
  
  const handleSendVibeQuestion = (question: string) => {
    // This function is called when it's MY turn to ask a VIBE question
    const newMessage: Message = {
      id: (messages.length + 1).toString(),
      text: question,
      sender: 'me',
      type: 'question'
    };
    // TODO: save to firestore
    // setMessages(prev => [...prev, newMessage]);
    setGameTurn(null); // No one's turn until they answer.
    setIsAwaitingAnswer(true); // Now we are waiting for THEM to answer.

    // Simulate opponent's turn - this will be replaced with real-time listeners
  };
  
  const handleSendChallenge = (truth: string, dare: string) => {
    // This function is called when it's MY turn to send a challenge
    const newChallenge: Message = {
        id: (messages.length + 1).toString(),
        sender: 'me',
        type: 'challenge',
        challenge: {
            truth,
            dare,
            isResponded: false
        }
    };
    // TODO: Save to firestore
    // setMessages(prev => [...prev, newChallenge]);
    setGameTurn(null); // Turn is null while we wait for them to respond
    setIsAwaitingAnswer(true); // They need to respond to the challenge
  }

  const handleChallengeResponse = (messageId: string, choice: 'truth' | 'dare') => {
      // THIS IS THE OPPONENT's simulated response
      // TODO: Update in firestore
    //   setMessages(prev => prev.map(msg => 
    //     msg.id === messageId && msg.challenge
    //     ? { ...msg, challenge: {...msg.challenge, isResponded: true, choice: choice} }
    //     : msg
    //   ));
      
      setIsAwaitingAnswer(false); // I no longer need to wait for them to choose
  }

  const handleVibeCheckFinish = (matches: number) => {
    setVibeCheckMatches(matches);
    setVibeCheckState('complete');
  }

  const handleSuggestion = (prompt: string) => {
    setInputValue(prompt);
  }

  const isMyTurnInGame = gameStage === 'playing' && gameTurn === 'me';
  const isTheirTurnInGame = gameStage === 'playing' && gameTurn === 'them';
  const canAnswer = !messagesLoading && (gameStage === 'playing' && isAwaitingAnswer && (messages[messages.length-1]?.sender === 'them' && (messages[messages.length-1]?.type === 'question' || messages[messages.length-1]?.type === 'challenge')));
  
  const isChatInputDisabled = vibeCheckState !== 'complete' || (gameStage === 'playing' && !canAnswer);
  
  const placeholderText = () => {
    if (vibeCheckState !== 'complete') return "Complete the Vibe Check to start chatting...";
    if (canAnswer && gameType === 'vibe') return "It's your turn to answer...";
    if (isMyTurnInGame && gameType === 'truth-or-dare' && !isAwaitingAnswer) return `It's your turn to send a challenge...`;
    if (isAwaitingAnswer && gameType === 'truth-or-dare' && messages.length > 0 && messages[messages.length -1].sender === 'me') return `Waiting for ${otherUser?.name} to choose...`;
    if (isMyTurnInGame) return `It's your turn...`;
    if (isTheirTurnInGame) return `Waiting for ${otherUser?.name}...`;
    if (gameStage === 'playing') return "The game is in progress...";
    if (messagesLoading || authLoading) return "Loading chat...";
    return "Type a message...";
  }

  const conversationHistory = messages.map(m => `${m.sender === 'me' ? 'User A' : 'User B'}: ${m.text}`).join('\n');

  if (authLoading || !currentUser || !otherUser) {
    return (
        <div className="flex flex-col h-[calc(100vh_-_theme(spacing.24))] rounded-xl border">
            <div className="flex items-center p-4 border-b">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="ml-4 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                </div>
            </div>
            <div className="flex-1 p-4 space-y-4">
                <Skeleton className="h-16 w-3/4" />
                <Skeleton className="h-16 w-3/4 ml-auto" />
            </div>
             <div className="p-4 border-t">
                <Skeleton className="h-12 w-full" />
            </div>
        </div>
    )
  }

  // Hide main chat UI if Vibe Check is needed
  if (vibeCheckState === 'needed') {
      return (
        <div className="flex flex-col h-[calc(100vh_-_theme(spacing.24))] rounded-xl border items-center justify-center bg-muted/20">
            <VibeCheckCard 
                onGameFinish={handleVibeCheckFinish} 
                opponentName={otherUser.name} 
                opponentAvatar={otherUser.avatar} 
            />
        </div>
      )
  }

  return (
    <div className={cn(
        "flex flex-col h-[calc(100vh_-_theme(spacing.24))] rounded-xl border transition-colors duration-500 glassy",
        `theme-${activeTheme}`
    )}>
        <div className="flex items-center p-4 border-b bg-card/80 rounded-t-xl">
            <Link href={`/users/${otherUser.id}`} className="cursor-pointer">
              <Avatar>
                  <AvatarImage src={otherUser.avatar} alt={otherUser.name} data-ai-hint="profile avatar" />
                  <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </Link>
            <div className="ml-4 flex-1">
              <Link href={`/users/${otherUser.id}`} className="cursor-pointer">
                <p className="text-lg font-semibold font-headline">{otherUser.name}</p>
              </Link>
                 <div className="flex items-center gap-2">
                  {/* {chat.online && (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  )}
                  <p className="text-sm text-muted-foreground">{chat.online ? 'Online' : 'Offline'}</p> */}
                </div>
            </div>
            <GameSelectionDialog 
              open={isGameSelectionOpen} 
              onOpenChange={setIsGameSelectionOpen}
              onGameSelect={handleGameSelect}
            >
              <Button variant="outline" disabled={gameStage === 'playing'}>
                <Zap className="mr-2 h-4 w-4" />
                Start Game
              </Button>
            </GameSelectionDialog>
            <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5"/>
            </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-transparent">
            
            {vibeCheckState === 'complete' && <VibeCheckResults totalMatches={vibeCheckMatches} />}

            {gameStage === 'toss' && deckName && <CoinToss onTossFinish={handleTossFinish} deckName={deckName} opponentName={otherUser.name} opponentAvatar={otherUser.avatar} />}
            
            {isMyTurnInGame && !isAwaitingAnswer && deckName && gameType && gameLevel && (
                 <GameCard 
                    onGameFinish={handleGameFinish} 
                    deckName={deckName}
                    gameType={gameType}
                    gameLevel={gameLevel}
                    onSendVibeQuestion={handleSendVibeQuestion}
                    onSendChallenge={handleSendChallenge}
                    opponentName={otherUser.name}
                />
            )}
            
            {isTheirTurnInGame && !isAwaitingAnswer && (
                <div className="text-center text-muted-foreground p-4 bg-muted/50 rounded-lg">
                    <p>Waiting for {otherUser.name} to ask a question...</p>
                </div>
            )}

            <div className="space-y-4">
                  {messagesLoading ? (
                    <div className="text-center text-muted-foreground">Loading messages...</div>
                  ) : (
                    messages.map((message) => {
                      if (message.type === 'challenge' && message.challenge) {
                          return (
                               <ChallengeCard
                                  key={message.id}
                                  message={message}
                                  onRespond={handleChallengeResponse}
                                  currentUser={otherUser.id === message.senderId ? 'them' : 'me'}
                                  isMyTurnToRespond={message.sender === 'them' && gameTurn === 'me'}
                              />
                          )
                      }

                      return (
                          <div 
                              key={message.id} 
                              className={cn(
                                  "flex items-end gap-2",
                                  message.senderId === currentUser.uid ? 'justify-end' : 'justify-start'
                              )}
                          >
                              {message.senderId !== currentUser.uid && (
                                  <Link href={`/users/${otherUser.id}`}>
                                      <Avatar className="h-8 w-8">
                                          <AvatarImage src={otherUser.avatar} alt={otherUser.name} data-ai-hint="profile avatar"/>
                                          <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                  </Link>
                              )}
                              <div className={cn(
                                  "max-w-xs md:max-w-md lg:max-w-lg rounded-xl px-4 py-3 text-sm",
                                  message.type === 'question' 
                                      ? 'bg-muted border-2 border-primary/50 text-primary' 
                                      : (message.senderId === currentUser.uid
                                          ? 'bg-primary text-primary-foreground rounded-br-none' 
                                          : 'bg-muted rounded-bl-none')
                              )}>
                                  <p>{message.text}</p>
                              </div>
                          </div>
                      )
                    })
                  )}
            </div>
           
        </div>

        <div className="p-4 border-t bg-card/80 rounded-b-xl">
            <form className="relative" onSubmit={handleSendMessage}>
                <Input 
                    placeholder={placeholderText()}
                    className="pr-32" 
                    disabled={isChatInputDisabled}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                    <AIPromptPopover previousInteractions={conversationHistory} onSuggestion={handleSuggestion} isDisabled={isChatInputDisabled}>
                      <Button variant="ghost" size="icon" type="button" disabled={isChatInputDisabled}><Wand2 className="h-5 w-5"/></Button>
                    </AIPromptPopover>
                    <Button variant="ghost" size="icon" type="button" disabled={isChatInputDisabled}><Paperclip className="h-5 w-5"/></Button>
                    <Button variant="default" size="icon" className="mr-2" type="submit" disabled={isChatInputDisabled}><Send className="h-5 w-5"/></Button>
                </div>
            </form>
        </div>
    </div>
  )
}
