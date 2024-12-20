import request from 'supertest';
import app from '../src'; 
import fs from 'fs';


describe('GET /api/download/:fileName', () => {
    const filenameToDownload = "gianlu.jpg";    
    it('deberia devolver 200', async () => {
        let response = await request(app)
        .post('/login') 
        .send({             
            username: "santialvarez", 
            password: "riverPL4T3$"
        });

        const token = response.body.token;
        
        response = await request(app)
        .get(`/api/download/${filenameToDownload}`)
        .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
    })
    it('deberia devolver 404', async () => {
        let response = await request(app)
        .post('/login') 
        .send({             
            username: "santialvarez", 
            password: "riverPL4T3$"
        });

        const token = response.body.token;
        
        response = await request(app)
        .get(`/api/delete/algo`)
        .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
    })
})

describe('POST /api/share', () => {
    it('debería devolver 200 - archivo compartido correctamente', async () => {
        let response = await request(app)
          .post('/login')
          .send({
            username: "santialvarez", 
            password: "riverPL4T3$"
          });
        
        const token = response.body.token;
        
        // Realiza la solicitud POST con el archivo en un Buffer
        response = await request(app)
        .post('/api/share')
        .set('Authorization', `Bearer ${token}`)
        .send({             
            "targetUsername": "jerrySeinfeld",
            "fileName": "gianlu.jpg"
        })
        
        expect(response.status).toBe(200); 
      });
});

describe('POST /api/upload', () => {
    it('deberia devolver 400 - no hay archivo', async () => {
        let response = await request(app)
        .post('/login') 
        .send({             
            username: "santialvarez", 
            password: "riverPL4T3$"
        });    
        
        const token = response.body.token;
        
        response = await request(app)
        .post('/api/upload') 
        .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(400);
    });
    it('debería devolver 200 - archivo subido correctamente', async () => {
        let response = await request(app)
          .post('/login')
          .send({
            username: "andresCalamaro", 
            password: "riverPL4T3$"
          });
        
        const token = response.body.token;
        
        // Lee el archivo en un buffer (usando fs)
        const fileBuffer = fs.readFileSync('./public/images/gianlu.jpg');  

        // Realiza la solicitud POST con el archivo en un Buffer
        response = await request(app)
        .post('/api/upload')
        .set('Authorization', `Bearer ${token}`)
        .attach('file', fileBuffer, 'gianlu.jpg');  
        
        expect(response.status).toBe(200);  
      });
});

describe('DELETE /api/delete/:fileName', () => {
    const filenameToDelete = "gianlu.jpg";    
    it('deberia devolver 200', async () => {
        let response = await request(app)
        .post('/login') 
        .send({             
            username: "jerrySeinfeld", 
            password: "riverPL4T3$"
        });

        const token = response.body.token;
        
        response = await request(app)
        .delete(`/api/delete/${filenameToDelete}`)
        .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
    })
    it('deberia devolver 500', async () => {
        let response = await request(app)
        .post('/login') 
        .send({             
            username: "santialvarez", 
            password: "riverPL4T3$"
        });

        const token = response.body.token;
        
        response = await request(app)
        .delete(`/api/delete/algo`)
        .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(500);
    })
});




