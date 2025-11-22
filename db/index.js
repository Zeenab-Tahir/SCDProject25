
const mongoose = require('mongoose');
const vaultEvents = require('../events');
require('dotenv').config();


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB Connection Error:', err));


const recordSchema = new mongoose.Schema({
  id: Number,
  name: String,
  value: String,
  created: { type: Date, default: Date.now }
});

const Record = mongoose.model('Record', recordSchema);



async function addRecord({ name, value }) {
  
  const id = Math.floor(Math.random() * 10000); 

  const newRecord = await Record.create({ id, name, value });
  
  vaultEvents.emit('recordAdded', newRecord);
  return newRecord;
}

async function listRecords() {
  
  return await Record.find({});
}

async function updateRecord(id, newName, newValue) 
{
  const record = await Record.findOne({ id });

  if (!record) return null;
  
  record.name = newName;

  record.value = newValue;
  await record.save();

  
  vaultEvents.emit('recordUpdated', record);

  return record;
}

async function deleteRecord(id) {
  const result = await Record.findOneAndDelete({ id });
  if (result) {
      vaultEvents.emit('recordDeleted', result);
  }
  return result;
}

module.exports = { addRecord, listRecords, updateRecord, deleteRecord };

