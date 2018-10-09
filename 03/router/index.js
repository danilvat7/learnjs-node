const Router = require('koa-router');

const router = new Router();

const Ctr = require('./../conroller');

router.get('/', Ctr.renderIndex);
router.get('/subscribe', Ctr.subscribe);
router.post('/publish', Ctr.publish);


module.exports = router; 