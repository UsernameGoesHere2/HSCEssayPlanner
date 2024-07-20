import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const modules = [
  {
    name: "Common Module: Texts and Human Experiences",
    text: "The Crucible",
    prompts: [
      "Explore how Miller's 'The Crucible' represents the impact of fear on human behavior.",
      "Discuss the role of power and its abuse in 'The Crucible'.",
      "Analyze how Miller uses the Salem witch trials to comment on contemporary issues."
    ],
    concepts: ["Fear", "Power", "Hysteria", "Reputation", "Integrity"]
  },
  {
    name: "Module A: Textual Conversations",
    text: "The Tempest vs Hag-Seed",
    prompts: [
      "Compare and contrast the representation of power in 'The Tempest' and 'Hag-Seed'.",
      "Discuss how Atwood's 'Hag-Seed' reimagines the themes of revenge and forgiveness from 'The Tempest'.",
      "Analyze the role of magic and illusion in both 'The Tempest' and 'Hag-Seed'."
    ],
    concepts: ["Power", "Revenge", "Forgiveness", "Magic", "Adaptation"]
  },
  {
    name: "Module B: Critical Study of Literature",
    text: "T.S. Eliot's Poetry",
    prompts: [
      "Explore Eliot's use of imagery in 'The Love Song of J. Alfred Prufrock' and its contribution to the poem's themes.",
      "Analyze the concept of spiritual quest in Eliot's 'The Waste Land'.",
      "Discuss how Eliot's poetry reflects the modernist movement in literature."
    ],
    concepts: ["Modernism", "Alienation", "Spiritual Quest", "Imagery", "Fragmentation"]
  }
];

const EnhancedHSCEnglishAdvancedEssayMaster = () => {
  const [currentModule, setCurrentModule] = useState(null);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [essay, setEssay] = useState('');
  const [timeLeft, setTimeLeft] = useState(2400); // 40 minutes
  const [gameState, setGameState] = useState('start');
  const [feedback, setFeedback] = useState('');
  const [ideaList, setIdeaList] = useState([]);
  const [thesisSentence, setThesisSentence] = useState('');
  const [topicSentences, setTopicSentences] = useState(['', '', '']);

  useEffect(() => {
    if (gameState === 'writing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'writing') {
      endEssay();
    }
  }, [timeLeft, gameState]);

  const startExercise = () => {
    if (!currentModule) return;
    setCurrentPrompt(currentModule.prompts[Math.floor(Math.random() * currentModule.prompts.length)]);
    setGameState('ideaGeneration');
    setIdeaList([]);
    setThesisSentence('');
    setTopicSentences(['', '', '']);
    setEssay('');
    setFeedback('');
  };

  const startEssay = () => {
    setGameState('writing');
    setTimeLeft(2400);
  };

  const endEssay = () => {
    setGameState('feedback');
    provideFeedback();
  };

  const provideFeedback = () => {
    const wordCount = essay.split(' ').length;
    let feedbackText = `Word count: ${wordCount}. `;
    
    if (wordCount < 800) {
      feedbackText += "Your essay is shorter than the recommended length. Try to develop your ideas further. ";
    } else if (wordCount > 1000) {
      feedbackText += "Your essay is longer than the recommended length. Focus on being more concise. ";
    } else {
      feedbackText += "Your essay length is appropriate. ";
    }

    if (essay.includes("However") || essay.includes("On the other hand")) {
      feedbackText += "Good job on including counter-arguments. ";
    } else {
      feedbackText += "Consider including counter-arguments to strengthen your essay. ";
    }

    if (essay.includes(currentModule.text)) {
      feedbackText += "You've mentioned the core text, which is great. ";
    } else {
      feedbackText += "Make sure to explicitly discuss the core text. ";
    }

    setFeedback(feedbackText);
  };

  const renderGameState = () => {
    switch (gameState) {
      case 'start':
        return (
          <Card>
            <CardHeader>
              <CardTitle>HSC English Advanced Essay Master</CardTitle>
            </CardHeader>
            <CardContent>
              <Select onValueChange={(value) => setCurrentModule(modules[parseInt(value)])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a module" />
                </SelectTrigger>
                <SelectContent>
                  {modules.map((module, index) => (
                    <SelectItem key={index} value={index.toString()}>{module.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={startExercise} className="mt-4" disabled={!currentModule}>Start Exercise</Button>
            </CardContent>
          </Card>
        );
      case 'ideaGeneration':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Idea Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Prompt:</strong> {currentPrompt}</p>
              <p><strong>Key Concepts:</strong> {currentModule.concepts.join(', ')}</p>
              <Input 
                placeholder="Enter an idea" 
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    setIdeaList([...ideaList, e.target.value]);
                    e.target.value = '';
                  }
                }}
              />
              <ul className="mt-2">
                {ideaList.map((idea, index) => (
                  <li key={index}>{idea}</li>
                ))}
              </ul>
              <Button onClick={() => setGameState('thesisFormation')} className="mt-4">Next: Thesis Formation</Button>
            </CardContent>
          </Card>
        );
      case 'thesisFormation':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Thesis Formation</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Prompt:</strong> {currentPrompt}</p>
              <Textarea 
                placeholder="Write your thesis sentence here" 
                value={thesisSentence}
                onChange={(e) => setThesisSentence(e.target.value)}
                rows={3}
              />
              <Button onClick={() => setGameState('topicSentences')} className="mt-4">Next: Topic Sentences</Button>
            </CardContent>
          </Card>
        );
      case 'topicSentences':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Topic Sentences</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Thesis:</strong> {thesisSentence}</p>
              {topicSentences.map((sentence, index) => (
                <Textarea 
                  key={index}
                  placeholder={`Topic sentence for paragraph ${index + 1}`}
                  value={sentence}
                  onChange={(e) => {
                    const newTopicSentences = [...topicSentences];
                    newTopicSentences[index] = e.target.value;
                    setTopicSentences(newTopicSentences);
                  }}
                  className="mt-2"
                  rows={2}
                />
              ))}
              <Button onClick={startEssay} className="mt-4">Start Full Essay</Button>
            </CardContent>
          </Card>
        );
      case 'writing':
        return (
          <Card>
            <CardHeader>
              <CardTitle>{currentModule.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Prompt:</strong> {currentPrompt}</p>
              <p><strong>Thesis:</strong> {thesisSentence}</p>
              <p><strong>Topic Sentences:</strong></p>
              <ol>
                {topicSentences.map((sentence, index) => (
                  <li key={index}>{sentence}</li>
                ))}
              </ol>
              <Textarea 
                placeholder="Write your essay here" 
                value={essay}
                onChange={(e) => setEssay(e.target.value)}
                rows={15}
                className="mt-4"
              />
              <Button onClick={endEssay} className="mt-4">Finish Essay</Button>
            </CardContent>
          </Card>
        );
      case 'feedback':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{feedback}</p>
              <Button onClick={() => setGameState('start')} className="mt-4">Start New Exercise</Button>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="container mx-auto p-4">
      {renderGameState()}
      {gameState === 'writing' && (
        <div className="mt-4">
          <Progress value={(timeLeft / 2400) * 100} />
          <p>Time left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
        </div>
      )}
    </div>
  );
};

export default EnhancedHSCEnglishAdvancedEssayMaster;