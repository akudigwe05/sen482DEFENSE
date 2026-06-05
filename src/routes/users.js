const express = require('express');
const router  = express.Router();
 
const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob',   email: 'bob@example.com'   },
];
 
router.get('/',      (req, res) => res.json(users));
router.get('/:id',   (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  return user ? res.json(user) : res.status(404).json({ error: 'User not found' });
});
 
module.exports = router;
 
