import { api } from './api.js';
import 'dotenv/config';

let tokenEmCache = null

export async function getToken(emailUser, passUser) {
    const loginResposta = await api()
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({ email: emailUser, senha: passUser });

    return loginResposta.body.token;
}

export async function comTokenDeAdmin() {
    if (!tokenEmCache) {
        tokenEmCache = await getToken(process.env.ADMIN_EMAIL, process.env.ADMIN_SENHA);
    }

    return `Bearer ${tokenEmCache}`;
}

export async function comTokenDeAluno(email, senha) {
    const token = await getToken(email, senha);
    return `Bearer ${token}`;
}