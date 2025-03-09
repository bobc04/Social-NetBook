const router = require('express').Router();
const { User, Thought } = require('../../models');

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().populate('thoughts friends');
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET a single user by ID
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('thoughts friends');
    if (!user) return res.status(404).json({ message: 'No user found' });
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST a new user
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json(err);
  }
});

// PUT to update a user
router.put('/:userId', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).json({ message: 'No user found' });
    res.json(user);
  } catch (err) {
    res.status(400).json(err);
  }
});

// DELETE a user and their thoughts
router.delete('/:userId', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) return res.status(404).json({ message: 'No user found' });
    await Thought.deleteMany({ _id: { $in: user.thoughts } });
    res.json({ message: 'User and thoughts deleted' });
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST to add a friend
router.post('/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'No user found' });
    res.json(user);
  } catch (err) {
    res.status(400).json(err);
  }
});

// DELETE a friend
router.delete('/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { friends: req.params.friendId } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'No user found' });
    res.json(user);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;