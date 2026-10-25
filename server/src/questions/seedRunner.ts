import dotenv from 'dotenv';
import { connectDatabase, isDatabaseConnected } from '../config/database';
import { Question } from '../models/Question';
import { SEED_QUESTIONS } from './seedQuestions';

dotenv.config();

async function runSeed() {
  console.log('🌱 Starting Quiz Royale database seeder...');
  const connected = await connectDatabase();
  if (!connected) {
    console.error('❌ Cannot seed database: MongoDB is not connected.');
    process.exit(1);
  }

  try {
    console.log(`Checking existing questions in MongoDB...`);
    const count = await Question.countDocuments();
    console.log(`Found ${count} questions in database.`);

    if (process.argv.includes('--force') || count === 0) {
      if (process.argv.includes('--force')) {
        console.log('⚠️ --force flag specified: clearing existing questions...');
        await Question.deleteMany({});
      }
      console.log(`Inserting ${SEED_QUESTIONS.length} verified questions...`);
      await Question.insertMany(SEED_QUESTIONS);
      console.log(`✅ Successfully seeded ${SEED_QUESTIONS.length} questions into MongoDB!`);
    } else {
      console.log('ℹ️ Questions already exist in database. Use `npm run seed -- --force` to overwrite.');
    }
    process.exit(0);
  } catch (err: any) {
    console.error('❌ Error during seeding:', err.message);
    process.exit(1);
  }
}

runSeed();
