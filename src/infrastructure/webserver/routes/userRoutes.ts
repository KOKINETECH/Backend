import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { AuthInteractor } from '../../../application/usecases/AuthInteractor';
import { InMemoryUserRepository } from '../../repositories/InMemoryUserRepository';

const router = Router();

const userRepository = new InMemoryUserRepository();
const authInteractor = new AuthInteractor(userRepository);
const userController = new UserController(authInteractor);

router.post('/register', userController.onRegister);
router.post('/login', userController.onLogin);
router.post('/refresh', userController.onRefresh);
router.post('/logout', userController.onLogout);

// ON TESTE SANS LE MIDDLEWARE POUR L'INSTANT
// Cela permet de vérifier que l'adresse (URL) fonctionne
router.get('/me', (req, res) => {
    res.json({ 
        message: "Succès ! La route /me répond enfin.",
        status: "Le serveur est bien configuré"
    });
});

export default router;