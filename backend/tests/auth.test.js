// Set test environment before importing server
process.env.NODE_ENV = 'test';

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Note = require('../models/Note');

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    // Connect to test database
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/notesapp_test';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI);
    }
  });

  afterAll(async () => {
    // Clean up
    await User.deleteMany({});
    await Note.deleteMany({});
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  beforeEach(async () => {
    // Clear users before each test
    await User.deleteMany({});
  });

  describe('POST /auth/signup', () => {
    it('should create a new user with valid data', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should reject signup with invalid email', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send({
          email: 'invalid-email',
          password: 'password123'
        });

      expect(response.status).toBe(400);
    });

    it('should reject signup with short password', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send({
          email: 'test@example.com',
          password: '12345'
        });

      expect(response.status).toBe(400);
    });

    it('should reject duplicate email', async () => {
      await request(app)
        .post('/auth/signup')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      const response = await request(app)
        .post('/auth/signup')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('already exists');
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      await request(app)
        .post('/auth/signup')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });

    it('should reject login with invalid email', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('Invalid credentials');
    });

    it('should reject login with invalid password', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toContain('Invalid credentials');
    });

    it('should track failed login attempts', async () => {
      // Make 3 failed login attempts
      for (let i = 0; i < 3; i++) {
        await request(app)
          .post('/auth/login')
          .send({
            email: 'test@example.com',
            password: 'wrongpassword'
          });
        // Small delay to ensure each request completes
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Wait a bit to ensure all saves are complete
      await new Promise(resolve => setTimeout(resolve, 100));

      const user = await User.findOne({ email: 'test@example.com' });
      expect(user.loginAttempts).toBe(3);
    });

    it('should lock account after 5 failed login attempts', async () => {
      // Make 5 failed login attempts
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/auth/login')
          .send({
            email: 'test@example.com',
            password: 'wrongpassword'
          });
      }

      // Refresh user from database to get updated state
      const user = await User.findOne({ email: 'test@example.com' });
      // Check if locked using the virtual property
      const isLocked = !!(user.lockUntil && user.lockUntil > Date.now());
      expect(isLocked).toBe(true);
      expect(user.lockUntil).toBeDefined();
      expect(user.loginAttempts).toBeGreaterThanOrEqual(5);
    });

    it('should reject login when account is locked', async () => {
      // Lock the account first
      const user = await User.findOne({ email: 'test@example.com' });
      user.loginAttempts = 5;
      user.lockUntil = Date.now() + 30 * 60 * 1000; // 30 minutes from now
      await user.save();

      // Wait a bit to ensure the save is complete
      await new Promise(resolve => setTimeout(resolve, 100));

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(423);
      expect(response.body.message).toContain('locked');
    });

    it('should reset login attempts on successful login', async () => {
      // Make 2 failed attempts first
      await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      // Wait a bit to ensure the save is complete
      await new Promise(resolve => setTimeout(resolve, 100));

      let user = await User.findOne({ email: 'test@example.com' });
      expect(user.loginAttempts).toBeGreaterThan(0);

      // Successful login
      await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      // Wait a bit to ensure the save is complete
      await new Promise(resolve => setTimeout(resolve, 100));

      user = await User.findOne({ email: 'test@example.com' });
      expect(user.loginAttempts).toBe(0);
      expect(user.lockUntil).toBeUndefined();
    });
  });
});

