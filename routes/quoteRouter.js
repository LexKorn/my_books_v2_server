const Router = require('express');
const router = new Router();

const quoteController = require('../controllers/quoteController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, quoteController.create);
router.get('/', authMiddleware, quoteController.getAll);
router.get('/:id', authMiddleware, quoteController.getONe);
router.put('/:id', authMiddleware, quoteController.update);
router.delete('/:id', authMiddleware, quoteController.delete);

module.exports = router;