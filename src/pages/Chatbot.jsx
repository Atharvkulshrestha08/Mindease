import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, User, Sparkles, Heart } from 'lucide-react';
import styles from './Chatbot.module.css';

const botResponses = {
    stressed: [
        "I hear you. Stress can feel overwhelming, but it's temporary. Let's take a moment — try breathing in for 4 counts, holding for 4, and exhaling for 6.",
        "When we're stressed, our body tightens up. Can you notice where you're holding tension right now? Try relaxing that area.",
        "You're doing better than you think. What's one small thing that went well today? Even something tiny counts.",
    ],
    anxious: [
        "Anxiety tends to make us worry about the future. Let's ground ourselves in the present. Name 5 things you can see right now.",
        "Remember: thoughts are not facts. Just because you feel anxious doesn't mean something bad will happen.",
        "Try the 3-3-3 technique: name 3 things you see, 3 sounds you hear, and move 3 parts of your body.",
    ],
    sad: [
        "It's okay to feel sad. Emotions come and go like waves — this one will pass too. Be gentle with yourself.",
        "Sometimes sadness is telling us something important. What do you think it might be trying to say?",
        "You're not alone in this. Would journaling your feelings help? Sometimes writing things down makes them feel lighter.",
    ],
    lonely: [
        "Feeling lonely is more common than you think, especially in today's world. You reached out to me, and that takes courage.",
        "Connection starts small. Is there one person you could send a simple 'thinking of you' message to today?",
        "Remember: being alone and being lonely are different things. It's okay to enjoy your own company too.",
    ],
    happy: [
        "That's wonderful! Let's capture this moment. What specifically made you feel this way?",
        "Happiness is worth savoring. Take a mental snapshot of how you feel right now — you can revisit it whenever you need a boost.",
        "Keep this momentum going! Consider journaling what made today great so you can look back on it later.",
    ],
    // Indian Academic Stress
    academic: [
        "Arre yaar, exam pressure is real and nobody gets that better than us. But listen — your worth isn't a number on a marksheet. 💛",
        "JEE/NEET/boards ka pressure is insane, I get it. But take a 5-minute break right now. Your brain needs oxygen, not more formulas.",
        "Coaching center mein sabko lagta hai 'sirf main peeche hoon' — but bhai/didi, that's not true. Everyone struggles, most just don't show it.",
        "One bad mock test doesn't define your career. Sachin got a duck in many matches too — did he stop playing? Take a breath. You got this. 💪",
        "Backlog ya low CGPA feel scary karta hai, but real life mein skills, attitude, and consistency matter more than a number. Trust the process.",
    ],
    // Social/Family Pressure
    social_pressure: [
        "Arre, 'log kya kahenge' sunke thak gaye ho na? Real baat yeh hai ki log kal kuch aur kehenge. Apne liye jiyo, unke liye nahi. 🧡",
        "'Sharma ji ka beta' toh ek myth hai yaar. Unko bhi anxiety hoti hai, bas unke parents nahi bataate. You're running YOUR race.",
        "Family ka pressure samajh aata hai — they care, but sometimes care comes out as comparison. Take a deep breath. Their worry ≠ your failure.",
        "Rishta, career, weight, marks — sab ek saath pressure daalte hain gharwale. Pick ONE thing you can control today. Just one. That's enough.",
        "Parents ka generation different tha, unke struggles different the. Doesn't make yours less valid. Both are real. 🤝",
    ],
    // Hinglish mood expressions
    hinglish: [
        "Bahut thak gaye ho na? It's okay to pause yaar. Machines ko bhi restart ki zaroorat hoti hai — tum toh insaan ho. 💛",
        "Dimag kharab lag rha hai? Chal, ek kaam kar — phone neeche rakh, window ke paas ja, 10 deep breaths le. Main yahan hoon.",
        "Sab khatam sa feel ho raha hai? I know it feels like that, but yeh feeling hai, reality nahi. Feelings change hote hain. Trust kar. 🌱",
        "Bohot tension hai? Ek technique try kar: jo tension hai usse paper pe likh de, phir us paper ko fold karke door rakh de. Dimag ko signal milta hai 'handled hai.'",
        "'Nahi hoga' — yeh sabse common lie hai jo humara dimag bolta hai. Pehle bhi aisi feeling aayi thi, aur tum yahan ho. Stronger than you think. 🌟",
    ],
    default: [
        "Sab suna maine. Baat karna hi sabse bada step hai — aur tum woh le chuke ho. 💛",
        "Main hoon na. Thoda aur batao kya chal rha hai — no judgments, pakka promise.",
        "That's really insightful yaar. How does recognizing that make you feel?",
        "Remember, there's no wrong way to feel. Koi bhi emotion valid hai. What matters is that you're paying attention. 🌿",
        "Chal, ek experiment karte hain — apne baare mein ek achhi baat bol. Just one. Main sunna chahta/chahti hoon. 😊",
    ],
};

const keywords = {
    stressed: ['stress', 'stressed', 'overwhelm', 'pressure', 'tension', 'burnout', 'exhausted', 'overwork', 'deadline', 'thak', 'thaka', 'load'],
    anxious: ['anxious', 'anxiety', 'worry', 'worried', 'panic', 'nervous', 'scared', 'fear', 'fearful', 'dar', 'darr', 'ghabra'],
    sad: ['sad', 'down', 'depressed', 'unhappy', 'cry', 'crying', 'hopeless', 'empty', 'numb', 'udaas', 'rona', 'dukhi'],
    lonely: ['lonely', 'alone', 'isolated', 'no one', 'nobody', 'disconnected', 'friendless', 'akela', 'akeli'],
    happy: ['happy', 'great', 'amazing', 'wonderful', 'joy', 'joyful', 'excited', 'grateful', 'thankful', 'good', 'khush', 'mast', 'badhiya', 'maza'],
    academic: ['exam', 'marks', 'topper', 'rank', 'jee', 'neet', 'board', 'mock test', 'backlog', 'coaching', 'kota', 'placement', 'cgpa', 'gpa', 'fail', 'result', 'syllabus', 'padhai', 'padhna', 'paper', 'viva', 'semester', 'college', 'entrance'],
    social_pressure: ['log kya', 'sharma ji', 'parents expect', 'rishta', 'marriage pressure', 'comparison', 'gharwale', 'kahenge', 'society', 'relatives', 'uncle', 'aunty', 'beta', 'izzat', 'sharam'],
    hinglish: ['bahut', 'bohot', 'dimag', 'kharab', 'tension', 'kya karu', 'sab khatam', 'nahi hoga', 'bore', 'thak gaya', 'thak gayi', 'samajh nahi', 'dar lagta', 'acha nahi', 'mann nahi'],
};

const detectEmotion = (text) => {
    const lower = text.toLowerCase();
    // Check Indian-specific categories first (more specific)
    for (const category of ['academic', 'social_pressure', 'hinglish']) {
        if (keywords[category].some(keyword => lower.includes(keyword))) {
            return category;
        }
    }
    // Then general emotions
    for (const [emotion, words] of Object.entries(keywords)) {
        if (['academic', 'social_pressure', 'hinglish'].includes(emotion)) continue;
        if (words.some(keyword => lower.includes(keyword))) {
            return emotion;
        }
    }
    return 'default';
};

const getResponse = (text) => {
    const emotion = detectEmotion(text);
    const responses = botResponses[emotion];
    return responses[Math.floor(Math.random() * responses.length)];
};

const Chatbot = () => {
    const [messages, setMessages] = useState([
        {
            id: 0,
            type: 'bot',
            text: "Hey! Main hoon tera MindEase buddy 🤙 Kuch bhi bata — exam stress, ghar ka pressure, ya bas mann halka karna hai. No judgments, ever. Bata kya chal rha hai?",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            text: input.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        const inputText = input.trim();
        setInput('');
        setIsTyping(true);

        // Simulate typing delay
        setTimeout(() => {
            const botReply = {
                id: Date.now() + 1,
                type: 'bot',
                text: getResponse(inputText),
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, botReply]);
            setIsTyping(false);
        }, 1000 + Math.random() * 1500);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const quickPrompts = [
        "Bahut stress ho raha hai 😩",
        "Exam ka tension hai",
        "I feel lonely today",
        "I'm having a good day!",
        "Ghar pe pressure hai",
        "Kya karu samajh nahi aa rha",
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={styles.botAvatar}>
                        <Bot size={24} />
                    </div>
                    <div>
                        <h2 className={styles.title}>MindEase Buddy 🤙</h2>
                        <span className={styles.status}>
                            <span className={styles.statusDot} /> Tera apna companion
                        </span>
                    </div>
                </div>
                <div className={styles.privacyBadge}>
                    <Sparkles size={14} />
                    100% Offline · Zero Data Collected
                </div>
            </div>

            <div className={styles.chatArea}>
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`${styles.message} ${msg.type === 'user' ? styles.userMsg : styles.botMsg}`}
                    >
                        <div className={styles.msgAvatar}>
                            {msg.type === 'bot' ? <Heart size={16} /> : <User size={16} />}
                        </div>
                        <div className={styles.msgContent}>
                            <p>{msg.text}</p>
                            <span className={styles.msgTime}>
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </motion.div>
                ))}

                {isTyping && (
                    <div className={`${styles.message} ${styles.botMsg}`}>
                        <div className={styles.msgAvatar}><Heart size={16} /></div>
                        <div className={styles.typingIndicator}>
                            <span /><span /><span />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {messages.length <= 1 && (
                <div className={styles.quickPrompts}>
                    {quickPrompts.map((prompt) => (
                        <button
                            key={prompt}
                            className={styles.quickBtn}
                            onClick={() => { setInput(prompt); setTimeout(() => { setInput(prompt); handleSend(); }, 50); }}
                        >
                            {prompt}
                        </button>
                    ))}
                </div>
            )}

            <div className={styles.inputArea}>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Bata kya chal rha hai... (Hindi/English, kuch bhi)"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={styles.input}
                />
                <button className={styles.sendBtn} onClick={handleSend} disabled={!input.trim()}>
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
};

export default Chatbot;
