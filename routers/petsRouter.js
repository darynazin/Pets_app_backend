import { Router } from "express";

import {
  createPet,
  getMyPets,
  getPetById,
  updatePet,
} from '../controllers/petController.js';

import { auth } from '../middleware/authMiddleware.js';

const petsRouter = Router();

petsRouter.post(`/`,auth, createPet);
petsRouter.get(`/`, auth, getMyPets);
petsRouter.get(`/id`, getPetById);
petsRouter.put(`/`, auth, updatePet);

export default petsRouter;