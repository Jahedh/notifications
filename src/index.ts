import express from 'express';
import commentsRoutes from './routes/comments';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Add this line to enable JSON parsing in the request body
app.use('/comments', commentsRoutes); // Add this line to mount the Task API routes

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Hello, TypeScript Express!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});