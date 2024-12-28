const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Posts dosyasının yolu
const postsPath = path.join(__dirname, 'data', 'posts.json');

// Posts dosyasını oku
async function getPosts() {
    try {
        const data = await fs.readFile(postsPath, 'utf8');
        const posts = JSON.parse(data);
        // İçerikteki \n karakterlerini <br> ile değiştir
        posts.forEach(post => {
            post.content = post.content.replace(/\n/g, '<br>');
        });
        return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
        // Dosya yoksa oluştur
        await fs.writeFile(postsPath, '[]', 'utf8');
        return [];
    }
}

// Posts dosyasına yaz
async function savePosts(posts) {
    await fs.writeFile(postsPath, JSON.stringify(posts, null, 2));
}

// Ana sayfa
app.get('/', async (req, res) => {
    const posts = await getPosts();
    res.render('index', { posts });
});

// Yeni post oluşturma sayfası
app.get('/post/new', (req, res) => {
    res.render('create');
});

// Yeni post oluşturma
app.post('/post/new', async (req, res) => {
    /* Güvenlik nedeniyle devre dışı bırakıldı
    const posts = await getPosts();
    const newPost = {
        id: uuidv4(),
        title: req.body.title,
        content: req.body.content,
        date: new Date().toISOString()
    };
    posts.push(newPost);
    await savePosts(posts);
    res.redirect('/');
    */
    res.render('blocked');
});

// Post detay sayfası
app.get('/post/:id', async (req, res) => {
    const posts = await getPosts();
    const post = posts.find(p => p.id === req.params.id);
    if (!post) return res.redirect('/');
    res.render('post', { post });
});

// Post düzenleme sayfası
app.get('/post/:id/edit', async (req, res) => {
    const posts = await getPosts();
    const post = posts.find(p => p.id === req.params.id);
    if (!post) return res.redirect('/');
    res.render('edit', { post });
});

// Post güncelleme
app.post('/post/:id/edit', async (req, res) => {
    /* Güvenlik nedeniyle devre dışı bırakıldı
    const posts = await getPosts();
    const index = posts.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.redirect('/');

    posts[index] = {
        ...posts[index],
        title: req.body.title,
        content: req.body.content
    };

    await savePosts(posts);
    res.redirect(`/post/${req.params.id}`);
    */
    res.render('blocked');
});

// Post silme
app.post('/post/:id/delete', async (req, res) => {
    /* Güvenlik nedeniyle devre dışı bırakıldı
    const posts = await getPosts();
    const filteredPosts = posts.filter(p => p.id !== req.params.id);
    await savePosts(filteredPosts);
    res.redirect('/');
    */
    res.render('blocked');
});

app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
    console.log(`Ortam: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Tarih: ${new Date().toLocaleString()}`);
});