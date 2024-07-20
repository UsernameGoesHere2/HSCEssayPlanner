import React, { useState, useEffect } from 'react';
import './EnhancedHSCEnglishAdvancedEssayMaster.css';
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
          <div className="card">
            <h2>HSC English Advanced Essay Master</h2>
            <select onChange={(e) => setCurrentModule(modules[parseInt(e.target.value)])}>
              <option value="">Select a module</option>
              {modules.map((module, index) => (
                <option key={index} value={index}>{module.name}</option>
              ))}
            </select>
            <button onClick={startExercise} disabled={!currentModule}>Start Exercise</button>
          </div>
        );
      case 'ideaGeneration':
        return (
          <div className="card">
            <h2>Idea Generation</h2>
            <p><strong>Prompt:</strong> {currentPrompt}</p>
            <p><strong>Key Concepts:</strong> {currentModule.concepts.join(', ')}</p>
            <input 
              type="text"
              placeholder="Enter an idea" 
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  setIdeaList([...ideaList, e.target.value]);
                  e.target.value = '';
                }
              }}
            />
            <ul>
              {ideaList.map((idea, index) => (
                <li key={index}>{idea}</li>
              ))}
            </ul>
            <button onClick={() => setGameState('thesisFormation')}>Next: Thesis Formation</button>
          </div>
        );
      case 'thesisFormation':
        return (
          <div className="card">
            <h2>Thesis Formation</h2>
            <p><strong>Prompt:</strong> {currentPrompt}</p>
            <textarea 
              placeholder="Write your thesis sentence here" 
              value={thesisSentence}
              onChange={(e) => setThesisSentence(e.target.value)}
              rows={3}
            />
            <button onClick={() => setGameState('topicSentences')}>Next: Topic Sentences</button>
          </div>
        );
      case 'topicSentences':
        return (
          <div className="card">
            <h2>Topic Sentences</h2>
            <p><strong>Thesis:</strong> {thesisSentence}</p>
            {topicSentences.map((sentence, index) => (
              <textarea 
                key={index}
                placeholder={`Topic sentence for paragraph ${index + 1}`}
                value={sentence}
                onChange={(e) => {
                  const newTopicSentences = [...topicSentences];
                  newTopicSentences[index] = e.target.value;
                  setTopicSentences(newTopicSentences);
                }}
                rows={2}
              />
            ))}
            <button onClick={startEssay}>Start Full Essay</button>
          </div>
        );
      case 'writing':
        return (
          <div className="card">
            <h2>{currentModule.name}</h2>
            <p><strong>Prompt:</strong> {currentPrompt}</p>
            <p><strong>Thesis:</strong> {thesisSentence}</p>
            <p><strong>Topic Sentences:</strong></p>
            <ol>
              {topicSentences.map((sentence, index) => (
                <li key={index}>{sentence}</li>
              ))}
            </ol>
            <textarea 
              placeholder="Write your essay here" 
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
              rows={15}
            />
            <button onClick={endEssay}>Finish Essay</button>
          </div>
        );
      case 'feedback':
        return (
          <div className="card">
            <h2>Feedback</h2>
            <p>{feedback}</p>
            <button onClick={() => setGameState('start')}>Start New Exercise</button>
          </div>
        );
    }
  };

  return (
    <div className="container">
      {renderGameState()}
      {gameState === 'writing' && (
        <div className="timer">
          <progress value={timeLeft} max={2400} />
          <p>Time left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
        </div>
      )}
    </div>
  );
};

export default EnhancedHSCEnglishAdvancedEssayMaster;