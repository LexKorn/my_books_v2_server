const Router = require('express');
const router = new Router();

const userRouter = require('./userRouter');
const authorRouter = require('./authorRouter');
const bookRouter = require('./bookRouter');
const countryRouter = require('./countryRouter');
const noteRouter = require('./noteRouter');
const quoteRouter = require('./quoteRouter');

router.use('/user', userRouter);
router.use('/author', authorRouter);
router.use('/book', bookRouter);
router.use('/country', countryRouter);
router.use('/note', noteRouter);
router.use('/quote', quoteRouter);

module.exports = router;