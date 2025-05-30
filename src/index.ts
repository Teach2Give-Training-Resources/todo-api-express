import express from 'express';
import user from './auth/auth.router';
import todo from './todo/todo.router';

const app = express();
app.use(express.json()); //used to parse JSON bodies

// routes
user(app);
todo(app);

app.get('/', (req, res) => {
    res.send('Hello, World!');
})

app.listen(8081, () => {
    console.log('Server is running on http://localhost:8081');
}) 