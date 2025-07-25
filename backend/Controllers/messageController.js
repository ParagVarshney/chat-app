const Message = require('../models/Message');

const getRoomMessages = async (req, res) => {
  try {
    const { room } = req.params;
    const messages = await Message.find({ room }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

module.exports = { getRoomMessages };

