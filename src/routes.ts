import app from './app'
import { post as createPost, put as updatePost, remove as deletePost, getOne as getPost, getAll as getPosts } from "./controllers/post";
import { post as createCategory, put as updateCategory, remove as deleteCategory, getOne as getCategory, getAll as getCategories } from "./controllers/category";
import  { signup, login, getAllUsers, updateUser, deleteUser, getOneUser }  from "./controllers/user";

const checkAuth = require("./middleware/check-auth");
const permission =  require ("./middleware/permission");

app.get('/', (req, res) => {
    res.send({
        "liu": "Laureate International Universities"
    })
});

app.post('/category', checkAuth,permission("Admin", "Editor"), createCategory);
app.get('/category', checkAuth, permission("Admin", "Editor", "Viewer"), getCategories);
app.get('/category/:id', checkAuth,permission("Admin", "Editor", "Viewer"), getCategory);
app.put('/category/:id', checkAuth, updateCategory);
app.delete('/category/:id', checkAuth, deleteCategory);

app.post('/post', checkAuth, permission("Admin", "Editor"), createPost);
app.get('/post', checkAuth, permission("Admin", "Editor", "Viewer"),getPosts);
app.get('/post/:id', checkAuth,permission("Admin", "Editor", "Viewer"), getPost);
app.put('/post/:id', checkAuth,permission("Admin", "Editor"), updatePost);
app.delete('/post/:id', checkAuth,permission("Admin", "Editor"), deletePost);

app.post('/signup', signup);
app.post('/login', login);
app.get('/users',checkAuth, permission("Admin"), getAllUsers);
app.get('/user/:id',checkAuth, permission("Admin"), getOneUser);
app.put('/user/:id', checkAuth,permission("Admin"),  updateUser);
app.delete('/user/:id', checkAuth,permission("Admin"),  deleteUser);
