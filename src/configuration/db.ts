import mongoose from 'mongoose';

export const connectToDb = async (mongoUri: string) => {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any); // Cast to 'any' to bypass TypeScript checks
    console.log('Connected to database');
  } catch (error) {
    console.error('Could not connect to database:', error);
    process.exit(1); // Exit process with failure
  }
};
