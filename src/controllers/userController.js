import { UserService } from '../services/userService.js';

export const register = async (req, res) => {
  try {
    const { email, fullName, password } = req.body;
    const token = await UserService.registerUser(email, fullName, password);
    res.status(201).json({ token });
  }
  catch (err) {
    res.status(err.status || 500).json({
      message: err.message || 'Error occured during registration'
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const token = await UserService.loginUser(email, password);

    res.json({
      token
    });
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || 'Error occured during registration'
    });
  };
};

export const getMe = async (req, res) => {
  try {
    const user = await UserService.getCurrentUser(req.userId);
    
    res.json(user);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "No access"
    });
  }
};