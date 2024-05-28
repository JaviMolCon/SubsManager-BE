const Contact = require("../schemas/Contact");

const postMessage = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const createMessage = await Contact.create({
      name,
      email,
      phone,
      message,
    });
    res.status(201).json({ message: "Messaged successfully sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { postMessage };
