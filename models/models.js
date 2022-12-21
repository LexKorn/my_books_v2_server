const sequelize = require('../db');
const {DataTypes} = require('sequelize');

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    username: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING}
});

const Author = sequelize.define('author', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.TEXT, allowNull: true},
    photo: {type: DataTypes.STRING, allowNull: true}
});

const Book = sequelize.define('book', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    link: {type: DataTypes.STRING, allowNull: true},
    rating: {type: DataTypes.INTEGER, defaultValue: 0},
    comment: {type: DataTypes.TEXT, allowNull: true},
    cover: {type: DataTypes.STRING, allowNull: true}
});

const Country = sequelize.define('country', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false}
});

const Note = sequelize.define('note', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false}
});

const Quote = sequelize.define('quote', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    quote: {type: DataTypes.TEXT, allowNull: false}
});


User.hasMany(Author);
Author.belongsTo(User);

User.hasMany(Book);
Book.belongsTo(User);

User.hasMany(Country);
Country.belongsTo(User);

User.hasMany(Note);
Note.belongsTo(User);

User.hasMany(Quote);
Quote.belongsTo(User);

Author.hasMany(Book);
Book.belongsTo(Author);

Book.hasMany(Quote);
Quote.belongsTo(Book);

Country.hasMany(Author);
Author.belongsTo(Country);

Country.hasMany(Book);
Book.belongsTo(Country);


module.exports = {
    User,     
    Author,
    Book,
    Country,
    Note,
    Quote
};