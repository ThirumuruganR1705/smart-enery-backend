exports.turnOnMotor = async (req, res) => {
  // Todo
  try {
    res.status(200).json({ message: "turned on motor" });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
}