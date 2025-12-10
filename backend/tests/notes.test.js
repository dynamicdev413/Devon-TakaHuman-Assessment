// Set test environment before importing server
process.env.NODE_ENV = 'test';

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Note = require('../models/Note');

describe('Notes Endpoints', () => {
  let authToken;
  let userId;

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
    // Clear data and create a test user
    await User.deleteMany({});
    await Note.deleteMany({});

    const signupResponse = await request(app)
      .post('/auth/signup')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    // Check if signup was successful
    expect(signupResponse.status).toBe(201);
    expect(signupResponse.body).toHaveProperty('token');
    expect(signupResponse.body).toHaveProperty('user');

    authToken = signupResponse.body.token;
    userId = signupResponse.body.user.id;
  });

  describe('POST /notes', () => {
    it('should create a note with valid data', async () => {
      const response = await request(app)
        .post('/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Note',
          content: 'This is a test note content'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('note');
      expect(response.body.note.title).toBe('Test Note');
      expect(response.body.note.content).toBe('This is a test note content');
    });

    it('should reject note creation without authentication', async () => {
      const response = await request(app)
        .post('/notes')
        .send({
          title: 'Test Note',
          content: 'This is a test note content'
        });

      expect(response.status).toBe(401);
    });

    it('should reject note creation with missing title', async () => {
      const response = await request(app)
        .post('/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'This is a test note content'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /notes', () => {
    it('should retrieve all notes for authenticated user', async () => {
      // Create a note first
      await request(app)
        .post('/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Note',
          content: 'This is a test note content'
        });

      const response = await request(app)
        .get('/notes')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('notes');
      expect(response.body.notes).toHaveLength(1);
    });

    it('should return empty array when no notes exist', async () => {
      const response = await request(app)
        .get('/notes')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.notes).toHaveLength(0);
    });
  });

  describe('PUT /notes/:id', () => {
    it('should update a note with valid data', async () => {
      // Create a note first
      const createResponse = await request(app)
        .post('/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Note',
          content: 'This is a test note content'
        });

      const noteId = createResponse.body.note._id;

      const response = await request(app)
        .put(`/notes/${noteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Note',
          content: 'Updated content'
        });

      expect(response.status).toBe(200);
      expect(response.body.note.title).toBe('Updated Note');
      expect(response.body.note.content).toBe('Updated content');
    });

    it('should return 404 for non-existent note', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/notes/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Note'
        });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /notes/:id', () => {
    it('should delete a note', async () => {
      // Create a note first
      const createResponse = await request(app)
        .post('/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Note',
          content: 'This is a test note content'
        });

      const noteId = createResponse.body.note._id;

      const response = await request(app)
        .delete(`/notes/${noteId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);

      // Verify note is deleted
      const getResponse = await request(app)
        .get('/notes')
        .set('Authorization', `Bearer ${authToken}`);

      expect(getResponse.body.notes).toHaveLength(0);
    });

    it('should return 404 for non-existent note', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/notes/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });
});

