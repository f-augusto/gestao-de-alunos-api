import { api } from '../helpers/api.js';
import { expect } from 'chai';
import { comTokenDeAdmin, comTokenDeAluno } from '../helpers/auth.js';
import { randomUUID } from 'crypto';
import trabalhos from '../fixtures/trabalhos.json' with { type: 'json' };

describe('Entrega de Trabalho', () => {
    trabalhos.forEach(trabalho => {
        it(trabalho.testTitle, async () => {
            const uuid = randomUUID();

            // Login Admin
            const adminToken = await comTokenDeAdmin();

            // Cadastrar Aluno
            const emailAlunoUnico = `${trabalho.dadosAluno.email.split('@')[0]}.${uuid}@example.com`;
            const matriculaAlunoUnica = `${trabalho.dadosAluno.matricula}${uuid}`;
            const cadastroAlunoResposta = await api()
                .post('/api/admin/alunos')
                .set('Content-Type', 'application/json')
                .set('Authorization', adminToken)
                .send({
                    ...trabalho.dadosAluno,
                    email: emailAlunoUnico,
                    matricula: matriculaAlunoUnica
                });

            const alunoId = cadastroAlunoResposta.body.id;

            // Matricular Aluno na Disciplina
            const cadastroMatriculaResposta = await api()
                .post(`/api/admin/disciplinas/${trabalho.disciplinaIdMatricula}/matriculas`)
                .set('Content-Type', 'application/json')
                .set('Authorization', adminToken)
                .send({ alunoId });

            // Login como Aluno
            const alunoToken = await comTokenDeAluno(emailAlunoUnico, trabalho.dadosAluno.senha);

            // Registrar Entrega de Trabalho
            const entregaTrabalhoResposta = await api()
                .post(`/api/alunos/${alunoId}/trabalhos`)
                .set('Content-Type', 'application/json')
                .set('Authorization', alunoToken)
                .send(trabalho.dadosTrabalho);
            
            expect(entregaTrabalhoResposta.status).to.equal(trabalho.statusCodeEsperado);
            expect(entregaTrabalhoResposta.body).to.deep.include(trabalho.respostaTrabalho);
        });
    });
});

