const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const DB_FILE = './cakes.json';

app.use(express.json());
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.use(express.static(__dirname));

const readDatabase = () => {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

const writeDatabase = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
};

// 1. Obtener todos los pasteles
app.get('/cakes', (req, res) => {
    const cakes = readDatabase();
    res.json(cakes);
});

// 2. Registrar un nuevo pastel
app.post('/cakes', (req, res) => {
    const cakes = readDatabase();
    const newCake = req.body;

    if (!newCake.id || !newCake.name || !newCake.flavor || !newCake.price) {
        return res.status(400).json({ error: 'ID, name, flavor y price son requeridos' });
    }

    if (cakes.some((cake) => cake.id === newCake.id)) {
        return res.status(400).json({ error: 'Ya existe un pastel con ese ID' });
    }

    cakes.push(newCake);
    writeDatabase(cakes);
    res.status(201).json({ message: 'Pastel registrado', cake: newCake });
});

// 3. Actualizar un pastel
app.put('/cakes/:id', (req, res) => {
    const cakes = readDatabase();
    const cakeId = req.params.id;
    const updatedCake = req.body;
    const cakeIndex = cakes.findIndex((cake) => cake.id === cakeId);

    if (cakeIndex === -1) {
        return res.status(404).json({ error: 'Pastel no encontrado' });
    }

    cakes[cakeIndex] = { ...cakes[cakeIndex], ...updatedCake };
    writeDatabase(cakes);
    res.json({ message: 'Pastel actualizado', cake: cakes[cakeIndex] });
});

// 4. Eliminar un pastel
app.delete('/cakes/:id', (req, res) => {
    const cakes = readDatabase();
    const cakeId = req.params.id;
    const filteredCakes = cakes.filter((cake) => cake.id !== cakeId);

    if (filteredCakes.length === cakes.length) {
        return res.status(404).json({ error: 'Pastel no encontrado' });
    }

    writeDatabase(filteredCakes);
    res.json({ message: 'Pastel eliminado' });
});

module.exports = app;

if (require.main === module) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Servidor de Pastelería corriendo en http://0.0.0.0:${PORT}`);
    });
}