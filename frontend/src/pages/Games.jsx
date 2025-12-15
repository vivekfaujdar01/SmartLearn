import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Gamepad2,
  Brain,
  Sparkles,
  Send,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Zap,
  Target,
  Clock,
  Trophy,
  Shuffle,
  Play,
  ArrowLeft,
  MessageSquare,
  Lightbulb,
  PuzzleIcon,
  Hash,
} from "lucide-react";

// Sample study games data
const studyGames = [
  {
    id: 1,
    title: "Flashcard Master",
    description: "Create and study with interactive flashcards",
    icon: RotateCcw,
    color: "from-blue-500 to-cyan-500",
    players: "1.2K playing",
  },
  {
    id: 2,
    title: "Memory Match",
    description: "Match pairs to test your memory skills",
    icon: Brain,
    color: "from-purple-500 to-pink-500",
    players: "856 playing",
  },
  {
    id: 3,
    title: "Word Scramble",
    description: "Unscramble words to improve vocabulary",
    icon: Shuffle,
    color: "from-orange-500 to-red-500",
    players: "643 playing",
  },
  {
    id: 4,
    title: "Speed Quiz",
    description: "Race against time to answer questions",
    icon: Zap,
    color: "from-green-500 to-emerald-500",
    players: "1.5K playing",
  },
];

// AI Chat Component
function AIQuizChat({ onQuizGenerated }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm your AI Quiz Assistant. Tell me what topic you'd like to create a quiz about, and I'll help you generate questions. For example, try: 'Create a quiz about JavaScript basics' or 'Make 5 questions about World War 2'",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generateQuizFromTopic = (topic) => {
    // Simulated AI-generated quiz based on topic
    const quizTemplates = {
      default: [
        {
          question: `What is a key concept in ${topic}?`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          correct: 0,
        },
        {
          question: `Which statement about ${topic} is true?`,
          options: [
            "It's simple",
            "It's complex",
            "It depends",
            "None of these",
          ],
          correct: 2,
        },
        {
          question: `When studying ${topic}, what's most important?`,
          options: ["Practice", "Theory", "Both", "Neither"],
          correct: 2,
        },
      ],
      javascript: [
        {
          question: "What keyword declares a constant in JavaScript?",
          options: ["var", "let", "const", "static"],
          correct: 2,
        },
        {
          question: "Which method adds an element to the end of an array?",
          options: ["push()", "pop()", "shift()", "unshift()"],
          correct: 0,
        },
        {
          question: "What does 'typeof null' return in JavaScript?",
          options: ["null", "undefined", "object", "boolean"],
          correct: 2,
        },
        {
          question: "Which is NOT a JavaScript data type?",
          options: ["string", "boolean", "float", "symbol"],
          correct: 2,
        },
        {
          question: "What does DOM stand for?",
          options: [
            "Document Object Model",
            "Data Object Model",
            "Document Order Model",
            "Digital Object Model",
          ],
          correct: 0,
        },
      ],
      history: [
        {
          question: "In which year did World War II end?",
          options: ["1943", "1944", "1945", "1946"],
          correct: 2,
        },
        {
          question: "Who was the first President of the United States?",
          options: [
            "John Adams",
            "Thomas Jefferson",
            "George Washington",
            "Benjamin Franklin",
          ],
          correct: 2,
        },
        {
          question: "The French Revolution began in which year?",
          options: ["1776", "1789", "1799", "1804"],
          correct: 1,
        },
      ],
      science: [
        {
          question: "What is the chemical symbol for water?",
          options: ["H2O", "CO2", "NaCl", "O2"],
          correct: 0,
        },
        {
          question: "Which planet is known as the Red Planet?",
          options: ["Venus", "Mars", "Jupiter", "Saturn"],
          correct: 1,
        },
        {
          question: "What is the powerhouse of the cell?",
          options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi body"],
          correct: 2,
        },
      ],
    };

    const lowerTopic = topic.toLowerCase();
    if (lowerTopic.includes("javascript") || lowerTopic.includes("js")) {
      return quizTemplates.javascript;
    } else if (
      lowerTopic.includes("history") ||
      lowerTopic.includes("war") ||
      lowerTopic.includes("president")
    ) {
      return quizTemplates.history;
    } else if (
      lowerTopic.includes("science") ||
      lowerTopic.includes("biology") ||
      lowerTopic.includes("chemistry")
    ) {
      return quizTemplates.science;
    }
    return quizTemplates.default;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const lowerInput = input.toLowerCase();

      if (
        lowerInput.includes("quiz") ||
        lowerInput.includes("question") ||
        lowerInput.includes("create") ||
        lowerInput.includes("make") ||
        lowerInput.includes("generate")
      ) {
        const quiz = generateQuizFromTopic(input);
        const aiResponse = {
          role: "assistant",
          content: `Great! I've created a quiz based on your topic. Here's what I generated:\n\n📝 **${quiz.length} Questions Created**\n\nClick "Start Quiz" below to begin, or ask me to modify the questions!`,
          quiz: quiz,
        };
        setMessages((prev) => [...prev, aiResponse]);
        onQuizGenerated(quiz);
      } else {
        const aiResponse = {
          role: "assistant",
          content: `I can help you create quizzes on any topic! Just tell me what subject you'd like to study. For example:\n\n• "Create a quiz about JavaScript"\n• "Make questions about ancient history"\n• "Generate a science quiz"\n\nWhat would you like to learn today?`,
        };
        setMessages((prev) => [...prev, aiResponse]);
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card h-[500px] flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">AI Quiz Generator</h3>
          <p className="text-xs text-muted-foreground">
            Powered by AI • Always learning
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                msg.role === "user"
                  ? "gradient-primary text-primary-foreground rounded-br-md"
                  : "bg-muted text-foreground rounded-bl-md"
              }`}
            >
              <p className="text-sm whitespace-pre-line">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted p-3 rounded-2xl rounded-bl-md">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <div
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask me to create a quiz..."
            className="flex-1 px-4 py-3 bg-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="px-4 py-3 gradient-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Quiz Player Component
function QuizPlayer({ quiz, onBack }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);

    const isCorrect = index === quiz[currentQuestion].correct;
    if (isCorrect) setScore((prev) => prev + 1);
    setAnswers((prev) => [...prev, { selected: index, correct: isCorrect }]);

    setTimeout(() => {
      if (currentQuestion < quiz.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
  };

  if (showResult) {
    const percentage = Math.round((score / quiz.length) * 100);
    return (
      <div className="bg-card rounded-2xl border border-border shadow-card p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full gradient-primary flex items-center justify-center">
          <Trophy className="w-10 h-10 text-primary-foreground" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Quiz Complete!
        </h3>
        <p className="text-muted-foreground mb-6">
          You scored {score} out of {quiz.length}
        </p>

        <div className="w-full bg-muted rounded-full h-4 mb-6">
          <div
            className="h-4 rounded-full gradient-primary transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <p className="text-3xl font-bold text-primary mb-8">{percentage}%</p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={resetQuiz}
            className="px-6 py-3 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Try Again
          </button>
          <button
            onClick={onBack}
            className="px-6 py-3 gradient-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Games
          </button>
        </div>
      </div>
    );
  }

  const question = quiz[currentQuestion];

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card p-6">
      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-muted-foreground">
          Question {currentQuestion + 1} of {quiz.length}
        </span>
        <span className="text-sm font-medium text-primary">
          Score: {score}/{quiz.length}
        </span>
      </div>

      <div className="w-full bg-muted rounded-full h-2 mb-8">
        <div
          className="h-2 rounded-full gradient-primary transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / quiz.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <h3 className="text-xl font-semibold text-foreground mb-6">
        {question.question}
      </h3>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => {
          let optionClass =
            "w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ";

          if (selectedAnswer === null) {
            optionClass +=
              "border-border bg-background hover:border-primary hover:bg-primary/5 cursor-pointer";
          } else if (index === question.correct) {
            optionClass += "border-green-500 bg-green-500/10 text-green-700";
          } else if (index === selectedAnswer) {
            optionClass += "border-red-500 bg-red-500/10 text-red-700";
          } else {
            optionClass += "border-border bg-background opacity-50";
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={selectedAnswer !== null}
              className={optionClass}
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm font-medium">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1">{option}</span>
                {selectedAnswer !== null && index === question.correct && (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                )}
                {selectedAnswer === index && index !== question.correct && (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Custom Quiz Builder
function QuizBuilder({ onStartQuiz }) {
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correct: 0 },
  ]);

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { question: "", options: ["", "", "", ""], correct: 0 },
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (index, field, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
    );
  };

  const updateOption = (qIndex, oIndex, value) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? { ...q, options: q.options.map((o, j) => (j === oIndex ? value : o)) }
          : q
      )
    );
  };

  const isValid = questions.every(
    (q) => q.question.trim() && q.options.every((o) => o.trim())
  );

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Manual Quiz Builder</h3>
          <p className="text-xs text-muted-foreground">
            Create your own custom quiz
          </p>
        </div>
      </div>

      <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="p-4 bg-muted/50 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Question {qIndex + 1}
              </span>
              {questions.length > 1 && (
                <button
                  onClick={() => removeQuestion(qIndex)}
                  className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <input
              type="text"
              value={q.question}
              onChange={(e) => updateQuestion(qIndex, "question", e.target.value)}
              placeholder="Enter your question..."
              className="w-full px-4 py-3 bg-background border border-input rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />

            <div className="grid grid-cols-2 gap-3">
              {q.options.map((opt, oIndex) => (
                <div key={oIndex} className="relative">
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                    className={`w-full pl-10 pr-4 py-2.5 bg-background border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                      q.correct === oIndex
                        ? "border-green-500 bg-green-500/5"
                        : "border-input"
                    }`}
                  />
                  <button
                    onClick={() => updateQuestion(qIndex, "correct", oIndex)}
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 ${
                      q.correct === oIndex
                        ? "bg-green-500 border-green-500"
                        : "border-muted-foreground"
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={addQuestion}
          className="flex-1 py-3 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Question
        </button>
        <button
          onClick={() => onStartQuiz(questions)}
          disabled={!isValid}
          className="flex-1 py-3 gradient-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5" />
          Start Quiz
        </button>
      </div>
    </div>
  );
}

// Main Games Page
export default function Games() {
  const [activeTab, setActiveTab] = useState("ai");
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [isPlayingQuiz, setIsPlayingQuiz] = useState(false);

  const handleQuizGenerated = (quiz) => {
    setGeneratedQuiz(quiz);
  };

  const handleStartQuiz = (quiz) => {
    setGeneratedQuiz(quiz);
    setIsPlayingQuiz(true);
  };

  const handleBackToGames = () => {
    setIsPlayingQuiz(false);
    setGeneratedQuiz(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold text-foreground">
                LearnHub
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link
                to="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <Link
                to="/articles"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Articles
              </Link>
              <Link to="/games" className="text-primary font-medium">
                Games
              </Link>
            </nav>

            <Link
              to="/signup"
              className="px-5 py-2.5 gradient-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 gradient-hero overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-primary-foreground rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent rounded-full blur-3xl animate-pulse-slow" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/20 text-primary-foreground text-sm font-medium mb-6">
            <Gamepad2 className="w-4 h-4" />
            Interactive Learning Games
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-primary-foreground mb-4">
            Learn Through <span className="text-accent">Play</span>
          </h1>

          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Create custom quizzes with AI, challenge yourself with memory games,
            and make studying fun and engaging.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isPlayingQuiz && generatedQuiz ? (
          <div className="max-w-2xl mx-auto">
            <button
              onClick={handleBackToGames}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Games
            </button>
            <QuizPlayer quiz={generatedQuiz} onBack={handleBackToGames} />
          </div>
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-3 mb-8">
              <button
                onClick={() => setActiveTab("ai")}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  activeTab === "ai"
                    ? "gradient-primary text-primary-foreground shadow-lg"
                    : "bg-card border border-border text-foreground hover:border-primary"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                AI Quiz Creator
              </button>
              <button
                onClick={() => setActiveTab("builder")}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  activeTab === "builder"
                    ? "gradient-primary text-primary-foreground shadow-lg"
                    : "bg-card border border-border text-foreground hover:border-primary"
                }`}
              >
                <Lightbulb className="w-4 h-4" />
                Custom Builder
              </button>
              <button
                onClick={() => setActiveTab("games")}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  activeTab === "games"
                    ? "gradient-primary text-primary-foreground shadow-lg"
                    : "bg-card border border-border text-foreground hover:border-primary"
                }`}
              >
                <Gamepad2 className="w-4 h-4" />
                Study Games
              </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Panel */}
              <div className="lg:col-span-2">
                {activeTab === "ai" && (
                  <div className="space-y-6">
                    <AIQuizChat onQuizGenerated={handleQuizGenerated} />
                    {generatedQuiz && (
                      <button
                        onClick={() => setIsPlayingQuiz(true)}
                        className="w-full py-4 gradient-primary text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg"
                      >
                        <Play className="w-5 h-5" />
                        Start Quiz ({generatedQuiz.length} Questions)
                      </button>
                    )}
                  </div>
                )}

                {activeTab === "builder" && (
                  <QuizBuilder onStartQuiz={handleStartQuiz} />
                )}

                {activeTab === "games" && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {studyGames.map((game) => (
                      <div
                        key={game.id}
                        className="bg-card rounded-2xl border border-border shadow-card p-6 hover:shadow-card-hover transition-all duration-300 cursor-pointer group"
                      >
                        <div
                          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                        >
                          <game.icon className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {game.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {game.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {game.players}
                          </span>
                          <button className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors">
                            Play Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="bg-card rounded-2xl border border-border shadow-card p-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Your Progress
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Quizzes Completed
                      </span>
                      <span className="font-bold text-foreground">24</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Average Score
                      </span>
                      <span className="font-bold text-primary">85%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Current Streak
                      </span>
                      <span className="font-bold text-accent">🔥 7 days</span>
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-card rounded-2xl border border-border shadow-card p-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    AI Tips
                  </h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Try "Create a quiz about Python basics"
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Ask for "5 hard questions about calculus"
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Request "A history quiz about ancient Rome"
                    </li>
                  </ul>
                </div>

                {/* Leaderboard Preview */}
                <div className="bg-card rounded-2xl border border-border shadow-card p-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-accent" />
                    Top Players
                  </h3>
                  <div className="space-y-3">
                    {[
                      { name: "Alex M.", score: "2,450", rank: 1 },
                      { name: "Sarah K.", score: "2,280", rank: 2 },
                      { name: "James L.", score: "2,150", rank: 3 },
                    ].map((player) => (
                      <div
                        key={player.rank}
                        className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                      >
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            player.rank === 1
                              ? "bg-yellow-500 text-white"
                              : player.rank === 2
                                ? "bg-gray-400 text-white"
                                : "bg-amber-700 text-white"
                          }`}
                        >
                          {player.rank}
                        </span>
                        <span className="flex-1 text-sm text-foreground">
                          {player.name}
                        </span>
                        <span className="text-sm font-medium text-primary">
                          {player.score}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
