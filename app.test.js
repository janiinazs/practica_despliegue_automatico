const request = require('supertest');
const express = require('express');
const fs = require('fs');
const app = require('./index');

describe('API de pasteles', () => {
  const testCake = { id: 'test123', name: 'Pastel de Prueba', flavor: 'Coco', price: 12.50 };

  afterAll(() => {
    // Limpieza: eliminar pastel de prueba si existe
    try {
      const cakes = JSON.parse(fs.readFileSync('./cakes.json', 'utf8'));
      const filtered = cakes.filter(c => c.id !== testCake.id);
      fs.writeFileSync('./cakes.json', JSON.stringify(filtered, null, 2), 'utf8');
    } catch (err) {
      console.error("No se pudo limpiar el archivo cakes.json", err);
    }
  });

  it('Debe cargar la interfaz web en el endpoint raíz', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    // Ahora verificamos que devuelva el HTML de tu carpeta 'public'
    expect(res.headers['content-type']).toMatch(/text\/html/i);
  });

  it('Debe registrar un nuevo pastel', async () => {
    const res = await request(app).post('/cakes').send(testCake);
    expect(res.statusCode).toBe(201);
    expect(res.body.cake).toMatchObject(testCake);
  });

  it('Debe obtener todo el catálogo de pasteles', async () => {
    const res = await request(app).get('/cakes');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('Debe poder eliminar el pastel creado', async () => {
    const res = await request(app).delete(`/cakes/${testCake.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/eliminado/i);
  });
});
