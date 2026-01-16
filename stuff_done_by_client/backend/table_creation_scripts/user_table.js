
import sequelize from '../lib/db.js';
import User from '../models/user.model.js';
import VideoGuide from '../models/video.model.js';
import SpeciesDictionary from '../models/speciesDictionary.model.js';
import TextModel from '../models/text.model.js';

sequelize.sync({ force: false })
  .then(() => {
    console.log('Database tables synchronized successfully!');
  })
  .catch(err => {
    console.error('Failed to synchronize database:', err);
  });