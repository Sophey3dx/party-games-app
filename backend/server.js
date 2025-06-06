// Updated server.js with Multiplayer Support
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const { Sequelize, DataTypes, Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Socket.IO setup with CORS
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Database connection
const sequelize = new Sequelize(
  process.env.DB_NAME || 'partygames',
  process.env.DB_USER || 'gameuser', 
  process.env.DB_PASS || 'superSecurePassword123!',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// MODELS DEFINITION (same as before)
const Category = sequelize.define('Category', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  nameDE: { type: DataTypes.STRING, allowNull: false },
  nameEN: { type: DataTypes.STRING, allowNull: false },
  nameES: { type: DataTypes.STRING, allowNull: true },
  nameFR: { type: DataTypes.STRING, allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  icon: { type: DataTypes.STRING, allowNull: true, defaultValue: '🧠' },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  difficulty: { type: DataTypes.STRING, defaultValue: 'medium', validate: { isIn: [['easy', 'medium', 'hard']] } }
}, { tableName: 'categories', timestamps: true });

const Question = sequelize.define('Question', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  questionDE: { type: DataTypes.TEXT, allowNull: false },
  questionEN: { type: DataTypes.TEXT, allowNull: false },
  questionES: { type: DataTypes.TEXT, allowNull: true },
  questionFR: { type: DataTypes.TEXT, allowNull: true },
  optionsDE: { type: DataTypes.JSON, allowNull: false },
  optionsEN: { type: DataTypes.JSON, allowNull: false },
  optionsES: { type: DataTypes.JSON, allowNull: true },
  optionsFR: { type: DataTypes.JSON, allowNull: true },
  correctAnswer: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 0, max: 3 } },
  difficulty: { type: DataTypes.STRING, defaultValue: 'medium', validate: { isIn: [['easy', 'medium', 'hard']] } },
  categoryId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Category, key: 'id' } },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  timesPlayed: { type: DataTypes.INTEGER, defaultValue: 0 },
  timesCorrect: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { tableName: 'questions', timestamps: true });

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { len: [3, 30], isAlphanumeric: true } },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  password: { type: DataTypes.STRING, allowNull: false, validate: { len: [6, 100] } },
  avatar: { type: DataTypes.STRING, allowNull: true, defaultValue: '🎮' },
  preferredLanguage: { type: DataTypes.STRING, defaultValue: 'en', validate: { isIn: [['de', 'en', 'es', 'fr']] } },
  totalScore: { type: DataTypes.INTEGER, defaultValue: 0 },
  gamesPlayed: { type: DataTypes.INTEGER, defaultValue: 0 },
  correctAnswers: { type: DataTypes.INTEGER, defaultValue: 0 },
  totalQuestions: { type: DataTypes.INTEGER, defaultValue: 0 },
  bestStreak: { type: DataTypes.INTEGER, defaultValue: 0 },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  lastLogin: { type: DataTypes.DATE, allowNull: true }
}, {
  tableName: 'users',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => { if (user.password) { user.password = await bcrypt.hash(user.password, 12); } },
    beforeUpdate: async (user) => { if (user.changed('password')) { user.password = await bcrypt.hash(user.password, 12); } }
  }
});

const QuizSession = sequelize.define('QuizSession', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: true, references: { model: User, key: 'id' } },
  sessionType: { type: DataTypes.STRING, defaultValue: 'singleplayer', validate: { isIn: [['singleplayer', 'multiplayer']] } },
  categoryId: { type: DataTypes.INTEGER, allowNull: true, references: { model: Category, key: 'id' } },
  difficulty: { type: DataTypes.STRING, defaultValue: 'mixed', validate: { isIn: [['easy', 'medium', 'hard', 'mixed']] } },
  totalQuestions: { type: DataTypes.INTEGER, allowNull: false },
  correctAnswers: { type: DataTypes.INTEGER, defaultValue: 0 },
  score: { type: DataTypes.INTEGER, defaultValue: 0 },
  timeSpent: { type: DataTypes.INTEGER, comment: 'Time in seconds' },
  completedAt: { type: DataTypes.DATE, allowNull: true },
  language: { type: DataTypes.STRING, defaultValue: 'en', validate: { isIn: [['de', 'en', 'es', 'fr']] } },
  roomId: { type: DataTypes.STRING, allowNull: true, comment: 'Multiplayer room ID' }
}, { tableName: 'quiz_sessions', timestamps: true });

const CategoryStats = sequelize.define('CategoryStats', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  categoryId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Category, key: 'id' } },
  questionsPlayed: { type: DataTypes.INTEGER, defaultValue: 0 },
  correctAnswers: { type: DataTypes.INTEGER, defaultValue: 0 },
  totalScore: { type: DataTypes.INTEGER, defaultValue: 0 },
  averageTime: { type: DataTypes.FLOAT, defaultValue: 0, comment: 'Average time per question in seconds' },
  bestStreak: { type: DataTypes.INTEGER, defaultValue: 0 },
  lastPlayed: { type: DataTypes.DATE, allowNull: true }
}, {
  tableName: 'category_stats',
  timestamps: true,
  indexes: [{ unique: true, fields: ['userId', 'categoryId'] }]
});

// MULTIPLAYER GAME ROOM MODEL
const GameRoom = sequelize.define('GameRoom', {
  id: { type: DataTypes.STRING, primaryKey: true }, // Room code like "ABCD"
  hostId: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  name: { type: DataTypes.STRING, allowNull: false },
  maxPlayers: { type: DataTypes.INTEGER, defaultValue: 8 },
  currentPlayers: { type: DataTypes.INTEGER, defaultValue: 1 },
  status: { type: DataTypes.STRING, defaultValue: 'waiting', validate: { isIn: [['waiting', 'playing', 'finished']] } },
  categoryId: { type: DataTypes.INTEGER, allowNull: true, references: { model: Category, key: 'id' } },
  difficulty: { type: DataTypes.STRING, defaultValue: 'mixed', validate: { isIn: [['easy', 'medium', 'hard', 'mixed']] } },
  questionsPerRound: { type: DataTypes.INTEGER, defaultValue: 10 },
  timePerQuestion: { type: DataTypes.INTEGER, defaultValue: 30 },
  language: { type: DataTypes.STRING, defaultValue: 'en', validate: { isIn: [['de', 'en', 'es', 'fr']] } },
  currentQuestionIndex: { type: DataTypes.INTEGER, defaultValue: 0 },
  questions: { type: DataTypes.JSON, defaultValue: [] },
  isPrivate: { type: DataTypes.BOOLEAN, defaultValue: false },
  password: { type: DataTypes.STRING, allowNull: true }
}, { tableName: 'game_rooms', timestamps: true });

// MULTIPLAYER PLAYER MODEL
const RoomPlayer = sequelize.define('RoomPlayer', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  roomId: { type: DataTypes.STRING, allowNull: false, references: { model: GameRoom, key: 'id' } },
  userId: { type: DataTypes.INTEGER, allowNull: true, references: { model: User, key: 'id' } },
  socketId: { type: DataTypes.STRING, allowNull: false },
  username: { type: DataTypes.STRING, allowNull: false },
  avatar: { type: DataTypes.STRING, defaultValue: '🎮' },
  score: { type: DataTypes.INTEGER, defaultValue: 0 },
  correctAnswers: { type: DataTypes.INTEGER, defaultValue: 0 },
  isHost: { type: DataTypes.BOOLEAN, defaultValue: false },
  isReady: { type: DataTypes.BOOLEAN, defaultValue: false },
  currentAnswer: { type: DataTypes.INTEGER, allowNull: true },
  answerTime: { type: DataTypes.INTEGER, allowNull: true },
  joinedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'room_players', timestamps: true });

// ASSOCIATIONS
Category.hasMany(Question, { foreignKey: 'categoryId', as: 'questions' });
Question.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
User.hasMany(QuizSession, { foreignKey: 'userId', as: 'quizSessions' });
QuizSession.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(CategoryStats, { foreignKey: 'userId', as: 'categoryStats' });
CategoryStats.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Category.hasMany(CategoryStats, { foreignKey: 'categoryId', as: 'userStats' });
CategoryStats.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(QuizSession, { foreignKey: 'categoryId', as: 'sessions' });
QuizSession.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// MULTIPLAYER ASSOCIATIONS
User.hasMany(GameRoom, { foreignKey: 'hostId', as: 'hostedRooms' });
GameRoom.belongsTo(User, { foreignKey: 'hostId', as: 'host' });
Category.hasMany(GameRoom, { foreignKey: 'categoryId', as: 'gameRooms' });
GameRoom.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
GameRoom.hasMany(RoomPlayer, { foreignKey: 'roomId', as: 'players' });
RoomPlayer.belongsTo(GameRoom, { foreignKey: 'roomId', as: 'room' });
User.hasMany(RoomPlayer, { foreignKey: 'userId', as: 'roomParticipations' });
RoomPlayer.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// USER METHODS
User.prototype.validatePassword = async function(password) { return bcrypt.compare(password, this.password); };
User.prototype.generateToken = function() {
  return jwt.sign({ id: this.id, username: this.username, email: this.email }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });
};
User.prototype.toJSON = function() { const values = Object.assign({}, this.get()); delete values.password; return values; };

// MIDDLEWARE
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json());

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });
  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err, user) => {
      if (!err) req.user = user;
    });
  }
  next();
};

// BASIC ROUTES (same as before)
app.get('/api/health', (req, res) => res.json({ message: 'Party Games API is running! 🎮' }));

// AUTH ROUTES (same as before - register, login, me)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, preferredLanguage = 'en' } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: 'Username, email, and password are required' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
    
    const existingUser = await User.findOne({ where: { [Op.or]: [{ email }, { username }] } });
    if (existingUser) return res.status(400).json({ error: existingUser.email === email ? 'Email already registered' : 'Username already taken' });
    
    const user = await User.create({ username: username.toLowerCase(), email: email.toLowerCase(), password, preferredLanguage });
    const token = user.generateToken();
    res.status(201).json({ user: user.toJSON(), token, message: 'Registration successful! 🎉' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { login, password } = req.body;
    if (!login || !password) return res.status(400).json({ error: 'Email/username and password are required' });
    
    const user = await User.findOne({ where: { [Op.or]: [{ email: login.toLowerCase() }, { username: login.toLowerCase() }] } });
    if (!user || !(await user.validatePassword(password))) return res.status(401).json({ error: 'Invalid credentials' });
    
    await user.update({ lastLogin: new Date() });
    const token = user.generateToken();
    res.json({ user: user.toJSON(), token, message: 'Login successful! 🎮' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { include: [{ model: CategoryStats, as: 'categoryStats', include: [{ model: Category, as: 'category' }] }] });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// QUIZ ROUTES (same as before)
app.get('/api/quiz/categories', async (req, res) => {
  try {
    const { lang = 'en' } = req.query;
    const categories = await Category.findAll({ where: { isActive: true }, attributes: ['id', 'name', `name${lang.toUpperCase()}`, 'icon', 'difficulty'], order: ['name'] });
    const formattedCategories = categories.map(c => ({ id: c.id, name: c.name, displayName: c[`name${lang.toUpperCase()}`] || c.nameEN, icon: c.icon, difficulty: c.difficulty }));
    res.json(formattedCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.get('/api/quiz/questions', async (req, res) => {
  try {
    const { lang = 'en', category, difficulty, limit = 10 } = req.query;
    const whereConditions = { isActive: true };
    if (category && category !== 'all' && category !== 'undefined') whereConditions.categoryId = category;
    if (difficulty && difficulty !== 'mixed' && difficulty !== 'undefined') whereConditions.difficulty = difficulty;
    
    const questions = await Question.findAll({
      where: whereConditions,
      include: [{ model: Category, as: 'category', attributes: ['id', 'name', `name${lang.toUpperCase()}`] }],
      order: sequelize.random(),
      limit: parseInt(limit)
    });
    
    if (questions.length === 0) {
      const fallbackQuestions = [
        { id: 1, question: "Was ist die Hauptstadt von Deutschland?", options: ["Berlin", "München", "Hamburg", "Köln"], correct: 0, category: "Geografie", difficulty: "easy" },
        { id: 2, question: "Welcher Planet ist der Sonne am nächsten?", options: ["Venus", "Mars", "Merkur", "Erde"], correct: 2, category: "Wissenschaft", difficulty: "medium" }
      ];
      return res.json(fallbackQuestions);
    }
    
    const formattedQuestions = questions.map(q => {
      const languageCode = lang.toUpperCase();
      return {
        id: q.id,
        question: q[`question${languageCode}`] || q.questionEN || q.questionDE,
        options: q[`options${languageCode}`] || q.optionsEN || q.optionsDE,
        correct: q.correctAnswer,
        category: q.category ? (q.category[`name${languageCode}`] || q.category.nameEN || q.category.nameDE) : 'General',
        difficulty: q.difficulty
      };
    });
    
    await Question.increment('timesPlayed', { where: { id: questions.map(q => q.id) } });
    res.json(formattedQuestions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.json([{ id: 1, question: "Fallback Question", options: ["A", "B", "C", "D"], correct: 0, category: "General", difficulty: "easy" }]);
  }
});

// MULTIPLAYER ROUTES

// Create game room
app.post('/api/multiplayer/rooms', authenticateToken, async (req, res) => {
  try {
    const { name, maxPlayers = 8, categoryId, difficulty = 'mixed', questionsPerRound = 10, timePerQuestion = 30, language = 'en', isPrivate = false, password } = req.body;
    
    // Generate unique room code
    const generateRoomCode = () => Math.random().toString(36).substring(2, 6).toUpperCase();
    let roomId = generateRoomCode();
    while (await GameRoom.findByPk(roomId)) roomId = generateRoomCode();
    
    const room = await GameRoom.create({
      id: roomId,
      hostId: req.user.id,
      name,
      maxPlayers,
      categoryId,
      difficulty,
      questionsPerRound,
      timePerQuestion,
      language,
      isPrivate,
      password: password ? await bcrypt.hash(password, 12) : null
    });
    
    res.status(201).json({ room, roomCode: roomId, message: 'Room created successfully! 🎮' });
  } catch (error) {
    console.error('Room creation error:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
});

// Get public rooms
app.get('/api/multiplayer/rooms', async (req, res) => {
  try {
    const rooms = await GameRoom.findAll({
      where: { isPrivate: false, status: 'waiting' },
      include: [
        { model: User, as: 'host', attributes: ['id', 'username', 'avatar'] },
        { model: Category, as: 'category', attributes: ['id', 'name', 'nameEN', 'icon'] },
        { model: RoomPlayer, as: 'players', attributes: ['username', 'avatar'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: 20
    });
    
    const formattedRooms = rooms.map(room => ({
      id: room.id,
      name: room.name,
      host: room.host,
      category: room.category,
      currentPlayers: room.currentPlayers,
      maxPlayers: room.maxPlayers,
      difficulty: room.difficulty,
      status: room.status,
      players: room.players.map(p => ({ username: p.username, avatar: p.avatar }))
    }));
    
    res.json(formattedRooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// Get room info
app.get('/api/multiplayer/rooms/:roomId', optionalAuth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await GameRoom.findByPk(roomId, {
      include: [
        { model: User, as: 'host', attributes: ['id', 'username', 'avatar'] },
        { model: Category, as: 'category', attributes: ['id', 'name', 'nameEN', 'nameDE', 'icon'] },
        { model: RoomPlayer, as: 'players', include: [{ model: User, as: 'user', attributes: ['id', 'username', 'avatar'] }] }
      ]
    });
    
    if (!room) return res.status(404).json({ error: 'Room not found' });
    
    const formattedRoom = {
      id: room.id,
      name: room.name,
      host: room.host,
      category: room.category,
      currentPlayers: room.currentPlayers,
      maxPlayers: room.maxPlayers,
      difficulty: room.difficulty,
      questionsPerRound: room.questionsPerRound,
      timePerQuestion: room.timePerQuestion,
      language: room.language,
      status: room.status,
      currentQuestionIndex: room.currentQuestionIndex,
      isPrivate: room.isPrivate,
      hasPassword: !!room.password,
      players: room.players.map(p => ({
        id: p.id,
        userId: p.userId,
        username: p.username,
        avatar: p.avatar,
        score: p.score,
        correctAnswers: p.correctAnswers,
        isHost: p.isHost,
        isReady: p.isReady
      }))
    };
    
    res.json(formattedRoom);
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ error: 'Failed to fetch room' });
  }
});

// MULTIPLAYER GAME STATE
const gameRooms = new Map(); // In-memory game state
const playerSockets = new Map(); // socketId -> { roomId, userId, username }

// SOCKET.IO MULTIPLAYER LOGIC
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Join room
  socket.on('join-room', async (data) => {
    try {
      const { roomId, username, avatar = '🎮', password, userId } = data;
      
      // Find room
      const room = await GameRoom.findByPk(roomId);
      if (!room) return socket.emit('join-error', { error: 'Room not found' });
      if (room.status !== 'waiting') return socket.emit('join-error', { error: 'Game already started' });
      if (room.currentPlayers >= room.maxPlayers) return socket.emit('join-error', { error: 'Room is full' });
      
      // Check password if private
      if (room.password && (!password || !(await bcrypt.compare(password, room.password)))) {
        return socket.emit('join-error', { error: 'Invalid password' });
      }
      
      // Check if user already in room
      const existingPlayer = await RoomPlayer.findOne({ where: { roomId, userId } });
      if (existingPlayer) return socket.emit('join-error', { error: 'Already in room' });
      
      // Add player to room
      const player = await RoomPlayer.create({
        roomId,
        userId,
        socketId: socket.id,
        username,
        avatar,
        isHost: room.hostId === userId
      });
      
      // Update room player count
      await room.increment('currentPlayers');
      
      // Join socket room
      socket.join(roomId);
      playerSockets.set(socket.id, { roomId, userId, username });
      
      // Get updated room data
      const updatedRoom = await GameRoom.findByPk(roomId, {
        include: [{ model: RoomPlayer, as: 'players' }]
      });
      
      // Notify all players in room
      io.to(roomId).emit('player-joined', {
        player: { id: player.id, userId, username, avatar, score: 0, isHost: player.isHost, isReady: false },
        room: {
          id: roomId,
          currentPlayers: updatedRoom.currentPlayers,
          players: updatedRoom.players.map(p => ({
            id: p.id,
            userId: p.userId,
            username: p.username,
            avatar: p.avatar,
            score: p.score,
            isHost: p.isHost,
            isReady: p.isReady
          }))
        }
      });
      
      socket.emit('join-success', { roomId, playerId: player.id });
      
    } catch (error) {
      console.error('Join room error:', error);
      socket.emit('join-error', { error: 'Failed to join room' });
    }
  });
  
  // Player ready
  socket.on('player-ready', async (data) => {
    try {
      const playerInfo = playerSockets.get(socket.id);
      if (!playerInfo) return;
      
      const { roomId } = playerInfo;
      await RoomPlayer.update({ isReady: true }, { where: { socketId: socket.id } });
      
      // Check if all players are ready
      const room = await GameRoom.findByPk(roomId, { include: [{ model: RoomPlayer, as: 'players' }] });
      const allReady = room.players.every(p => p.isReady);
      
      io.to(roomId).emit('player-ready-update', {
        playerId: playerInfo.userId,
        allReady,
        readyCount: room.players.filter(p => p.isReady).length,
        totalPlayers: room.players.length
      });
      
      if (allReady && room.players.length >= 2) {
        // Start game
        await startMultiplayerGame(roomId);
      }
    } catch (error) {
      console.error('Player ready error:', error);
    }
  });
  
  // Submit answer
  socket.on('submit-answer', async (data) => {
    try {
      const { roomId, questionIndex, answerIndex, timeLeft } = data;
      const playerInfo = playerSockets.get(socket.id);
      if (!playerInfo) return;
      
      // Update player answer
      await RoomPlayer.update(
        { currentAnswer: answerIndex, answerTime: 30 - timeLeft },
        { where: { socketId: socket.id } }
      );
      
      // Check if all players have answered
      const room = await GameRoom.findByPk(roomId, { include: [{ model: RoomPlayer, as: 'players' }] });
      const playersAnswered = room.players.filter(p => p.currentAnswer !== null).length;
      
      io.to(roomId).emit('answer-submitted', {
        playerId: playerInfo.userId,
        playersAnswered,
        totalPlayers: room.players.length
      });
      
      // If all answered or time up, show results
      if (playersAnswered === room.players.length) {
        await showQuestionResults(roomId, questionIndex);
      }
    } catch (error) {
      console.error('Submit answer error:', error);
    }
  });

// Chat message (continued from previous part)
socket.on('chat-message', (data) => {
  const playerInfo = playerSockets.get(socket.id);
  if (!playerInfo) return;
  
  const { message } = data;
  io.to(playerInfo.roomId).emit('chat-message', {
    username: playerInfo.username,
    message,
    timestamp: new Date().toISOString()
  });
});
  
  // Leave room
  socket.on('leave-room', async () => {
    await handlePlayerLeave(socket.id);
  });
  
  // Disconnect
  socket.on('disconnect', async () => {
    console.log('User disconnected:', socket.id);
    await handlePlayerLeave(socket.id);
  });
});

// MULTIPLAYER GAME FUNCTIONS

async function startMultiplayerGame(roomId) {
  try {
    const room = await GameRoom.findByPk(roomId, {
      include: [{ model: Category, as: 'category' }]
    });
    
    if (!room) return;
    
    // Get questions for the game
    const whereConditions = { isActive: true };
    if (room.categoryId) whereConditions.categoryId = room.categoryId;
    if (room.difficulty !== 'mixed') whereConditions.difficulty = room.difficulty;
    
    const questions = await Question.findAll({
      where: whereConditions,
      include: [{ model: Category, as: 'category' }],
      order: sequelize.random(),
      limit: room.questionsPerRound
    });
    
    if (questions.length === 0) return;
    
    // Format questions for multiplayer
    const formattedQuestions = questions.map(q => {
      const languageCode = room.language.toUpperCase();
      return {
        id: q.id,
        question: q[`question${languageCode}`] || q.questionEN || q.questionDE,
        options: q[`options${languageCode}`] || q.optionsEN || q.optionsDE,
        correct: q.correctAnswer,
        category: q.category ? (q.category[`name${languageCode}`] || q.category.nameEN) : 'General',
        difficulty: q.difficulty
      };
    });
    
    // Update room status and questions
    await room.update({
      status: 'playing',
      questions: formattedQuestions,
      currentQuestionIndex: 0
    });
    
    // Reset all players
    await RoomPlayer.update(
      { currentAnswer: null, answerTime: null },
      { where: { roomId } }
    );
    
    // Start first question
    io.to(roomId).emit('game-started', {
      totalQuestions: formattedQuestions.length,
      timePerQuestion: room.timePerQuestion
    });
    
    await showNextQuestion(roomId);
    
  } catch (error) {
    console.error('Start multiplayer game error:', error);
  }
}

async function showNextQuestion(roomId) {
  try {
    const room = await GameRoom.findByPk(roomId);
    if (!room || room.status !== 'playing') return;
    
    const currentQuestion = room.questions[room.currentQuestionIndex];
    if (!currentQuestion) {
      // Game finished
      await endMultiplayerGame(roomId);
      return;
    }
    
    // Reset player answers for this question
    await RoomPlayer.update(
      { currentAnswer: null, answerTime: null },
      { where: { roomId } }
    );
    
    // Send question to all players
    io.to(roomId).emit('new-question', {
      questionIndex: room.currentQuestionIndex,
      question: {
        question: currentQuestion.question,
        options: currentQuestion.options,
        category: currentQuestion.category,
        difficulty: currentQuestion.difficulty
      },
      timeLimit: room.timePerQuestion,
      questionNumber: room.currentQuestionIndex + 1,
      totalQuestions: room.questions.length
    });
    
    // Auto-advance after time limit
    setTimeout(() => {
      showQuestionResults(roomId, room.currentQuestionIndex);
    }, room.timePerQuestion * 1000 + 2000); // Extra 2 seconds for network delay
    
  } catch (error) {
    console.error('Show next question error:', error);
  }
}

async function showQuestionResults(roomId, questionIndex) {
  try {
    const room = await GameRoom.findByPk(roomId, {
      include: [{ model: RoomPlayer, as: 'players' }]
    });
    
    if (!room || room.currentQuestionIndex !== questionIndex) return;
    
    const currentQuestion = room.questions[questionIndex];
    const correctAnswer = currentQuestion.correct;
    
    // Calculate scores and update players
    const playerResults = [];
    for (const player of room.players) {
      const isCorrect = player.currentAnswer === correctAnswer;
      let points = 0;
      
      if (isCorrect) {
        points = 100 + Math.max(0, (room.timePerQuestion - (player.answerTime || room.timePerQuestion)) * 2);
      }
      
      await player.update({
        score: player.score + points,
        correctAnswers: player.correctAnswers + (isCorrect ? 1 : 0)
      });
      
      playerResults.push({
        playerId: player.userId,
        username: player.username,
        avatar: player.avatar,
        answer: player.currentAnswer,
        isCorrect,
        points,
        totalScore: player.score + points,
        answerTime: player.answerTime
      });
    }
    
    // Send results to all players
    io.to(roomId).emit('question-results', {
      questionIndex,
      correctAnswer,
      question: currentQuestion,
      playerResults,
      leaderboard: playerResults.sort((a, b) => b.totalScore - a.totalScore)
    });
    
    // Move to next question after 5 seconds
    setTimeout(async () => {
      await room.update({ currentQuestionIndex: room.currentQuestionIndex + 1 });
      await showNextQuestion(roomId);
    }, 5000);
    
  } catch (error) {
    console.error('Show question results error:', error);
  }
}

async function endMultiplayerGame(roomId) {
  try {
    const room = await GameRoom.findByPk(roomId, {
      include: [{ model: RoomPlayer, as: 'players' }]
    });
    
    if (!room) return;
    
    // Update room status
    await room.update({ status: 'finished' });
    
    // Calculate final results
    const finalResults = room.players
      .map(player => ({
        playerId: player.userId,
        username: player.username,
        avatar: player.avatar,
        totalScore: player.score,
        correctAnswers: player.correctAnswers,
        accuracy: Math.round((player.correctAnswers / room.questions.length) * 100),
        rank: 0
      }))
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((player, index) => ({ ...player, rank: index + 1 }));
    
    // Update user stats for registered players
    for (const player of room.players) {
      if (player.userId) {
        const user = await User.findByPk(player.userId);
        if (user) {
          await user.update({
            totalScore: user.totalScore + player.score,
            gamesPlayed: user.gamesPlayed + 1,
            correctAnswers: user.correctAnswers + player.correctAnswers,
            totalQuestions: user.totalQuestions + room.questions.length
          });
          
          // Update category stats if specific category
          if (room.categoryId) {
            const [categoryStats] = await CategoryStats.findOrCreate({
              where: { userId: player.userId, categoryId: room.categoryId },
              defaults: { questionsPlayed: 0, correctAnswers: 0, totalScore: 0, averageTime: 0 }
            });
            
            const newQuestionsPlayed = categoryStats.questionsPlayed + room.questions.length;
            const newCorrectAnswers = categoryStats.correctAnswers + player.correctAnswers;
            const newTotalScore = categoryStats.totalScore + player.score;
            
            await categoryStats.update({
              questionsPlayed: newQuestionsPlayed,
              correctAnswers: newCorrectAnswers,
              totalScore: newTotalScore,
              lastPlayed: new Date()
            });
          }
        }
      }
    }
    
    // Send final results
    io.to(roomId).emit('game-ended', {
      finalResults,
      winner: finalResults[0],
      totalQuestions: room.questions.length,
      roomStats: {
        totalPlayers: room.players.length,
        averageScore: Math.round(finalResults.reduce((sum, p) => sum + p.totalScore, 0) / finalResults.length),
        highestScore: finalResults[0]?.totalScore || 0
      }
    });
    
    // Clean up room after 30 seconds
    setTimeout(async () => {
      await cleanupRoom(roomId);
    }, 30000);
    
  } catch (error) {
    console.error('End multiplayer game error:', error);
  }
}

async function handlePlayerLeave(socketId) {
  try {
    const playerInfo = playerSockets.get(socketId);
    if (!playerInfo) return;
    
    const { roomId, userId, username } = playerInfo;
    
    // Remove player from database
    await RoomPlayer.destroy({ where: { socketId } });
    
    // Update room player count
    const room = await GameRoom.findByPk(roomId);
    if (room) {
      await room.decrement('currentPlayers');
      
      // If room is empty or host left, cleanup room
      if (room.currentPlayers <= 1 || room.hostId === userId) {
        await cleanupRoom(roomId);
      } else {
        // Notify remaining players
        io.to(roomId).emit('player-left', {
          username,
          playerId: userId,
          currentPlayers: room.currentPlayers - 1
        });
      }
    }
    
    // Remove from memory
    playerSockets.delete(socketId);
    
  } catch (error) {
    console.error('Handle player leave error:', error);
  }
}

async function cleanupRoom(roomId) {
  try {
    // Remove all players
    await RoomPlayer.destroy({ where: { roomId } });
    
    // Delete room
    await GameRoom.destroy({ where: { id: roomId } });
    
    // Notify remaining players
    io.to(roomId).emit('room-closed', { message: 'Room has been closed' });
    
    console.log(`Room ${roomId} cleaned up`);
  } catch (error) {
    console.error('Cleanup room error:', error);
  }
}

// USER STATS ROUTES (same as before)
app.get('/api/users/:userId/stats', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { lang = 'en' } = req.query;
    
    if (req.user.id !== parseInt(userId)) return res.status(403).json({ error: 'Access denied' });
    
    const user = await User.findByPk(userId, {
      include: [{ model: CategoryStats, as: 'categoryStats', include: [{ model: Category, as: 'category' }] }]
    });
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const overallAccuracy = user.totalQuestions > 0 ? Math.round((user.correctAnswers / user.totalQuestions) * 100) : 0;
    
    const categoryStats = user.categoryStats.map(stat => {
      const accuracy = stat.questionsPlayed > 0 ? Math.round((stat.correctAnswers / stat.questionsPlayed) * 100) : 0;
      let performance = 'Unplayed';
      if (accuracy >= 90) performance = 'Expert';
      else if (accuracy >= 75) performance = 'Advanced';
      else if (accuracy >= 60) performance = 'Good';
      else if (accuracy > 0) performance = 'Beginner';
      
      return {
        category: {
          id: stat.category.id,
          name: stat.category[`name${lang.toUpperCase()}`] || stat.category.nameEN,
          icon: stat.category.icon
        },
        questionsPlayed: stat.questionsPlayed,
        correctAnswers: stat.correctAnswers,
        accuracy,
        performance,
        averageScore: stat.questionsPlayed > 0 ? Math.round(stat.totalScore / stat.questionsPlayed) : 0,
        averageTime: Math.round(stat.averageTime),
        lastPlayed: stat.lastPlayed
      };
    }).sort((a, b) => b.accuracy - a.accuracy);
    
    const recentSessions = await QuizSession.findAll({
      where: { userId, completedAt: { [Op.not]: null } },
      include: [{ model: Category, as: 'category' }],
      order: [['completedAt', 'DESC']],
      limit: 10
    });
    
    res.json({
      user: { id: user.id, username: user.username, avatar: user.avatar, totalScore: user.totalScore, gamesPlayed: user.gamesPlayed, overallAccuracy },
      categoryStats,
      recentSessions: recentSessions.map(session => ({
        id: session.id,
        category: session.category ? { name: session.category[`name${lang.toUpperCase()}`] || session.category.nameEN, icon: session.category.icon } : { name: 'Mixed', icon: '🎯' },
        score: session.score,
        accuracy: session.totalQuestions > 0 ? Math.round((session.correctAnswers / session.totalQuestions) * 100) : 0,
        completedAt: session.completedAt,
        sessionType: session.sessionType || 'singleplayer'
      }))
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// QUIZ SESSION ROUTES (same as before with roomId support)
app.post('/api/quiz/sessions', optionalAuth, async (req, res) => {
  try {
    const { sessionType = 'singleplayer', categoryId, difficulty = 'mixed', language = 'en', roomId } = req.body;
    
    const session = await QuizSession.create({
      userId: req.user ? req.user.id : null,
      sessionType,
      categoryId,
      difficulty,
      language,
      roomId,
      totalQuestions: 0
    });
    
    res.status(201).json(session);
  } catch (error) {
    console.error('Session creation error:', error);
    res.status(500).json({ error: 'Failed to create quiz session' });
  }
});

app.put('/api/quiz/sessions/:sessionId/complete', optionalAuth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { totalQuestions, correctAnswers, timeSpent } = req.body;
    
    const session = await QuizSession.findByPk(sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    
    const baseScore = correctAnswers * 10;
    const timeBonus = Math.max(0, (30 - (timeSpent / totalQuestions)) * correctAnswers);
    const finalScore = Math.round(baseScore + timeBonus);
    
    await session.update({ totalQuestions, correctAnswers, score: finalScore, timeSpent, completedAt: new Date() });
    
    // Update user stats if authenticated and singleplayer
    if (req.user && req.user.id && session.sessionType === 'singleplayer') {
      const user = await User.findByPk(req.user.id);
      if (user) {
        await user.update({
          totalScore: user.totalScore + finalScore,
          gamesPlayed: user.gamesPlayed + 1,
          correctAnswers: user.correctAnswers + correctAnswers,
          totalQuestions: user.totalQuestions + totalQuestions
        });
        
        if (session.categoryId) {
          const [categoryStats] = await CategoryStats.findOrCreate({
            where: { userId: req.user.id, categoryId: session.categoryId },
            defaults: { questionsPlayed: 0, correctAnswers: 0, totalScore: 0, averageTime: 0 }
          });
          
          const newQuestionsPlayed = categoryStats.questionsPlayed + totalQuestions;
          const newCorrectAnswers = categoryStats.correctAnswers + correctAnswers;
          const newTotalScore = categoryStats.totalScore + finalScore;
          const newAverageTime = ((categoryStats.averageTime * categoryStats.questionsPlayed) + timeSpent) / newQuestionsPlayed;
          
          await categoryStats.update({
            questionsPlayed: newQuestionsPlayed,
            correctAnswers: newCorrectAnswers,
            totalScore: newTotalScore,
            averageTime: newAverageTime,
            lastPlayed: new Date()
          });
        }
      }
    }
    
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    const averageTimePerQuestion = totalQuestions > 0 ? timeSpent / totalQuestions : 0;
    
    res.json({
      session,
      performance: {
        accuracy: Math.round(accuracy),
        averageTimePerQuestion: Math.round(averageTimePerQuestion),
        score: finalScore,
        rank: accuracy >= 90 ? 'Expert' : accuracy >= 75 ? 'Advanced' : accuracy >= 60 ? 'Good' : 'Beginner'
      }
    });
  } catch (error) {
    console.error('Session completion error:', error);
    res.status(500).json({ error: 'Failed to complete session' });
  }
});

// Initialize database (same as before)
async function initializeDatabase() {
  try {
    await sequelize.sync({ force: false });
    console.log('✅ Database tables synchronized');
    
    const categoryCount = await Category.count();
    const questionCount = await Question.count();
    
    if (categoryCount === 0) {
      console.log('🌱 Seeding categories...');
      await Category.bulkCreate([
        { name: 'geography', nameDE: 'Geografie', nameEN: 'Geography', nameES: 'Geografía', nameFR: 'Géographie', icon: '🌍', difficulty: 'medium' },
        { name: 'science', nameDE: 'Wissenschaft', nameEN: 'Science', nameES: 'Ciencia', nameFR: 'Science', icon: '🔬', difficulty: 'hard' },
        { name: 'literature', nameDE: 'Literatur', nameEN: 'Literature', nameES: 'Literatura', nameFR: 'Littérature', icon: '📚', difficulty: 'medium' },
        { name: 'history', nameDE: 'Geschichte', nameEN: 'History', nameES: 'Historia', nameFR: 'Histoire', icon: '🏛️', difficulty: 'medium' },
        { name: 'entertainment', nameDE: 'Entertainment', nameEN: 'Entertainment', nameES: 'Entretenimiento', nameFR: 'Divertissement', icon: '🎬', difficulty: 'easy' }
      ]);
      console.log('✅ Categories seeded');
    }
    
    if (questionCount === 0) {
      console.log('🌱 Seeding questions...');
      await Question.bulkCreate([
        {
          questionDE: 'Was ist die Hauptstadt von Deutschland?',
          questionEN: 'What is the capital of Germany?',
          questionES: '¿Cuál es la capital de Alemania?',
          questionFR: 'Quelle est la capitale de l\'Allemagne?',
          optionsDE: ['Berlin', 'München', 'Hamburg', 'Köln'],
          optionsEN: ['Berlin', 'Munich', 'Hamburg', 'Cologne'],
          optionsES: ['Berlín', 'Múnich', 'Hamburgo', 'Colonia'],
          optionsFR: ['Berlin', 'Munich', 'Hambourg', 'Cologne'],
          correctAnswer: 0,
          difficulty: 'easy',
          categoryId: 1
        }
        // Add more seed questions here...
      ]);
      console.log('✅ Questions seeded');
    }
    
    console.log(`📊 Database ready: ${categoryCount} categories, ${questionCount} questions`);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  }
}

const PORT = process.env.PORT || 3001;

server.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🎮 Party Games Backend with Multiplayer is ready!`);
  
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    await initializeDatabase();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.log('⚠️  Running with fallback data only');
  }
})