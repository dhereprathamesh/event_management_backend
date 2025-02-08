import * as authService from "../services/authService.js";

export const login = async (req, res) => {
  const { userName, password } = req.body;
  try {
    const response = await authService.login({ userName, password });
    return res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const register = async (req, res) => {
  const { userName, password, name } = req.body;
  try {
    const response = await authService.register({
      userName,
      password,
      name
    });

    return res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};