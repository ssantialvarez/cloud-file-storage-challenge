import request from 'supertest';
import app from '../src'; 


describe('POST /register', () => {
    it('deberia devolver 200 - insertado exitosamente', async () => {
        const response = await request(app)
        .post('/register') 
        .send({             
            username: "hernanCasciari", 
            password: "escritoCuentos"
        });
        
        expect(response.status).toBe(200);
    });

    it('deberia devolver 409 Conflict por que existe el usuario', async () => {
        const response = await request(app)
        .post('/register') 
        .send({             
            username: "santialvarez", 
            password: "riverPL4T3$"
        });
    
        expect(response.status).toBe(409);
    });
});

describe('POST /login', () => {
    it('deberia devolver el token de autenticacion', async () => {
        const response = await request(app)
        .post('/login') 
        .send({             
            username: "santialvarez", 
            password: "riverPL4T3$"
        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    })
    it('deberia devolver 400 por contraseña incorrecta', async () => {
        const response = await request(app)
        .post('/login') 
        .send({             
            username: "santialvarez", 
            password: "riverPlate$"
        });
        expect(response.status).toBe(400);
    })
})

describe('DELETE /delete/:username', () => {
    const usernameToDelete = "hernanCasciari";

    it('deberia devolver 200 - eliminado exitosamente', async () => {
        
        let response = await request(app)
        .post('/login') 
        .send({             
            username: "santialvarez", 
            password: "riverPL4T3$"
        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        
        const token = response.body.token;
        
        response = await request(app)
        .delete(`/delete/${usernameToDelete}`)
        .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
    })
    it('deberia devolver 403 forbidden por no ser admin', async () => {
        let response = await request(app)
        .post('/login') 
        .send({             
            username: "claromio", 
            password: "riverPL4T3$"
        });
        expect(response.status).toBe(200);

        const token = response.body.token;

        response = await request(app)
        .delete(`/delete/${usernameToDelete}`)
        .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(403);
    })
    it('deberia devolver 400 bad request el usuario a eliminar no existe', async () => {
        const usernameToDelete = "casciariHernan";
        let response = await request(app)
        .post('/login') 
        .send({             
            username: "santialvarez", 
            password: "riverPL4T3$"
        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        
        const token = response.body.token;
        
        response = await request(app)
        .delete(`/delete/${usernameToDelete}`)
        .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
    })
})

describe('GET /stats', () => {
    it('deberia devolver 200 - ', async () => {
        let response = await request(app)
        .post('/login') 
        .send({             
            username: "santialvarez", 
            password: "riverPL4T3$"
        });
        
        const token = response.body.token;
        
        response = await request(app)
        .get(`/stats`)
        .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        console.log(response.body);
    })
    it('deberia devolver 403 forbidden por no ser admin', async () => {
        let response = await request(app)
        .post('/login') 
        .send({             
            username: "claromio", 
            password: "riverPL4T3$"
        });

        const token = response.body.token;

        response = await request(app)
        .get(`/stats`)
        .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(403);
    })
})