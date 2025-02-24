import Pet from "../models/Pet.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getMyPets = asyncHandler(async (req, res, next) => {
  const userId = req.session.user.id;
  const pets = await Pet.find({ ownerId: userId });

  if (!pets || pets.length === 0) {
    return res.json([]);
  }

  res.status(200).json(pets);
});

export const getPetById = asyncHandler(async (req, res, next) => {
  const pet = await Pet.findById(req.params.id);
  if (!pet) {
    throw new ErrorResponse("Pet not found", 404);
  }
  res.status(200).json(pet);
});

// Create a new pet
export const createPet = asyncHandler(async (req, res, next) => {
  const ownerId = req._;
  const { name, species, breed, age, image, additionalNotes } = req.body;

  const newPet = new Pet({
    name,
    species,
    breed,
    age,
    image,
    additionalNotes,
    ownerId,
  });

  await newPet.save();

  res.status(201).json(newPet);
});

// Update pet by ID
export const updatePet = asyncHandler(async (req, res, next) => {
  const update = req.body;

  const updatedPet = await Pet.findByIdAndUpdate(update._id, update, {
    new: true,
    runValidators: true,
  });

  if (!updatedPet) {
    throw new ErrorResponse("Pet not found", 404);
  }

  res.status(200).json({ message: "Pet updated successfully", updatedPet });
});

// Delete Pet
export const deletePet = asyncHandler(async (req, res, next) => {
  const pet = await Pet.findById(req.params.id);

  if (!pet) {
    throw new ErrorResponse("Pet not found", 404);
  }

  if (pet.ownerId.toString() !== req.session.user.id) {
    throw new ErrorResponse("Not authorized to delete this pet", 403);
  }

  await Pet.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: "Pet deleted successfully" });
});
