import { Router } from "express";

import {
  createPet,
  getMyPets,
  getPetById,
  updatePet,
  deletePet,
} from "../controllers/petController.js";

import { auth } from "../middleware/authMiddleware.js";

const petsRouter = Router();

petsRouter.post(`/`, auth, createPet);
petsRouter.get(`/`, auth, getMyPets);
petsRouter.get(`/:id`, auth, getPetById);
petsRouter.put(`/`, auth, updatePet);
petsRouter.delete("/:id", auth, deletePet);

export default petsRouter;
