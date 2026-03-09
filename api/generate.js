module.exports = async (req, res) => {
  res.status(200).json({ ok: true, env: !!process.env.OPENAI_API_KEY });
};
