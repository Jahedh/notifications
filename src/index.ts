import express from 'express';
import notificationsRoutes from './routes/notifications';
import * as prometheus from 'prom-client';

const httpRequestDurationMicroseconds = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route'],
  buckets: [0.1, 0.5, 1, 5, 10],
});

const requestsTotal = new prometheus.Counter({
  name: 'express_requests_total',
  help: 'Total number of Express endpoint requests',
  labelNames: ['endpoint'],
});

export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/notifications', notificationsRoutes);

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Hello, TypeScript Express!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// set middleware to capture metrics time taken and total requests
app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  
  res.on('finish', () => {
    end({ method: req.method, route: req.route ? req.route.path : 'unknown' });
    requestsTotal.inc({ endpoint: req.path }); 
  });

  next();
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);

  try {
    const metrics = await prometheus.register.metrics();
    res.end(metrics);
  } catch (error) {
    console.error('Error generating metrics:', error);
    res.status(500).end('Internal Server Error');
  }
});

app.get('/notification', (req, res) => {
  requestsTotal.inc({ endpoint: '/notifications' });
});