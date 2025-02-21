import Pet from "../models/Pet.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import asyncHandler from "../utils/asyncHandler.js";



export const getMyPets = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const pets = await Pet.find({ ownerId: userId });
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
  const ownerId = req.user.id;
  const { name, species, breed, age, image, additionalNotes } = req.body;

  const newPet = new Pet({
    name,
    species,
    breed,
    age,
    image,
    additionalNotes,
    ownerId
  });

  await newPet.save();

  res.status(201).json(newPet);
});

// Update pet by ID
export const updatePet = asyncHandler(async (req, res, next) => {
  const update = req.body;
  console.log(update);

  const updatedPet = await Pet.findByIdAndUpdate(update._id, update, {
    new: true,
    runValidators: true,
  });

  if (!updatedPet) {
    throw new ErrorResponse("Pet not found", 404);
  }

  res.status(200).json({ message: "Pet updated successfully", updatedPet });
});