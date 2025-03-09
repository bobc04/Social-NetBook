const router = require('express').Router();
const { Thought, User } = require('../../models');

// GET all thoughts
router.get('/', async (req, res) => {
  try {
    const thoughts = await Thought.find();
    res.json(thoughts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET a single thought by ID
router.get('/:thoughtId', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    if (!thought) return res.status(404).json({ message: 'No thought found' });
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST a new thought
router.post('/', async (req, res) => {
  try {
    const thought = await Thought.create(req.body);
    await User.findByIdAndUpdate(
      req.body.userId,
      { $push: { thoughts: thought._id } },
      { new: true }
    );
    res.json(thought);
  } catch (err) {
    res.status(400).json(err);
  }
});

// PUT to update a thought
router.put('/:thoughtId', async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(req.params.thoughtId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!thought) return res.status(404).json({ message: 'No thought found' });
    res.json(thought);
  } catch (err) {
    res.status(400).json(err);
  }
});

// DELETE a thought
router.delete('/:thoughtId', async (req, res) => {
  try {
    const thought = await Thought.findByIdAndDelete(req.params.thoughtId);
    if (!thought) return res.status(404).json({ message: 'No thought found' });
    res.json({ message: 'Thought deleted' });
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST a reaction
router.post('/:thoughtId/reactions', async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $push: { reactions: req.body } },
      { new: true, runValidators: true }
    );
    if (!thought) return res.status(404).json({ message: 'No thought found' });
    res.json(thought);
  } catch (err) {
    res.status(400).json(err);
  }
});

// DELETE a reaction
router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    );
    if (!thought) return res.status(404).json({ message: 'No thought found' });
    res.json(thought);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;