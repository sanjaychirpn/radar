import 'reflect-metadata';

import * as express from 'express';
import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { connectToDb } from './configuration/db';
import * as cors from 'cors';
import { UserRoutes } from './routes/userRoutes';
import { AdminRoutes } from './routes/adminRoutes';
import { ExamCenterRoutes } from './routes/examCenterRoutes';
import { UserRoleRoutes } from './routes/userRoleRoutes';
import { EmployeeTypeRoutes } from './routes/employeeTypeRoutes';
import { ChecklistRoutes } from './routes/checklistRoutes';
import { EventEmitter } from 'events';
EventEmitter.defaultMaxListeners = 20;
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URL: string = process.env.MONGODB_URL || 'mongodb+srv://ssingh1:n94VZu0N2bXpLUCZ@cluster0.cc9ztjt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(cors({}));

const startServer = async () => {
    await connectToDb(MONGODB_URL);

    app.use('/api/user', UserRoutes);
    app.use('/api/admin', AdminRoutes);
    app.use('/api/exam-center', ExamCenterRoutes);
    app.use('/api/user-role', UserRoleRoutes);
    app.use('/api/employee-type', EmployeeTypeRoutes);
    app.use('/api/checklist', ChecklistRoutes);

    app.get('/health', (req: Request, res: Response) => {
        res.send('server is up');
    });

    app.all('*', (req: Request, res: Response) => {
        res.status(404).json({
            message: `Path '${req.path}' does not exist`,
        });
    });

    app.listen(PORT, () => {
        console.log(`app is listening on port ${PORT}`);
    });
};

startServer();

export default app;