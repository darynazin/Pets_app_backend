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
  console.log("Session:", req.session); // Add this line
  console.log("User:", req.session?.user); // Add this line

  const ownerId = req.session.user.id;
  const { name, species, breed, birthDate, image, additionalNotes } = req.body;

  const newPet = new Pet({
    name,
    species,
    breed,
    birthDate,
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
