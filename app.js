import express from 'express';
import Joi from 'joi';

const app = express();

app.use(express.json());  // enable is not enabled by default

const schema = Joi.object({
    name: Joi.string().min(3).required()
});

const port = process.env.PORT || 3000; // if process.env.PORT is not set, take 3000 as default

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'},
]

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

// request with query parameters
app.get('/api/posts/:year/:month', (req, res) => {
    res.send({...req.query, ...req.params});
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        return res.status(404).send('Unable to find a course with the given ID.');
    };
    res.send(course);
});


app.post('/api/courses', (req, res) => {

    const {error} = schema.validate(req.body); // Object destructuring
    if (error) {
        // 400 Bad Request
        return res.status(400).send(error.details[0].message);
    };

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        return res.status(404).send('Unable to find a course with the given ID.');
    };

    const {error} = schema.validate(req.body); // Object destructuring
    if (error) {
        // 400 Bad Request
        return res.status(400).send(error.details[0].message);
    };

    course.name = req.body.name
    res.send(course)
});

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        return res.status(404).send('Unable to find a course with the given ID.');
    };

    const index = courses.indexOf(course);
    courses.splice(index, 1);
        
    res.send(course)
});

app.listen(port, function() {
    console.log(`Listening on port ${port}`)
});
