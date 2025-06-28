const Dog = require("../models/Dogs");
const mongoose = require("mongoose");

//gets all the dogs
module.exports.dogs_get = async (req, res) => {
  const page = Math.max(0, parseInt(req.query.p) || 0);
  const dogsPerPage = 3;

  try {
    const dogs = await Dog.find()
      .skip(page * dogsPerPage)
      .limit(dogsPerPage)
      .exec();

    res.render("dogs", { dogs, page, user: req.user });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

//gets one dog by id
module.exports.dog_get = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid document ID" });
  }

  try {
    const dog = await Dog.findById(id);
    if (!dog) {
      return res.status(404).json({ error: "Dog not found" });
    }
    res.status(200).json(dog);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Could not fetch document" });
  }
};

//update dog by id
module.exports.dog_patch = async (req, res) => {
  const id = req.params.id;
  const updates = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const updatedDog = await Dog.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    if (!updatedDog) {
      return res.status(404).json({ error: "Dog not found" });
    }
    res.status(200).json(updatedDog);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Could not update document" });
  }
};

//create a new dog
module.exports.dogs_post = async (req, res) => {
  const { name, description, isAdopted } = req.body;
  const user = req.user;

  if (!name || !description) {
    return res.status(400).json({
      errors: {
        name: name ? "" : "Name is required",
        description: description ? "" : "Description is required",
      },
    });
  }

  try {
    if (!user) {
      return res
        .status(401)
        .json({ error: "You need to be logged in to register a dog" });
    }
    const dog = await Dog.create({
      name,
      description,
      isAdopted: false,
      registeredBy: user._id,
    });

    await dog.save();

    res.status(201).json({ insertedId: dog._id });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      errors: { name: "Invalid input", description: "Invalid input" },
    });
  }
};

//delete a dog
module.exports.dog_delete = async (req, res) => {
  const userId = req.user._id;
  const dogId = req.params.id;

  if (!userId) {
    return res.status(401).send("User not authenticated");
  }

  try {
    const dog = await Dog.findById(dogId);

    if (!dog) return res.status(404).send("Dog not found");

    if (dog.registeredBy.toString() !== userId.toString()) {
      return res
        .status(403)
        .send("Not authorized to remove dog from adoption list");
    }

    //can't delete dog if adopted
    if (dog.isAdopted) {
      return res.status(400).send("Dog is already adopted. Cannot remove");
    }

    await Dog.findByIdAndDelete(dogId);
    res.status(200).send("Dog removed");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
};

//gets all dogs registered by the user
module.exports.registered_get = async (req, res) => {
  const page = Math.max(0, parseInt(req.query.p) || 0);
  const dogsPerPage = 3;
  const userId = req.user._id;

  try {
    const dogs = await Dog.find({ registeredBy: userId })
      .skip(page * dogsPerPage)
      .limit(dogsPerPage)
      .exec();

    res.render("registeredDogs", { dogs, page, user: req.user });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};

//gets all the dogs adopted by the user
module.exports.adopted_get = async (req, res) => {
  const page = Math.max(0, parseInt(req.query.p) || 0);
  const dogsPerPage = 3;
  const userId = req.user._id;

  try {
    const dogs = await Dog.find({ adoptedBy: userId })
      .skip(page * dogsPerPage)
      .limit(dogsPerPage)
      .exec();

    res.render("adoptedDogs", { dogs, page, user: req.user });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
};
