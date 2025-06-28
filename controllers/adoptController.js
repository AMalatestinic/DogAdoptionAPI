const Dog = require("../models/Dogs");
const mongoose = require("mongoose");

const handleErrors = (err) => {
  console.log(err.message, err.code);
};

//gets the adopt form for a specific dog by id
module.exports.adopt_get = async (req, res) => {
  const dogId = req.params.id;

  try {
    const dog = await Dog.findById(dogId);

    if (!dog) return res.status(404).send("Dog not found");

    res.render("adopt", { dog });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(500).send("Server error");
  }
};

//updates the adopt form
module.exports.adopt_patch = async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid Dog Id" });
  }

  try {
    const dog = await Dog.findById(id);
    if (!dog) {
      return res.status(400).json({ error: "Dog not found" });
    }
    if (dog.isAdopted) {
      return res.status(400).json({ error: "Dog has already been adopted" });
    }

    dog.isAdopted = true;
    dog.adoptedBy = userId;
    dog.thankYouMessage = message;

    await dog.save();
    res.status(200).json({ message: "Dog adopted!", dog });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(500).json({ error: "Server error" });
  }
};

//sends the adopt form
module.exports.adopt_post = async (req, res) => {
  const dogId = req.params.id;
  const { message } = req.body;
  const userId = req.user.id;

  try {
    const dog = await Dog.findByIdAndUpdate(
      dogId,
      {
        isAdopted: true,
        thankYouMessage: message,
        adoptedBy: userId,
      },
      { new: true }
    );

    if (!dog) {
      return res.status(400).send("Adoption failed");
    }

    res.redirect("/");
  } catch (err) {
    const errors = handleErrors(err);
    res.status(500).send("Server error");
  }
};
