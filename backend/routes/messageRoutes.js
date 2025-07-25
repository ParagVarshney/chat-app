const express = require('express');
const router = express.Router();
const { getRoomMessages } = require('../Controllers/messageController');

router.get('/:room', getRoomMessages);

module.exports = router;

