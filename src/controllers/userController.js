import bcrypt from 'bcryptjs';
import userModel from '../models/userModel.js';


export async function newUser(req, res) {
    let { username, password, name, role, codFunc, cpf } = req.body;

    name = name.toUpperCase();

    if (!username || !password || !name || !role) {
        res.status(400).json({
            message: 'Usuário, senha, nome completo, regra e CPF são obrigatórios'
        });
    }

    if (codFunc) {
        const r = await userModel.validateEmployee(codFunc);

        if (r) {
            res.status(r.code).json(r.msg)
        }
    }

    if (!cpf) {
        cpf = null;
    }


    try {
        // Verifica se o novo funcionário já existe e cria
        let employeeData = { name, cpf, user: req.user.user }
        const verifyNewEmployee = await userModel.verifyEmployee(employeeData);

        // Verifica se o novo usuário já existe
        const verifyNewUser = await userModel.verifyUser(name);

        // Criptografa a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Cria novo usuário
        let userData = { username, hashedPassword, name, role, cpf }
        await userModel.newUser(userData);

        if (verifyNewEmployee.code === 201 && verifyNewUser.code === 201) {
            res.status(201).json('Usuário cadastrados e vinculado ao funcionario com sucesso');
        } else if (verifyNewEmployee.code === 201 && verifyNewUser.code === 409) {
            res.status(201).json('Usuário já existente, vinculo com funcionario criado com sucesso');
        } else if (verifyNewEmployee.code === 409 && verifyNewUser.code === 409) {
            res.status(200).json('Já existe usuário e funcionário cadastrados.');
        } else if (verifyNewEmployee.code === 409 && verifyNewUser.code === 201) {
            res.status(200).json('Usuário cadastrado e vinculado a funcionário já existente')
        } else {
            res.status(204).json({ msg: 'Algum outro erro', cpf })
            console.log('Fim')
        }

    } catch (err) {

        console.error(err.errorNum);
        res.status(500).json({ message: 'Erro ao criar usuário' });

    }
};

export async function allUsers(req, res) {
    try {
        const users = await allUsersModel();
        res.json(users);
    } catch (err) {
        res.json(err)
    }
};

export async function alterPassword(req, res) {
    const { username, newPassword } = req.body;

    try {
        const alteredPassword = await alterPasswordModel(username, newPassword);
        res.json(alteredPassword);
    } catch (err) {
        res.json(err);
    }
};

export async function inactivateUser(req, res) {
    const { username } = req.params;

    try {
        const inactivatedUser = await inactivateUserModel(username);
        res.status(200).json(inactivatedUser);
    } catch (err) {
        res.json(err);
    };
};

export async function userAlter(req, res) {
    const { username } = req.params;
    const { name, role, cpf } = req.body;

    if (!name && !role && !cpf) {
        return res.status(400).json({ message: 'Pelo menos um dos campos (nome completo, regra ou CPF) deve ser fornecido para alteração.' });
    }

    try {
        const alteredUser = await userAlterModel(username, name, role, cpf);
        res.json({ message: alteredUser });
    } catch (err) {
        res.json(err);
    }
};

export default {
    newUser,
    allUsers,
    alterPassword,
    inactivateUser,
    userAlter
};
