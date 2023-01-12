const express = require('express');
const db = require('./DB/db');
const { conn, models: { User, Product, Order, Lineitem } } = db;
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const passport = require('passport');
const router = express.Router();

router.use(express.json());

// USERS //

router.get('/api/users', async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.send(users.map(user =>({
      id: user.id,
      email: user.email,
      name: user.name
    })))
  }
  catch(ex) {
    next(ex)
  }
});

router.post('/api/users', async (req, res, next) => {
  try {
    const user = User.create(req.body)
    res.status(201).send(user)
  }
  catch(ex) {
    next(ex)
  }
})

router.put('/api/users', async ( req, res, next ) => {
  try {
    const instance = await User.findByPk(req.body.id);
    Object.assign(instance, req.body);
    instance.save();
    res.send(instance);
  }
  catch(ex) {
    next(ex)
  }
});

router.get('/api/users/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    res.send(user)
  }
  catch(ex) {
    next(ex)
  }
});

// PRODUCTS //

router.get('/api/products', async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.send(products)
  }
  catch(ex) {
    next(ex)
  }
});

router.get('/api/products/:id', async (req, res, next) => {
  try {
    const products = await Product.findByPk(req.params.id);
    res.send(products)
  }
  catch(ex) {
    next(ex)
  }
});

// LINEITEMS //

router.get('/api/lineitem', async ( req, res, next ) => {
  try {
    const lineitems = await Lineitem.findAll( { include: [ Product ] });
    res.send(lineitems);
  }
  catch(ex) {
    next(ex)
  }
});

router.delete('/api/lineitem/:id', async ( req, res, next ) => {
  try {
    await Lineitem.destroy({ where: {id: req.params.id} });
    res.sendStatus(201);
  }
  catch(ex) {
    next(ex);
  }
});

router.put('/api/lineitem', async ( req, res, next ) => {
  try {
    const instance = await Lineitem.findByPk(req.body.id, {include: [Product]});
    if (req.body.method === 'add') {
      instance.quantity = ++instance.quantity;
    }
    if (req.body.method === 'subtract' && instance.quantity > 1) {
      instance.quantity = --instance.quantity;
    }
    instance.save();

    res.send(instance);
  }
  catch(ex) {
    next(ex)
  }
});

// ORDERS //

router.post('/api/orders', async(req, res, next) => {
  const order = await Order.create(req.body)
  res.send(order);
})

router.get('/api/orders', (req, res, next) => {
  Order.findAll()
    .then(orders => res.send(orders))
    .catch(next);
});

// AUTHENTICATION //

//these lines serialize the user
passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.models.User.findByPk(id)
    done(null, user)
  } catch (err) {
    done(err)
  }
})


///using connect-sess-seq to create model for db to log sessions into the store fluidly
const ourStore =  new SequelizeStore({ db: conn });

//middleware for the store
router.use(session({
  secret: 'playback4321',
  store: ourStore,
  resave: false,
  proxy: true
}));

///sync sessions to store
ourStore.sync();

//passport middleware to create sessions
router.use(passport.initialize());
router.use(passport.session());
router.use(express.urlencoded({extended: true}))

////post route, first finds user with email => if not valid email, err, => if email exits but password doesnt match, err => both match, session logs in
router.post('/api/login', (req, res, next) => {
  User.findOne({where:{email: req.body.email}})
    .then(user => {
      if (!user){
        res.status(401).send('Wrong email and/or password');
      } else if (!user.correctPassword(req.body.password, user)){
        req.status(401).send('Wrong email and/or password');
      } else {
        req.login(user, err => (err ? next(err) : res.json(user)));
        //res.redirect('/api/products');
      }
    })
    .catch(next)
  });

////for sign up once we have it, create user with body info, once created, logs in. if not created because email exists in db, error occurs
router.post('/api/register', (req, res, next)=>{
  User.create(req.body)
    .then(user => {
      req.session.user = user
      req.login(user, err => (err ? next(err) : res.json(user)))
    })
    .catch(err => {
      if(err.name === 'SequelizeUniqueConstraintError'){
        res.status(401).send('User already xists');
      } else {
        next(err)
      }
    })
})

////logout button link, deletes session and sends back to home
router.delete('/api/logout', (req, res, next) => {
  req.logout();
  res.redirect('/api/');
});

router.post('/api/lineitem', async (req, res, next) => {
  try {
    if(req.user){
      let order = Order.findOne({ where: { purchased: false, userId: req.user.dataValues.id } })
      if (!order) {
        order = await Order.create({ purchased: false, userId: req.user.dataValues.id })
      }

      const item = await Lineitem.create({...req.body, orderId : order.id})
      const product = await Product.findByPk(item.productId)
      const lineitem = {...item.dataValues, product}
      res.status(201).send(lineitem)
    }
  }
  catch(ex) {
    next(ex)
  }
});

router.get('/api/me', (req, res, next)=>{
  res.json(req.user);
});


module.exports = router;